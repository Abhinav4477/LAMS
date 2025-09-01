import React, { useState } from "react";
import SidebarLayout from "../../components/admin/adminsidebar";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Addcategory = () => {
  const [name, setCategoryName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please fill in the category name");
      return;
    }
    try {
      await axios.post("http://localhost:5001/api/admin/addcategory", { name });
      toast.success("Category Added Successfully");
      navigate("/admin/viewcategory");
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
        <div className="card bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">
          {/* Header */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Add Category
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Enter category name"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium 
                           hover:bg-blue-700 active:scale-95 transition-transform duration-200"
              >
                Add Category
              </button>

              <button
                type="button"
                onClick={() => setCategoryName("")}
                className="flex-1 bg-gray-200 text-gray-700 py-2.5 px-4 rounded-lg font-medium 
                           hover:bg-gray-300 active:scale-95 transition-transform duration-200"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/viewcategory")}
                className="flex-1 bg-green-600 text-white py-2.5 px-4 rounded-lg font-medium 
                           hover:bg-green-700 active:scale-95 transition-transform duration-200"
              >
                View Categories
              </button>
            </div>
          </form>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Addcategory;
