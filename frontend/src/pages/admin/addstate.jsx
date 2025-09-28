import React, { useState } from "react";
import SidebarLayout from "../../components/admin/adminsidebar";
import toast from "react-hot-toast";
import api from "../../lib/axios";
import { useNavigate } from "react-router-dom";

const Addstate = () => {
  const [name, setstatename] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await api.post("/admin/addstate", {
        name,
      });
      toast.success("State Added Successfully");
      navigate("/admin/viewstate"); // Redirect to view states page
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
          <h2 className="text-2xl font-semibold mb-4">Add State</h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">State Name</label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Enter state name"
                onChange={(e) => setstatename(e.target.value)}
                value={name}
              />
            </div>

            <div className="flex gap-4 mt-6">
              <button type="submit" className="btn btn-primary">
                Add
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/viewstate")}
                className="btn btn-secondary"
              >
                View States
              </button>
            </div>
          </form>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Addstate;
