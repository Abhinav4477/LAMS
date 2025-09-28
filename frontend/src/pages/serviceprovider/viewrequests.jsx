import { useState, useEffect } from "react";
import api from "../../lib/axios";
import toast, { Toaster } from "react-hot-toast";
import SPNavbar from "../../components/serviceprovider/SPNavbar";
import Footer from "../../components/Footer";

const STATUS_COLORS = {
  Pending: "bg-yellow-600 text-yellow-100",
  Accepted: "bg-blue-600 text-white",
  Rejected: "bg-red-600 text-white",
  Completed: "bg-green-600 text-white",
};

const ViewRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All"); // All, Pending, Accepted, Rejected

  // Fetch requests
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/provider/requests", {
        withCredentials: true,
      });
      if (res.data.success) setRequests(res.data.data || []);
      else toast.error(res.data.message || "Failed to load requests");
    } catch (err) {
      console.error("Fetch requests error:", err);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Accept / Reject
  const updateRequestStatus = async (id, status) => {
    try {
      const res = await api.put(
        `/provider/requests/${id}`,
        { status },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(`Request ${status.toLowerCase()}`);
        fetchRequests();
      } else {
        toast.error(res.data.message || "Failed to update request");
      }
    } catch (err) {
      console.error("Update request error:", err);
      toast.error("Failed to update request");
    }
  };

  // Filtered requests
  const filteredRequests =
    filter === "All" ? requests : requests.filter((r) => r.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <p className="text-lg text-white">Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Toaster />
      <div className="w-full fixed top-0 left-0 z-50 bg-black">
        <SPNavbar />
      </div>

      <div className="flex-grow pt-32 pb-16 px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-white tracking-wide">
            My Service Requests
          </h1>
          <div className="flex gap-2 flex-wrap">
            {["All", "Pending", "Accepted", "Rejected"].map((f) => (
              <button
                key={f}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === f
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">No requests found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRequests.map((req) => (
              <div
                key={req._id}
                className="bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-lg p-6 flex flex-col transition transform hover:scale-105 hover:shadow-2xl"
              >
                {/* Service Info */}
                <h2 className="text-xl font-semibold text-white mb-2">
                  {req.serviceId?.name || "Unnamed Service"}
                </h2>
                <p className="text-gray-300 text-sm mb-3 line-clamp-3">
                  {req.serviceId?.description || "No description"}
                </p>
                <p className="text-blue-400 font-semibold mb-3">
                  ₹{req.serviceId?.price ?? "N/A"}
                </p>

                {/* Requester Info */}
                <div className="mb-4 text-sm text-gray-400">
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
                    {req.requestDate
                      ? new Date(req.requestDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                {/* Accept / Reject */}
                {req.status === "Pending" ? (
                  <div className="mt-auto flex gap-2">
                    <button
                      onClick={() => updateRequestStatus(req._id, "Accepted")}
                      className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-500 transition"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateRequestStatus(req._id, "Rejected")}
                      className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-500 transition"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <span
                    className={`inline-block mt-auto px-4 py-1 rounded-full text-sm font-semibold ${
                      STATUS_COLORS[req.status] || "bg-gray-600 text-white"
                    }`}
                  >
                    {req.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ViewRequests;
