import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, XAxis, YAxis, Bar, Legend, ResponsiveContainer
} from "recharts";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";

const COLORS = ["#4F46E5", "#22D3EE", "#FBBF24", "#F472B6", "#10B981", "#EF4444"];

const SPReport = () => {
  const [data, setData] = useState({ requestData: [], statusData: [], revenueData: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:5001/api/payment/provider/report",
          { withCredentials: true }
        );
        setData(res.data);
      } catch (err) {
        console.error("Error fetching report:", err);
        setError(err.response?.data?.message || "Failed to fetch report");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const tooltipStyle = {
    backgroundColor: "#111827",
    border: "1px solid #4F46E5",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: "4px",
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white relative">

      {/* GO BACK BUTTON */}
      <button
        onClick={() => navigate("/serviceprovider/serviceproviderHomepage")}
        className="fixed top-4 left-4 z-50 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-colors duration-200"
      >
        ← Go Back
      </button>

      {/* MAIN CONTENT */}
      <div className="flex-1 pt-20 p-6 md:p-12 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center">Service Report</h1>

        {loading && <p className="text-center animate-pulse text-xl">Loading report...</p>}
        {error && <p className="text-center text-red-500 text-xl">{error}</p>}
        {!loading && !error &&
          (!data.requestData.length && !data.statusData.length && !data.revenueData.length) && (
            <p className="text-center text-xl">No report data available.</p>
        )}

        {!loading && !error && (data.requestData.length || data.statusData.length || data.revenueData.length) && (
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Requests per Service */}
{data.requestData.length > 0 && (
  <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all flex justify-center lg:col-span-2">
    <div className="w-full h-[550px]">
      <h2 className="text-2xl font-semibold mb-6 text-center">Requests per Service</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data.requestData}
            dataKey="count"
            nameKey="serviceName"
            cx="50%"
            cy="50%"
            outerRadius={220}
            fill="#8884d8"
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          >
            {data.requestData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} formatter={(value) => `${value} requests`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
)}


            {/* Revenue per Service */}
            {data.revenueData.length > 0 && (
              <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all lg:col-span-2 w-full">
                <h2 className="text-2xl font-semibold mb-6 text-center">Revenue per Service</h2>
                <div className="w-full h-[450px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.revenueData} margin={{ left: 0, right: 0 }}>
                      <XAxis dataKey="serviceName" stroke="#fff" tick={{ fontSize: 14 }} />
                      <YAxis stroke="#fff" tick={{ fontSize: 14 }} />
                      <Tooltip contentStyle={tooltipStyle} formatter={(value) => `₹${value}`} />
                      <Legend wrapperStyle={{ color: "#fff" }} />
                      <Bar dataKey="totalAmount" fill="#FBBF24" name="Revenue (₹)" barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            
            {/* Requests by Status */}
            {data.statusData.length > 0 && (
              <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all  w-full" style={{ width: "300px" }}>
                <h2 className="text-2xl font-semibold mb-6 text-center">Requests by Status</h2>
                
                <div className="w-full h-[450px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.statusData} margin={{ left: 0, right: 0 }}>
                      <XAxis dataKey="_id" stroke="#fff" tick={{ fontSize: 14 }} />
                      <YAxis stroke="#fff" tick={{ fontSize: 14 }} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend wrapperStyle={{ color: "#fff" }} />
                      <Bar dataKey="count" fill="#22D3EE" barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}


          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SPReport;
