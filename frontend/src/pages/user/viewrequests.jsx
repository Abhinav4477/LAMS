import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import NavbarDemo from "../../components/user/Unavbar";
import Footer from "../../components/Footer";

const STATUS_STEPS = ["Pending", "Accepted", "Working", "Completed"];

const ViewRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:5001/api/user/service-request/my-requests",
          { withCredentials: true }
        );
        setRequests(res.data);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to load requests");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handlePayment = async (req) => {
    try {
      const res = await axios.post(
        `http://localhost:5001/api/payment/pay/${req._id}`,
        {},
        { withCredentials: true }
      );

      const receipt = res.data.receipt;
      toast.success(`Payment Successful! Receipt ID: ${receipt.receiptId}`);

      // Open printable receipt
      const receiptWindow = window.open("", "_blank");
      receiptWindow.document.write(`
        <html>
          <head>
            <title>Receipt</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { text-align: center; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { padding: 10px; border: 1px solid #333; text-align: left; }
            </style>
          </head>
          <body>
            <h1>Payment Receipt</h1>
            <p><strong>Receipt ID:</strong> ${receipt.receiptId}</p>
            <p><strong>Transaction ID:</strong> ${receipt.transactionId}</p>
            <p><strong>Service:</strong> ${receipt.service}</p>
            <p><strong>Provider:</strong> ${receipt.provider}</p>
            <p><strong>Amount:</strong> ₹${receipt.amount}</p>
            <p><strong>Date:</strong> ${new Date(receipt.date).toLocaleString()}</p>
          </body>
        </html>
      `);
      receiptWindow.print();

      // Remove from state
      setRequests((prev) => prev.filter((r) => r._id !== req._id));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Payment failed");
    }
  };

  const getProgressPercent = (status) => {
    if (status === "Rejected" || status === "Cancelled") {
      return ((STATUS_STEPS.indexOf("Accepted") + 1) / STATUS_STEPS.length) * 100;
    }
    const idx = STATUS_STEPS.indexOf(status);
    return idx === -1 ? 0 : ((idx + 1) / STATUS_STEPS.length) * 100;
  };

  if (loading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex flex-col">
        <NavbarDemo />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-lg animate-pulse">Loading your requests...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!requests.length) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex flex-col">
        <NavbarDemo />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-lg">You have no pending service requests.</p>
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
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center md:text-left">
          My Service Requests
        </h1>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {requests.map((req) => {
            const progress = getProgressPercent(req.status);

            return (
              <motion.div
                key={req._id}
                className="bg-gray-800 rounded-2xl shadow-lg p-5 flex flex-col justify-between hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {req.serviceId?.coverImage && (
                    <img
                      src={`http://localhost:5001/${req.serviceId.coverImage}`}
                      alt={req.serviceId?.name}
                      className="w-full md:w-24 h-24 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 mt-2 md:mt-0">
                    <h2 className="text-lg md:text-xl font-semibold">
                      {req.serviceId?.name || "Service Name Unavailable"}
                    </h2>
                    <p className="text-green-400 font-bold mt-1 text-sm md:text-base">
                      ₹{req.serviceId?.price ?? "N/A"}
                    </p>
                    <p className="text-gray-300 mt-1 text-xs md:text-sm">
                      Requested on:{" "}
                      {req.createdAt ? new Date(req.createdAt).toLocaleString() : "N/A"}
                    </p>

                    <div className="mt-4 relative w-full h-6">
                      <div className="absolute top-2.5 left-0 w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-2 rounded-full ${
                            req.status === "Rejected"
                              ? "bg-red-500"
                              : req.status === "Cancelled"
                              ? "bg-gray-500"
                              : "bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
                          }`}
                          style={{ width: `${progress}%` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>

                      <div className="absolute top-0 left-0 w-full flex justify-between px-1">
                        {STATUS_STEPS.map((step, idx) => {
                          const isCompleted =
                            req.status === "Rejected" || req.status === "Cancelled"
                              ? idx <= STATUS_STEPS.indexOf("Accepted")
                              : idx <= STATUS_STEPS.indexOf(req.status);
                          return (
                            <div key={step} className="flex flex-col items-center relative">
                              <div
                                className={`w-3 h-3 rounded-full border-2 ${
                                  isCompleted
                                    ? req.status === "Cancelled"
                                      ? "bg-gray-500 border-gray-500"
                                      : "bg-green-400 border-green-400"
                                    : "bg-gray-800 border-gray-600"
                                }`}
                              />
                              <span className="text-xs mt-1 text-gray-300">{step}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {req.status === "Completed" && (
                  <button
                    className="mt-4 md:mt-3 px-4 py-2 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition transform hover:scale-105"
                    onClick={() => handlePayment(req)}
                  >
                    Pay Now
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ViewRequests;
