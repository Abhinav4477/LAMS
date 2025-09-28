import React, { useEffect, useState } from "react";
import SidebarLayout from "../../components/admin/adminsidebar";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../lib/axios";

const ViewState = () => {
  const [states, setStates] = useState([]);
  const navigate = useNavigate();

  // Fetch states
  const fetchStates = async () => {
    try {
      const res = await api.get("/admin/getstates");
      setStates(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching states");
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  // Delete state
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this state?")) return;
    try {
      await api.delete(`/admin/deletestate/${id}`);
      toast.success("State deleted successfully");
      fetchStates();
    } catch (error) {
      console.error(error);
      toast.error("Error deleting state");
    }
  };

  return (
    <SidebarLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-semibold">Manage States</h2>
          <button
            onClick={() => navigate('/admin/addstate')}
            className="btn btn-primary hover:scale-105 transition-transform duration-200"
          >
            + Add More
          </button>
        </div>

        {/* States List (Card Layout) */}
        {states.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {states.map((state) => (
              <div
                key={state._id}
                className="card bg-base-200 shadow-md rounded-xl p-4 hover:shadow-lg hover:-translate-y-1 transition-transform duration-200 ease-in-out"
              >
                <h3 className="text-lg font-bold">{state.name}</h3>
                
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/admin/updatestate/${state._id}`)}
                    className="btn btn-sm btn-secondary hover:scale-105 transition-transform duration-200"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(state._id)}
                    className="btn btn-sm text-white bg-red-600 hover:bg-red-500 hover:scale-105 transition-all duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">No states added yet.</p>
        )}
      </div>
    </SidebarLayout>
  );
};

export default ViewState;
