import React, { useState, useEffect } from "react";
import SidebarLayout from "../../components/admin/adminsidebar";
import toast from "react-hot-toast";
import api from "../../lib/axios";
import { useNavigate } from "react-router-dom";

const ViewLocation = () => {
  const [locations, setLocations] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const navigate = useNavigate();

  // Fetch all states
  const fetchStates = async () => {
    try {
      const res = await api.get("/admin/getstates");
      setStates(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load states");
    }
  };

  // Fetch districts for a state
  const fetchDistricts = async (stateId) => {
    if (!stateId) {
      setDistricts([]);
      setSelectedDistrict("");
      return;
    }
    try {
      const res = await api.get(`/admin/getdistricts/${stateId}`);
      setDistricts(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load districts");
    }
  };

  // Fetch locations
  const fetchLocations = async (districtId = "") => {
    try {
      let res;
      if (districtId) {
        // Fetch only locations for the selected district
        res = await api.get(`/admin/getlocationbydistrict/${districtId}`);
      } else {
        // Default: fetch all locations
        res = await api.get("/admin/getlocations");
      }
      setLocations(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load locations");
    }
  };

  // Delete location
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this location?")) return;
    try {
      await api.delete(`/admin/deletelocation/${id}`);
      toast.success("Location deleted successfully");
      fetchLocations(selectedDistrict); // Refresh filtered or all locations
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete location");
    }
  };

  // Load initial data
  useEffect(() => {
    fetchStates();
    fetchLocations(); // Load all locations initially
  }, []);

  // Handle state selection (for loading districts only)
  const handleStateChange = (stateId) => {
    setSelectedState(stateId);
    setSelectedDistrict("");
    fetchDistricts(stateId); // Populate districts dropdown
  };

  // Handle district selection (filter locations)
  const handleDistrictChange = (districtId) => {
    setSelectedDistrict(districtId);
    fetchLocations(districtId); // Only fetch locations in selected district
  };

  return (
    <SidebarLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold">View Locations</h2>
          <button
            onClick={() => navigate("/admin/addlocation")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            + Add Location
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
          {/* State Dropdown */}
          <select
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          >
            <option value="">-- Select State --</option>
            {states.map((state) => (
              <option key={state._id} value={state._id}>
                {state.name}
              </option>
            ))}
          </select>

          {/* District Dropdown */}
          {selectedState && (
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
            >
              <option value="">-- Select District --</option>
              {districts.map((district) => (
                <option key={district._id} value={district._id}>
                  {district.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Locations */}
        {locations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((location) => (
              <div
                key={location._id}
                className="card bg-white shadow-md rounded-xl p-5 hover:shadow-lg hover:-translate-y-1 transition-transform duration-200"
              >
                <h3 className="text-lg font-bold">{location.name}</h3>
                <p className="text-sm text-gray-600 mt-2">
                  District: <span className="font-medium">{location.district?.name || "N/A"}</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  State: <span className="font-medium">{location.district?.state?.name || "N/A"}</span>
                </p>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/admin/updatelocation/${location._id}`)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition flex-1"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(location._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition flex-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">No locations found.</p>
        )}
      </div>
    </SidebarLayout>
  );
};

export default ViewLocation;
