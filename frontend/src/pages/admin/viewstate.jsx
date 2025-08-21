import React, { useEffect, useState } from "react";
import SidebarLayout from "../../components/admin/adminsidebar";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const ViewState = () => {
  const [states, setStates] = useState([]);
  const navigate = useNavigate();

  // Fetch states
  const fetchStates = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/admin/getstates");
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
      await axios.delete(`http://localhost:5001/api/admin/deletestate/${id}`);
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Manage States</h2>
          <button
            onClick={() => navigate('/admin/addstate')}
            className="btn btn-primary"
          >
            + Add More
          </button>
        </div>

        {/* States List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {states.length > 0 ? (
            states.map((state) => (
              <div
                key={state._id}
                className="card bg-base-200 shadow-md p-4 flex flex-col justify-between"
              >
                <h3 className="text-lg font-medium">{state.name}</h3>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/updatestate/${state._id}`)} 
                    className="btn btn-sm btn-warning"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(state._id)}
                    className="btn btn-sm btn-error"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No states added yet.</p>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
};

export default ViewState;
