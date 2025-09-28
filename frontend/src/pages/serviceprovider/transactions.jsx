import { useState, useEffect } from "react";
import api from "../../lib/axios";
import toast, { Toaster } from "react-hot-toast";
import Footer from "../../components/Footer";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

const SPTransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Prevent browser from caching
    window.history.replaceState(null, "", window.location.href);
    window.onpopstate = () => {
      window.location.replace("/login");
    };
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await api.get(
          "/payment/provider/history",
          { withCredentials: true }
        );
        setTransactions(res.data);
      } catch (err) {
        console.error("Error fetching transactions:", err.response?.data || err.message);
        toast.error(err.response?.data?.message || "Failed to load transactions");
        if (err.response?.status === 401) navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [navigate]);

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Local Aid Management System", 14, 15);
    doc.setFontSize(12);
    doc.text("Transaction History Report", 14, 25);

    const tableData = transactions.map((t) => [
      t.receiptId,
      t.service || "N/A",
      t.customer || "N/A",
      `Rs. ${Number(t.amount).toFixed(2)}`,
      t.status,
      t.date || "N/A",
    ]);

    autoTable(doc, {
      head: [["Receipt ID", "Service", "Customer", "Amount", "Status", "Date"]],
      body: tableData,
      startY: 35,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    const date = new Date().toLocaleString();
    doc.setFontSize(10);
    doc.text(`Generated on: ${date}`, 14, doc.internal.pageSize.height - 10);

    doc.save("SP_Transaction_History.pdf");
  };

  // Export Excel
  const exportExcel = () => {
    const worksheetData = transactions.map((t) => ({
      "Receipt ID": t.receiptId,
      Service: t.service || "N/A",
      Customer: t.customer || "N/A",
      Amount: `Rs. ${Number(t.amount).toFixed(2)}`,
      Status: t.status,
      Date: t.date || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    XLSX.writeFile(workbook, "SP_Transaction_History.xlsx");
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col relative">
      <Toaster />

      {/* GO BACK BUTTON (always visible) */}
      <button
        onClick={() => navigate("/serviceprovider/serviceproviderHomepage")}
        className="fixed top-4 left-4 z-50 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-colors duration-200"
      >
        ← Go Back
      </button>

      {loading ? (
        <main className="flex-1 flex items-center justify-center mt-20">
          <p className="text-lg animate-pulse">Loading your transactions...</p>
        </main>
      ) : !transactions.length ? (
        <main className="flex-1 flex items-center justify-center mt-20">
          <p className="text-lg">No transactions found.</p>
        </main>
      ) : (
        <main className="flex-1 p-4 md:p-15 max-w-6xl mx-auto mt-20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-center md:text-left">
              Transaction History
            </h1>
            <div className="flex gap-2 mt-4 md:mt-0">
              <button
                onClick={exportPDF}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition"
              >
                Export PDF
              </button>
              <button
                onClick={exportExcel}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition"
              >
                Export Excel
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Receipt ID</th>
                  <th className="px-4 py-2 text-left">Service</th>
                  <th className="px-4 py-2 text-left">Customer</th>
                  <th className="px-4 py-2 text-left">Amount (Rs.)</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr
                    key={t._id}
                    className="border-b border-gray-700 hover:bg-gray-700 transition"
                  >
                    <td className="px-4 py-2">{t.receiptId}</td>
                    <td className="px-4 py-2">{t.service || "N/A"}</td>
                    <td className="px-4 py-2">{t.customer || "N/A"}</td>
                    <td className="px-4 py-2">Rs. {Number(t.amount).toFixed(2)}</td>
                    <td
                      className={`px-4 py-2 font-semibold ${
                        t.status === "Paid" ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {t.status}
                    </td>
                    <td className="px-4 py-2">{t.date || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      )}

      <Footer />
    </div>
  );
};

export default SPTransactionHistory;
