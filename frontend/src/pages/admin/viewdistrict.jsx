import React, { useState, useEffect } from "react";
import SidebarLayout from "../../components/admin/adminsidebar";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Viewdistrict = () => {
  const [districts, setDistricts] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(""); // dropdown selection
  const navigate = useNavigate();

  // Fetch all states
  const fetchStates = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/admin/getstates");
      setStates(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load states");
    }
  };

  // Fetch districts (all or by state)
  const fetchDistricts = async (stateId = "") => {
    try {
      let url = "http://localhost:5001/api/admin/getdistricts";
      if (stateId) url += `/${stateId}`;
      const res = await axios.get(url);
      setDistricts(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load districts");
    }
  };

  useEffect(() => {
    fetchStates();
    fetchDistricts();
  }, []);

  // Delete district
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this district?")) return;
    try {
      await axios.delete(`http://localhost:5001/api/admin/deletedistrict/${id}`);
      toast.success("District deleted successfully");
      fetchDistricts(selectedState); // refresh list based on filter
    } catch (error) {
      console.error(error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to delete district";
      toast.error(message);
    }
  };

  return (
    <SidebarLayout>
      <div className="p-6">
        {/* Header with Add and State Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-semibold">View Districts</h2>
          <div className="flex items-center gap-4">
            {/* State Filter */}
            <select
              className="select select-bordered"
              value={selectedState}
              onChange={(e) => {
                const stateId = e.target.value;
                setSelectedState(stateId);
                fetchDistricts(stateId);
              }}
            >
              <option value="">-- All States --</option>
              {states.map((state) => (
                <option key={state._id} value={state._id}>
                  {state.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => navigate("/admin/adddistrict")}
              className="btn btn-primary hover:scale-105 transition-transform duration-200"
            >
              + Add District
            </button>
          </div>
        </div>

        {/* Cards Layout */}
        {districts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {districts.map((district) => (
              <div
                key={district._id}
                className="card bg-base-200 shadow-md rounded-xl p-4 hover:shadow-lg hover:-translate-y-1 transition-transform duration-200 ease-in-out"
              >
                <h3 className="text-lg font-bold">{district.name}</h3>
                <p className="text-sm text-gray-600">
                  State:{" "}
                  <span className="font-medium">{district.state?.name || "N/A"}</span>
                </p>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/admin/updatedistrict/${district._id}`)}
                    className="btn btn-sm btn-secondary hover:bg-secondary-focus hover:text-white hover:scale-105 transition-all duration-200 flex-1"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(district._id)}
                    className="btn btn-sm text-white bg-red-600 hover:bg-red-500 hover:scale-105 hover:shadow-md transition-all duration-200 flex-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">No districts found.</p>
        )}
      </div>
    </SidebarLayout>
  );
};

export default Viewdistrict;
