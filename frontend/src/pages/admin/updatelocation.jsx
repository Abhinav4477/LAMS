import React, { useState, useEffect } from "react";
import SidebarLayout from "../../components/admin/adminsidebar";
import toast from "react-hot-toast";
import api from "../../lib/axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdateLocation = () => {
    const { id } = useParams(); // location ID from URL
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

    // Fetch location data by ID
    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const res = await api.get(`/admin/getlocation/${id}`);
                const location = res.data;
                setLocationName(location.name);
                setStateId(location.district?.state?._id || "");
                setDistrictId(location.district?._id || "");
            } catch (error) {
                console.error(error);
                toast.error("Failed to load location data");
            }
        };
        fetchLocation();
    }, [id]);

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
            await api.put(`/admin/updatelocation/${id}`, {
                name,
                districtId,
            });
            toast.success("Location Updated Successfully");
            navigate("/admin/viewlocation");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update location");
        }
    };

    return (
        <SidebarLayout>
            <div className="p-6 flex justify-start">
                {/* Card Container */}
                <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 border border-gray-200">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Update Location</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Location Name */}
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">Location Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setLocationName(e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                            />
                        </div>

                        {/* State Dropdown */}
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">State</label>
                            <select
                                value={stateId}
                                onChange={(e) => setStateId(e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                            >
                                <option value="">Select State</option>
                                {states.map((state) => (
                                    <option key={state._id} value={state._id}>
                                        {state.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* District Dropdown */}
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">District</label>
                            <select
                                value={districtId}
                                onChange={(e) => setDistrictId(e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                                disabled={!stateId}
                            >
                                <option value="">Select District</option>
                                {districts.map((district) => (
                                    <option key={district._id} value={district._id}>
                                        {district.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 justify-start mt-4">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Update
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/admin/viewlocation")}
                                className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-400 transition"
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

export default UpdateLocation;
