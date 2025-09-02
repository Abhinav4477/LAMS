import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import SPNavbar from "../../components/serviceprovider/SPNavbar";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";

const SPAccount = () => {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const navigate = useNavigate();

  // Fetch provider details with auth check
  const fetchProviderDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:5001/api/provider/account/me",
        { withCredentials: true }
      );
      setProvider(res.data);
      setFormData({
        name: res.data.name || "",
        phone: res.data.phone || "",
        address: res.data.address || "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Session expired. Please login again.");
      navigate("/login", { replace: true }); // Redirect if unauthenticated
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviderDetails();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put(
        "http://localhost:5001/api/provider/account/me",
        formData,
        { withCredentials: true }
      );
      toast.success("Account details updated successfully");
      setEditing(false);
      setProvider((prev) => ({ ...prev, ...formData })); // update local state
    } catch (error) {
      console.error(error);
      toast.error("Failed to update account details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <p className="text-lg font-medium text-white">
          Loading account details...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Toaster position="top-right" />
      <div className="w-full fixed top-0 left-0 z-50 bg-gray-900">
        <SPNavbar />
      </div>
      {/* Added extra top padding so content is not hidden under navbar */}
      <div className="flex-grow pt-32 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            Account Details
          </h2>

          {provider ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!editing}
                  className={`w-full px-3 py-2 bg-gray-700 text-white rounded-md border ${
                    editing ? "border-blue-500" : "border-gray-600"
                  } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={provider.email || ""}
                  disabled
                  className="w-full px-3 py-2 bg-gray-700 text-gray-400 rounded-md border border-gray-600 cursor-not-allowed"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!editing}
                  className={`w-full px-3 py-2 bg-gray-700 text-white rounded-md border ${
                    editing ? "border-blue-500" : "border-gray-600"
                  } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!editing}
                  className={`w-full px-3 py-2 bg-gray-700 text-white rounded-md border ${
                    editing ? "border-blue-500" : "border-gray-600"
                  } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center space-x-4">
                {!editing && (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition"
                  >
                    Edit Details
                  </button>
                )}
                {editing && (
                  <>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          name: provider.name || "",
                          phone: provider.phone || "",
                          address: provider.address || "",
                        });
                      }}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md transition"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </form>
          ) : (
            <p className="text-gray-400">No account details found.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SPAccount;
