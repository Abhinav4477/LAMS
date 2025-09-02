import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import SPNavbar from "../../components/serviceprovider/SPNavbar";
import Footer from "../../components/Footer";

const AddService = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stateId, setStateId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch states and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [stateRes, categoryRes] = await Promise.all([
          axios.get("http://localhost:5001/api/admin/getstates", { withCredentials: true }),
          axios.get("http://localhost:5001/api/admin/getcategories", { withCredentials: true }),
        ]);
        setStates(Array.isArray(stateRes.data) ? stateRes.data : []);
        setCategories(Array.isArray(categoryRes.data) ? categoryRes.data : []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load states or categories");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
        setDistrictId("");
        setLocations([]);
        setLocationId("");
      } catch (error) {
        console.error(error);
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
        setLocationId("");
      } catch (error) {
        console.error(error);
        toast.error("Failed to load locations");
      }
    };
    fetchLocations();
  }, [districtId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !price || !categoryId || !locationId) {
      return toast.error("Please fill all fields");
    }

    try {
      setSubmitting(true);
      await axios.post(
        "http://localhost:5001/api/provider/service",
        { name, description, price, categoryId, locationId },
        { withCredentials: true }
      );
      toast.success("Service created successfully!");
      setName("");
      setDescription("");
      setPrice("");
      setCategoryId("");
      setStateId("");
      setDistrictId("");
      setLocationId("");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <p className="text-lg font-medium text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Toaster />
      <div className="w-full fixed top-0 left-0 z-50 bg-black">
        <SPNavbar />
      </div>

      <div className="flex-grow pt-32 pb-16 flex justify-center items-start">
        <div className="w-full max-w-3xl bg-gray-800/90 backdrop-blur-md p-10 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 mx-4">
          <h1 className="text-3xl font-bold mb-8 text-white text-center tracking-wide">Add New Service</h1>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Service Name */}
            <div>
              <label className="block text-sm font-medium text-white">Service Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 block w-full border border-gray-600 rounded-lg shadow-inner p-3 bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter service name"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-white">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="mt-2 block w-full border border-gray-600 rounded-lg shadow-inner p-3 bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter service description"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-white">Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-2 block w-full border border-gray-600 rounded-lg shadow-inner p-3 bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter service price"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-white">State</label>
              <select
                value={stateId}
                onChange={(e) => setStateId(e.target.value)}
                className="mt-2 block w-full border border-gray-600 rounded-lg shadow-inner p-3 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select state</option>
                {states.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block text-sm font-medium text-white">District</label>
              <select
                value={districtId}
                onChange={(e) => setDistrictId(e.target.value)}
                className="mt-2 block w-full border border-gray-600 rounded-lg shadow-inner p-3 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!stateId}
              >
                <option value="">Select district</option>
                {districts.map((d) => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-white">Location</label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="mt-2 block w-full border border-gray-600 rounded-lg shadow-inner p-3 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!districtId}
              >
                <option value="">Select location</option>
                {locations.map((l) => (
                  <option key={l._id} value={l._id}>{l.name}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-white">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="mt-2 block w-full border border-gray-600 rounded-lg shadow-inner p-3 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-3 px-4 rounded-xl text-white font-semibold text-lg transition-all duration-300 ${
                  submitting ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:scale-105"
                }`}
              >
                {submitting ? "Adding Service..." : "Add Service"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
};

export default AddService;
