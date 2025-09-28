import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../lib/axios";
import { API_BASE_URL } from "../../lib/axios";
import toast, { Toaster } from "react-hot-toast";
import SPNavbar from "../../components/serviceprovider/SPNavbar";
import Footer from "../../components/Footer";

const UpdateService = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [originalImage, setOriginalImage] = useState("");

  // Dropdowns
  const [categories, setCategories] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [locations, setLocations] = useState([]);

  const [categoryId, setCategoryId] = useState("");
  const [stateId, setStateId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [locationId, setLocationId] = useState("");

  const [loading, setLoading] = useState(true);
  const [originalData, setOriginalData] = useState({});

  // Fetch categories & states
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [catRes, stateRes] = await Promise.all([
          api.get("/admin/getcategories", { withCredentials: true }),
          api.get("/admin/getstates", { withCredentials: true }),
        ]);
        setCategories(Array.isArray(catRes.data) ? catRes.data : []);
        setStates(Array.isArray(stateRes.data) ? stateRes.data : []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load categories or states");
      }
    };
    fetchDropdowns();
  }, []);

  // Fetch service & prefill
  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const serviceRes = await api.get(`/provider/service/${id}`, { withCredentials: true });
        const service = serviceRes.data;

        setName(service.name);
        setDescription(service.description);
        setPrice(service.price);
        setCategoryId(service.category?._id || "");
        setLocationId(service.location?._id || "");
        setOriginalImage(service.coverImage || "");

        const initialData = {
          name: service.name,
          description: service.description,
          price: service.price,
          categoryId: service.category?._id || "",
          locationId: service.location?._id || "",
          stateId: "",
          districtId: "",
        };

        if (!service.location) {
          setOriginalData(initialData);
          return;
        }

        // Fetch location
        const locationRes = await api.get(`/admin/getlocation/${service.location._id}`, { withCredentials: true });
        const location = locationRes.data;
        initialData.districtId = location.district?._id || "";
        setDistrictId(initialData.districtId);

        // Fetch district
        if (location.district) {
          const districtRes = await api.get(`/admin/getdistrict/${location.district._id}`, { withCredentials: true });
          const district = districtRes.data;
          initialData.stateId = district.state?._id || "";
          setStateId(initialData.stateId);

          if (district.state?._id) {
            const districtsRes = await api.get(`/admin/getdistricts/${district.state._id}`, { withCredentials: true });
            setDistricts(Array.isArray(districtsRes.data) ? districtsRes.data : []);
          }
        }

        if (location.district?._id) {
          const locationsRes = await api.get(`/admin/getlocationbydistrict/${location.district._id}`, { withCredentials: true });
          setLocations(Array.isArray(locationsRes.data) ? locationsRes.data : []);
        }

        setOriginalData(initialData);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load service details");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  // Fetch districts when state changes
  useEffect(() => {
    if (!stateId) {
      setDistricts([]);
      setDistrictId("");
      setLocations([]);
      setLocationId("");
      return;
    }
    const fetchDistricts = async () => {
      try {
        const res = await api.get(`/admin/getdistricts/${stateId}`, { withCredentials: true });
        setDistricts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load districts");
      }
    };
    fetchDistricts();
  }, [stateId]);

  // Fetch locations when district changes
  useEffect(() => {
    if (!districtId) {
      setLocations([]);
      setLocationId("");
      return;
    }
    const fetchLocations = async () => {
      try {
        const res = await api.get(`/admin/getlocationbydistrict/${districtId}`, { withCredentials: true });
        setLocations(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load locations");
      }
    };
    fetchLocations();
  }, [districtId]);

  // Handle cover image selection & preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCoverImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("categoryId", categoryId);
      formData.append("locationId", locationId);
      if (coverImage) formData.append("coverImage", coverImage);

      await api.put(`/provider/service/${id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Service updated successfully");
      navigate("/serviceprovider/viewservices");
    } catch (err) {
      console.error("Update service error:", err);
      toast.error(err.response?.data?.error || "Failed to update service");
    }
  };

  const handleCancel = () => navigate("/serviceprovider/viewservices");

  const isUnchanged =
    name === originalData.name &&
    description === originalData.description &&
    price === originalData.price &&
    categoryId === originalData.categoryId &&
    stateId === originalData.stateId &&
    districtId === originalData.districtId &&
    locationId === originalData.locationId &&
    !coverImage;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <p className="text-lg text-white">Loading service...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Toaster />
      <div className="w-full fixed top-0 left-0 z-50 bg-black">
        <SPNavbar />
      </div>

      <div className="flex-grow pt-32 pb-16 px-4 sm:px-6 lg:px-8 w-full max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white text-center mb-10">Update Service</h1>

        <form
          className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl space-y-6 w-full"
          onSubmit={handleUpdate}
        >
          {/* Service Name */}
          <div>
            <label className="block text-gray-300 mb-2">Service Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-300 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              required
              className="w-full p-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-gray-300 mb-2">Price (₹)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Category, State, District, Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-gray-700 text-white"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">State</label>
              <select
                value={stateId}
                onChange={(e) => setStateId(e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-gray-700 text-white"
              >
                <option value="">Select State</option>
                {states.map((st) => (
                  <option key={st._id} value={st._id}>{st.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">District</label>
              <select
                value={districtId}
                onChange={(e) => setDistrictId(e.target.value)}
                required
                disabled={!stateId}
                className="w-full p-3 rounded-lg bg-gray-700 text-white disabled:opacity-50"
              >
                <option value="">Select District</option>
                {districts.map((dist) => (
                  <option key={dist._id} value={dist._id}>{dist.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Location</label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                required
                disabled={!districtId}
                className="w-full p-3 rounded-lg bg-gray-700 text-white disabled:opacity-50"
              >
                <option value="">Select Location</option>
                {locations.map((loc) => (
                  <option key={loc._id} value={loc._id}>{loc.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Preview */}
          {(preview || originalImage) && (
            <div className="flex justify-center mb-4">
              <img
            src={`${API_BASE_URL}/${service.coverImage}`}   alt="Preview"
                className="w-48 h-48 object-cover rounded-xl border border-gray-600"
              />
            </div>
          )}

          {/* Cover Image Upload */}
          <div>
            <label className="block text-gray-300 mb-2">Cover Image</label>
            <div
              onClick={() => document.getElementById("coverInput").click()}
              className="w-full h-32 flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-gray-700 hover:border-blue-500 transition"
            >
              <span className="text-gray-400">Click to upload image</span>
              <input
                type="file"
                id="coverInput"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-4">
            <button
              type="submit"
              disabled={isUnchanged}
              className={`flex-1 py-3 rounded-lg text-white font-semibold transition ${
                isUnchanged ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Update Service
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default UpdateService;
