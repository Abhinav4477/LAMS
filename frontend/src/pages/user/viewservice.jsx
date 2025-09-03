import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import NavbarDemo from "../../components/user/Unavbar";
import Footer from "../../components/Footer";

const ViewServices = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dropdown data
  const [categories, setCategories] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [locations, setLocations] = useState([]);

  // Filters
  const [categoryId, setCategoryId] = useState("");
  const [stateId, setStateId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [searchTerm, setSearchTerm] = useState("");

  const axiosConfig = { withCredentials: true };

  // Fetch dropdowns
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [catRes, stateRes] = await Promise.all([
          axios.get("http://localhost:5001/api/admin/getcategories", axiosConfig),
          axios.get("http://localhost:5001/api/admin/getstates", axiosConfig),
        ]);
        setCategories(catRes.data);
        setStates(stateRes.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load filters");
      }
    };
    fetchDropdowns();
  }, []);

  // Fetch districts when state changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!stateId) {
        setDistricts([]);
        setDistrictId("");
        setLocations([]);
        setLocationId("");
        return;
      }
      try {
        const res = await axios.get(
          `http://localhost:5001/api/admin/getdistricts/${stateId}`,
          axiosConfig
        );
        setDistricts(res.data);
        setDistrictId("");
        setLocations([]);
        setLocationId("");
      } catch (err) {
        console.error(err);
        toast.error("Failed to load districts");
      }
    };
    fetchDistricts();
  }, [stateId]);

  // Fetch locations when district changes
  useEffect(() => {
    const fetchLocations = async () => {
      if (!districtId) {
        setLocations([]);
        setLocationId("");
        return;
      }
      try {
        const res = await axios.get(
          `http://localhost:5001/api/admin/getlocationbydistrict/${districtId}`,
          axiosConfig
        );
        setLocations(res.data);
        setLocationId("");
      } catch (err) {
        console.error(err);
        toast.error("Failed to load locations");
      }
    };
    fetchLocations();
  }, [districtId]);

  // Fetch services
  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5001/api/user/services", {
        params: { categoryId, stateId, districtId, locationId, sortBy },
        ...axiosConfig,
      });
      setServices(res.data);
      setFilteredServices(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load services. Make sure you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Filter services by search term
  useEffect(() => {
    let filtered = [...services];
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredServices(filtered);
  }, [searchTerm, services]);

  return (
    <div className="bg-gray-900 text-white flex flex-col min-h-screen">
      <NavbarDemo />
      <Toaster />

      <main className="flex-1 max-w-7xl mx-auto p-4 sm:p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Available Services</h1>

        {/* Sticky Search & Filters */}
        <div className="sticky top-24 z-40 bg-gray-900 bg-opacity-95 backdrop-blur-md p-4 rounded-xl shadow-md mb-6 flex flex-col sm:flex-row sm:flex-wrap gap-4 justify-center items-center">
          
          {/* Search bar */}
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Search services by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-2xl text-white placeholder-gray-400 bg-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-500 shadow-lg transition duration-300"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6"
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

          {/* Filters */}
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="p-2 rounded bg-gray-700 hover:bg-gray-600 transition w-full sm:w-auto text-white"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>

          <select
            value={stateId}
            onChange={(e) => setStateId(e.target.value)}
            className="p-2 rounded bg-gray-700 hover:bg-gray-600 transition w-full sm:w-auto text-white"
          >
            <option value="">All States</option>
            {states.map((s) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>

          <select
            value={districtId}
            onChange={(e) => setDistrictId(e.target.value)}
            disabled={!stateId}
            className="p-2 rounded bg-gray-700 hover:bg-gray-600 transition disabled:opacity-50 w-full sm:w-auto text-white"
          >
            <option value="">All Districts</option>
            {districts.map((d) => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>

          <select
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            disabled={!districtId}
            className="p-2 rounded bg-gray-700 hover:bg-gray-600 transition disabled:opacity-50 w-full sm:w-auto text-white"
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc._id} value={loc._id}>{loc.name}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 rounded bg-gray-700 hover:bg-gray-600 transition w-full sm:w-auto text-white"
          >
            <option value="latest">Latest</option>
            <option value="priceAsc">Price: Low → High</option>
            <option value="priceDesc">Price: High → Low</option>
          </select>

          <button
            onClick={fetchServices}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition w-full sm:w-auto"
          >
            Apply Filters
          </button>
        </div>

        {/* Services List */}
        {loading ? (
          <p className="text-center text-lg">Loading services...</p>
        ) : filteredServices.length === 0 ? (
          <p className="text-center text-lg">No services found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service._id}
                className="bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden flex flex-col"
              >
                {service.coverImage && (
                  <img
                    src={`http://localhost:5001/${service.coverImage}`}
                    alt={service.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{service.name}</h2>
                    <p className="mt-1 font-bold text-green-400">₹{service.price}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {service.location?.name}, {service.location?.district?.name},{" "}
                      {service.location?.district?.state?.name}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/user/serviceviewmore/${service._id}`)}
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded"
                  >
                    Show More
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ViewServices;
