import React, { useState, useEffect } from "react";
import SidebarLayout from "../../components/admin/adminsidebar";
import toast from "react-hot-toast";
import api from "../../lib/axios";
import { useNavigate } from "react-router-dom";

const Adddistrict = () => {
  const [name, setdistrictname] = useState("");
  const [stateId, setstateId] = useState("");
  const [states, setStates] = useState([]); // Store all states here
  const navigate = useNavigate();

  // Fetch all states on component mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await api.get("/admin/getstates");
        setStates(res.data); // assuming response is an array of { _id, name }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load states");
      }
    };
    fetchStates();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !stateId.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await api.post("/admin/adddistrict", {
        name,
        stateId,
      });
      toast.success("District Added Successfully");
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
          <h2 className="text-2xl font-semibold mb-4">Add District</h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">District Name</label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Enter district name"
                onChange={(e) => setdistrictname(e.target.value)}
                value={name}
              />
            </div>

            <div>
              <label className="label">Select State</label>
              <select
                className="select select-bordered w-full"
                value={stateId}
                onChange={(e) => setstateId(e.target.value)}
              >
                <option value="">-- Select a state --</option>
                {states.map((state) => (
                  <option key={state._id} value={state._id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
              <button type="submit" className="btn btn-primary">
                Add
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/viewdistrict")}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/viewdistrict")}
                className="btn btn-accent"
              >
                View Districts
              </button>
            </div>
          </form>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Adddistrict;
