import React, { useState, useEffect } from "react";
import SidebarLayout from "../../components/admin/adminsidebar";
import toast from "react-hot-toast";
import api from "../../lib/axios";
import { useNavigate } from "react-router-dom";

const AddLocation = () => {
  const [name, setLocationName] = useState("");
  const [stateId, setStateId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const navigate = useNavigate();

  // Fetch all states on mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await api.get("/admin/getstates");
        setStates(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load states");
      }
    };
    fetchStates();
  }, []);

  // Fetch districts when a state is selected
  useEffect(() => {
    if (!stateId) {
      setDistricts([]);
      setDistrictId("");
      return;
    }
    const fetchDistricts = async () => {
      try {
        const res = await api.get(`/admin/getdistricts/${stateId}`);
        setDistricts(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load districts");
      }
    };
    fetchDistricts();
  }, [stateId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !districtId) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await api.post("/admin/addlocation", {
        name,
        districtId,
      });
      toast.success("Location Added Successfully");
      navigate("/admin/viewlocation");
    } catch (error) {
      console.error(error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Unknown error";
      toast.error(message);
    }
  };

  return (
    <SidebarLayout>
      <div className="p-4 sm:p-6 md:p-10">
        {/* Card aligned to top-left */}
        <div className="card bg-base-200 shadow-md w-full max-w-md p-6 hover:shadow-lg hover:-translate-y-1 transition-transform duration-200">
          <h2 className="text-2xl font-semibold mb-6">Add Location</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Location Name */}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Location Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400"
                placeholder="Enter location name"
              />
            </div>

            {/* State Selection */}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="state">
                Select State
              </label>
              <select
                id="state"
                value={stateId}
                onChange={(e) => setStateId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400"
              >
                <option value="">-- Select a state --</option>
                {states.map((state) => (
                  <option key={state._id} value={state._id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            {/* District Selection */}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="district">
                Select District
              </label>
              <select
                id="district"
                value={districtId}
                onChange={(e) => setDistrictId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400 disabled:bg-gray-100"
                disabled={!stateId || districts.length === 0}
              >
                <option value="">
                  {districts.length === 0 ? "-- Select state first --" : "-- Select a district --"}
                </option>
                {districts.map((district) => (
                  <option key={district._id} value={district._id}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons at the bottom */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
              >
                Add Location
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/viewlocation")}
                className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 hover:text-white transition duration-200"
              >
                View Locations
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/viewlocation")}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default AddLocation;
