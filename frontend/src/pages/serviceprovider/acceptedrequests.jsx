import { useState, useEffect } from "react";
import api from "../../lib/axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import SPNavbar from "../../components/serviceprovider/SPNavbar";
import Footer from "../../components/Footer";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_FLOW = ["Working", "Completed"];
const STATUS_FILTER_OPTIONS = ["All", "Working", "Completed"];

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const navigate = useNavigate();

  // Fetch all requests
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        "/provider/requests/all",
        { withCredentials: true }
      );

      if (res.data.success) {
        setRequests(res.data.data);
        setFilteredRequests(res.data.data);
      } else {
        toast.error(res.data.message || "Failed to load requests");
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        toast.error("Unauthorized! Redirecting to login...");
        navigate("/login");
      } else {
        toast.error("Failed to fetch requests");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Update status with confirmation
  const handleStatusChange = async (id, newStatus) => {
    const confirmUpdate = window.confirm(
      `Are you sure you want to mark this request as ${newStatus}?`
    );
    if (!confirmUpdate) return;

    try {
      setUpdatingId(id);
      const res = await api.put(
        `/provider/request/${id}`,
        { status: newStatus },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setRequests(prev =>
          prev.map(r => (r._id === id ? { ...r, status: newStatus } : r))
        );
      } else {
        toast.error(res.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update request");
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter and search
  useEffect(() => {
    let filtered = [...requests];

    // Exclude completed requests in "All" filter
    if (statusFilter === "All") {
      filtered = filtered.filter(r => r.status !== "Completed");
    } else {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        r =>
          r.userId?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.serviceId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  }, [searchTerm, statusFilter, requests]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <p className="text-white text-lg animate-pulse">Loading requests...</p>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <Toaster />
      <div className="fixed top-0 left-0 w-full z-50 bg-black">
        <SPNavbar />
      </div>

      <div className="flex-grow pt-32 pb-16 px-4 sm:px-6 lg:px-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-center sm:text-left">
          Your Requests
        </h1>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-center sm:justify-start">
          <div className="relative flex-1 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by username or service name"
              className="w-full px-4 py-2 pl-10 rounded-full text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition shadow-lg bg-gray-100"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 3a7.5 7.5 0 006.15 13.65z"
              />
            </svg>
          </div>

          <div className="relative w-full sm:w-48">
            <select
              className="w-full px-4 py-2 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition shadow-lg bg-gray-100 appearance-none cursor-pointer"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              {STATUS_FILTER_OPTIONS.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Requests Grid */}
        {filteredRequests.length === 0 ? (
          <p className="text-center text-gray-400 mt-10 text-lg animate-pulse">
            No requests found.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filteredRequests.map(req => {
                const currentIndex = STATUS_FLOW.indexOf(req.status);
                const nextStatus = STATUS_FLOW[currentIndex + 1];

                const cardClass =
                  req.status === "Completed"
                    ? "bg-green-900/80 backdrop-blur-md rounded-3xl shadow-xl p-6 flex flex-col opacity-80"
                    : "bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 flex flex-col transition-transform hover:scale-105 hover:shadow-3xl";

                return (
                  <motion.div
                    key={req._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={cardClass}
                  >
                    <h2 className="text-xl font-semibold text-white mb-2 truncate">
                      {req.serviceId?.name || "Unnamed Service"}
                    </h2>
                    <p className="text-gray-300 text-sm mb-3 line-clamp-3">
                      {req.serviceId?.description || "No description"}
                    </p>
                    <p className="text-blue-400 font-semibold mb-3">
                      ₹{req.serviceId?.price ?? "N/A"}
                    </p>

                    <div className="mb-4 text-sm text-gray-400 space-y-1">
                      <p>
                        <span className="font-medium text-gray-300">Requested by:</span>{" "}
                        {req.userId?.username || "Unknown"}
                      </p>
                      <p>
                        <span className="font-medium text-gray-300">Email:</span>{" "}
                        {req.userId?.email || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium text-gray-300">Date:</span>{" "}
                        {req.requestDate ? new Date(req.requestDate).toLocaleDateString() : "N/A"}
                      </p>
                    </div>

                    <div className="mt-auto flex flex-col gap-2">
                      <span
                        className={`inline-block mb-2 px-4 py-1 rounded-full text-sm font-semibold shadow-md ${
                          req.status === "Completed"
                            ? "bg-green-500 text-white"
                            : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                        }`}
                      >
                        {req.status}
                      </span>
                      {nextStatus && req.status !== "Completed" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-4 py-2 rounded-xl font-medium text-white shadow-md transition ${
                            nextStatus === "Working"
                              ? "bg-yellow-500 hover:bg-yellow-600"
                              : "bg-green-500 hover:bg-green-600"
                          }`}
                          disabled={updatingId === req._id}
                          onClick={() => handleStatusChange(req._id, nextStatus)}
                        >
                          Mark as {nextStatus}
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default RequestsPage;
