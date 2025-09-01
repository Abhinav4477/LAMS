import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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
  const [originalData, setOriginalData] = useState({}); // store original service data

  // Fetch categories & states
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [catRes, stateRes] = await Promise.all([
          axios.get("http://localhost:5001/api/admin/getcategories", { withCredentials: true }),
          axios.get("http://localhost:5001/api/admin/getstates", { withCredentials: true }),
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
        const serviceRes = await axios.get(`http://localhost:5001/api/provider/service/${id}`, { withCredentials: true });
        const service = serviceRes.data;

        const initialData = {
          name: service.name,
          description: service.description,
          price: service.price,
          categoryId: service.category?._id || "",
          locationId: service.location?._id || "",
          stateId: "",
          districtId: ""
        };

        setName(initialData.name);
        setDescription(initialData.description);
        setPrice(initialData.price);
        setCategoryId(initialData.categoryId);
        setLocationId(initialData.locationId);

        if (!service.location) {
          setOriginalData(initialData);
          return;
        }

        // Fetch location
        const locationRes = await axios.get(`http://localhost:5001/api/admin/getlocation/${service.location._id}`, { withCredentials: true });
        const location = locationRes.data;
        initialData.districtId = location.district?._id || "";
        setDistrictId(initialData.districtId);

        // Fetch district
        if (location.district) {
          const districtRes = await axios.get(`http://localhost:5001/api/admin/getdistrict/${location.district._id}`, { withCredentials: true });
          const district = districtRes.data;
          initialData.stateId = district.state?._id || "";
          setStateId(initialData.stateId);

          if (district.state?._id) {
            const districtsRes = await axios.get(`http://localhost:5001/api/admin/getdistricts/${district.state._id}`, { withCredentials: true });
            setDistricts(Array.isArray(districtsRes.data) ? districtsRes.data : []);
          }
        }

        if (location.district?._id) {
          const locationsRes = await axios.get(`http://localhost:5001/api/admin/getlocationbydistrict/${location.district._id}`, { withCredentials: true });
          setLocations(Array.isArray(locationsRes.data) ? locationsRes.data : []);
        }

        setOriginalData(initialData); // save original service data
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
        const res = await axios.get(`http://localhost:5001/api/admin/getdistricts/${stateId}`, { withCredentials: true });
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
        const res = await axios.get(`http://localhost:5001/api/admin/getlocationbydistrict/${districtId}`, { withCredentials: true });
        setLocations(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load locations");
      }
    };
    fetchLocations();
  }, [districtId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5001/api/provider/service/${id}`,
        { name, description, price, categoryId, locationId },
        { withCredentials: true }
      );
      toast.success("Service updated successfully");
      navigate("/serviceprovider/viewservices");
    } catch (err) {
      console.error("Update service error:", err);
      if (err.response && err.response.status === 400) {
        toast.error(err.response.data.error || "Bad request");
      } else {
        toast.error("Failed to update service");
      }
    }
  };

  const handleCancel = () => navigate("/serviceprovider/viewservices");

  // Disable button if nothing changed
  const isUnchanged =
    name === originalData.name &&
    description === originalData.description &&
    price === originalData.price &&
    categoryId === originalData.categoryId &&
    stateId === originalData.stateId &&
    districtId === originalData.districtId &&
    locationId === originalData.locationId;

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

        <form className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl space-y-6 w-full" onSubmit={handleUpdate}>
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

          {/* Category */}
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

          {/* State */}
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

          {/* District */}
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

          {/* Location */}
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
