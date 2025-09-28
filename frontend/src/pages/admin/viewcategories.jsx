import React, { useState, useEffect } from "react";
import SidebarLayout from "../../components/admin/adminsidebar";
import toast from "react-hot-toast";
import api from "../../lib/axios";
import { useNavigate } from "react-router-dom";

const ViewCategory = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await api.get("/admin/getcategories");
      setCategories(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load categories");
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await api.delete(`/admin/deletecategory/${id}`);
      toast.success("Category deleted successfully");
      fetchCategories(); // refresh
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete category");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <SidebarLayout>
      <div className="p-6">
        {/* Header with Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <h2 className="text-2xl font-bold text-gray-800">View Categories</h2>
          <button
            onClick={() => navigate("/admin/addcategory")}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium 
                       hover:bg-blue-700 active:scale-95 transition-transform duration-200"
          >
            ➕ Add New Category
          </button>
        </div>

        {categories.length === 0 ? (
          <p className="text-gray-600">No categories available.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category._id}
                className="bg-white shadow-md rounded-xl p-4 border border-gray-200 hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  {category.name}
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate(`/admin/updatecategory/${category._id}`)}
                    className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg font-medium 
                               hover:bg-green-700 active:scale-95 transition-transform duration-200"
                  >
                     Update
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg font-medium 
                               hover:bg-red-700 active:scale-95 transition-transform duration-200"
                  >
                     Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default ViewCategory;
