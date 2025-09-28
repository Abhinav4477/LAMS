import React, { useState, useEffect } from "react";
import SidebarLayout from "../../components/admin/adminsidebar";
import toast from "react-hot-toast";
import api from "../../lib/axios";
import { useNavigate, useParams } from "react-router-dom";

const Updatestate = () => {
  const [name, setstatename] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  // Load existing state details
  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await api.get(`/admin/getstate/${id}`);
        setstatename(res.data.name);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load state details");
      }
    };
    fetchState();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await api.put(`/admin/updatestate/${id}`, { name });
      toast.success("State Updated Successfully");
      navigate("/admin/viewstate");
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
          <h2 className="text-2xl font-semibold mb-4">Update State</h2>

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
                Update
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/viewstate")}
                className="btn btn-error"
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

export default Updatestate;
