import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import NavbarDemo from "../../components/user/Unavbar";
import Footer from "../../components/Footer";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const TransactionHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:5001/api/payment/history",
          { withCredentials: true }
        );
        setPayments(res.data);
      } catch (err) {
        console.error("Error fetching payments:", err);
        toast.error(err.response?.data?.message || "Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Local Aid Management System", 14, 15);
    doc.setFontSize(12);
    doc.text("Transaction History Report", 14, 25);

    const tableData = payments.map((p) => [
      p.receiptId,
      p.service || "N/A",
      `Rs. ${Number(p.amount).toFixed(2)}`,
      p.status,
      p.date || "N/A",
    ]);

    autoTable(doc, {
      head: [["Receipt ID", "Service", "Amount", "Status", "Date"]],
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

    doc.save("Transaction_History.pdf");
  };

  // Export Excel
  const exportExcel = () => {
    const worksheetData = payments.map((p) => ({
      "Receipt ID": p.receiptId,
      Service: p.service || "N/A",
      Amount: `Rs. ${Number(p.amount).toFixed(2)}`,
      Status: p.status,
      Date: p.date || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    XLSX.writeFile(workbook, "Transaction_History.xlsx");
  };

  if (loading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex flex-col">
        <NavbarDemo />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-lg animate-pulse">Loading your transactions...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!payments.length) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex flex-col">
        <NavbarDemo />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-lg">No transactions found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <NavbarDemo />
      <Toaster />
      <main className="flex-1 p-4 md:p-6 max-w-6xl mx-auto">
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
                <th className="px-4 py-2 text-left">Amount (Rs.)</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr
                  key={p._id}
                  className="border-b border-gray-700 hover:bg-gray-700 transition"
                >
                  <td className="px-4 py-2">{p.receiptId}</td>
                  <td className="px-4 py-2">{p.service || "N/A"}</td>
                  <td className="px-4 py-2">Rs. {Number(p.amount).toFixed(2)}</td>
                  <td
                    className={`px-4 py-2 font-semibold ${
                      p.status === "Paid" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {p.status}
                  </td>
                  <td className="px-4 py-2">{p.date || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TransactionHistory;
