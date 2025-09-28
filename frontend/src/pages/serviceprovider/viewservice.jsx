import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios";
import { API_BASE_URL } from "../../lib/axios";
import toast, { Toaster } from "react-hot-toast";
import SPNavbar from "../../components/serviceprovider/SPNavbar";
import Footer from "../../components/Footer";

const ViewServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  // Fetch services of logged-in provider
  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.get("/provider/services", {
        withCredentials: true,
      });
      setServices(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Delete service
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    try {
      setDeleting(id);
      await api.delete(`/provider/service/${id}`, {
        withCredentials: true,
      });
      toast.success("Service deleted successfully");
      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to delete service");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <p className="text-lg font-medium text-white">Loading services...</p>
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
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-white tracking-wide">
            My Services
          </h1>
          <button
            onClick={() => navigate("/serviceprovider/addservice")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl transition-all duration-300 hover:scale-105"
          >
            + Add New Service
          </button>
        </div>

        {services.length === 0 ? (
          <p className="text-center text-gray-400">No services found.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl p-4 transform transition-all duration-300 hover:scale-105 flex flex-col"
              >
                {/* Cover Image */}
                {service.coverImage && (
                  <img
                   src={`${API_BASE_URL}/${service.coverImage}`} 
                    alt={service.name}
                    className="w-full h-48 object-cover rounded-2xl mb-4"
                  />
                )}

                <h2 className="text-xl font-semibold text-white mb-2">
                  {service.name}
                </h2>
                <p className="text-gray-300 text-sm mb-3 line-clamp-3">
                  {service.description}
                </p>
                <p className="text-blue-400 font-semibold mb-2">
                  ₹{service.price}
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-gray-400 mb-4">
                  <span className="bg-gray-700 px-3 py-1 rounded-full">
                    {service.category?.name || "No Category"}
                  </span>
                  <span className="bg-gray-700 px-3 py-1 rounded-full">
                    {service.location?.name || "No Location"}
                  </span>
                </div>

                {/* Action buttons */}
                <div className="flex justify-between gap-3 mt-auto">
                  <button
                    onClick={() =>
                      navigate(`/serviceprovider/updateservice/${service._id}`)
                    }
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    disabled={deleting === service._id}
                    className={`flex-1 font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                      deleting === service._id
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    }`}
                  >
                    {deleting === service._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
};

export default ViewServices;
