import React, { useEffect, useState } from "react";
import SidebarLayout from "../../components/admin/adminsidebar";
import toast from "react-hot-toast";
import axios from "axios";

const Viewsprequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all", "verified", "pending"
  const [btnLoading, setBtnLoading] = useState({}); // Track loading per provider

  // Fetch all service providers
  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5001/api/admin/getsprequests",
        { withCredentials: true }
      );

      // Ensure isVerified is boolean
      const mappedRequests = (res.data.requests || []).map((p) => ({
        ...p,
        isVerified: p.is_verified === true, // ensure consistency with backend field
      }));

      setRequests(mappedRequests);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      toast.error("Failed to load service providers");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Verify provider
  const handleVerify = async (providerId) => {
    try {
      setBtnLoading((prev) => ({ ...prev, [providerId]: true }));

      const res = await axios.put(
        `http://localhost:5001/api/admin/verifyserviceprovider/${providerId}`,
        {},
        { withCredentials: true }
      );

      const updatedProvider = res.data.provider;

      // Update state immediately
      setRequests((prev) =>
        prev.map((r) =>
          r.providerId === providerId
            ? { ...r, isVerified: updatedProvider.is_verified }
            : r
        )
      );

      toast.success("Service provider verified successfully");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.error || "Failed to verify provider");
    } finally {
      setBtnLoading((prev) => ({ ...prev, [providerId]: false }));
    }
  };

  // Revoke provider verification
  const handleRevoke = async (providerId) => {
    try {
      setBtnLoading((prev) => ({ ...prev, [providerId]: true }));

      const res = await axios.put(
        `http://localhost:5001/api/admin/revokeserviceprovider/${providerId}`,
        {},
        { withCredentials: true }
      );

      const updatedProvider = res.data.provider;

      // Update state immediately
      setRequests((prev) =>
        prev.map((r) =>
          r.providerId === providerId
            ? { ...r, isVerified: updatedProvider.is_verified }
            : r
        )
      );

      toast.success("Service provider verification revoked");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.error || "Failed to revoke provider");
    } finally {
      setBtnLoading((prev) => ({ ...prev, [providerId]: false }));
    }
  };

  // Filter requests
  const filteredRequests = requests.filter((provider) => {
    if (filter === "verified") return provider.isVerified;
    if (filter === "pending") return !provider.isVerified;
    return true;
  });

  return (
    <SidebarLayout>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-semibold">Service Provider Management</h2>

          {/* Filter dropdown */}
          <select
            className="select select-bordered w-full sm:w-48"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {loading ? (
          <p>Loading service providers...</p>
        ) : filteredRequests.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No service providers found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((provider) => (
              <div
                key={provider.providerId}
                className="card bg-base-200 shadow-md rounded-xl p-4 hover:shadow-lg hover:-translate-y-1 transition-transform duration-200 ease-in-out"
              >
                <h3 className="text-lg font-bold">{provider.username}</h3>
                <p>Email: {provider.email}</p>
                <p>Category: {provider.category}</p>
                <p>Status: {provider.isVerified ? "Verified" : "Pending"}</p>

                <div className="flex gap-2 mt-4">
                  {!provider.isVerified ? (
                    <button
                      onClick={() => handleVerify(provider.providerId)}
                      className={`btn btn-sm btn-primary hover:scale-105 transition-transform duration-200`}
                      disabled={btnLoading[provider.providerId]}
                    >
                      {btnLoading[provider.providerId] ? "Verifying..." : "Verify"}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRevoke(provider.providerId)}
                      className="btn btn-sm btn-warning hover:scale-105 transition-transform duration-200"
                      disabled={btnLoading[provider.providerId]}
                    >
                      {btnLoading[provider.providerId] ? "Revoking..." : "Revoke"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default Viewsprequests;
