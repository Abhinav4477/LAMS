import React, { useState, useEffect } from "react";
import SidebarLayout from "../../components/admin/adminsidebar";
import toast from "react-hot-toast";
import api from "../../lib/axios";
import { useNavigate } from "react-router-dom";

const UpdateDistrict = () => {
  const [name, setDistrictName] = useState("");
  const [stateId, setStateId] = useState("");
  const [states, setStates] = useState([]); // Store all states here
  const navigate = useNavigate();
  const districtId = window.location.pathname.split("/").pop(); // Extract ID from URL

  // Fetch all states
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

  // Fetch district details
  useEffect(() => {
    const fetchDistrict = async () => {
      try {
        const res = await api.get(
          `/admin/getdistrict/${districtId}`
        );

        setDistrictName(res.data.name);

        if (res.data.state?._id) {
          setStateId(res.data.state._id);
        } else {
          setStateId(res.data.stateId);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load district details");
      }
    };
    fetchDistrict();
  }, [districtId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !stateId.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await api.put(
        `/admin/updatedistrict/${districtId}`,
        {
          name,
          stateId,
        }
      );
      toast.success("District Updated Successfully");
      navigate("/admin/viewdistrict");
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
      <div className="p-6">
        <div className="card bg-base-200 shadow-md w-full max-w-md p-6">
          {/* Header */}
          <h2 className="text-2xl font-semibold mb-4">Update District</h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">District Name</label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Enter district name"
                onChange={(e) => setDistrictName(e.target.value)}
                value={name}
              />
            </div>

            <div>
              <label className="label">Select State</label>
              <select
                className="select select-bordered w-full"
                value={stateId}
                onChange={(e) => setStateId(e.target.value)}
              >
                <option value="">-- Select a state --</option>
                {states.map((state) => (
                  <option key={state._id} value={state._id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4 mt-4">
              <button type="submit" className="btn btn-primary flex-1">
                Update District
              </button>
              <button
                type="button"
                className="btn btn-secondary flex-1"
                onClick={() => navigate("/admin/viewdistrict")}
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

export default UpdateDistrict;
