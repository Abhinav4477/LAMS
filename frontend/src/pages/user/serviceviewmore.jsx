import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import NavbarDemo from "../../components/user/Unavbar";
import Footer from "../../components/Footer";

const ServiceView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5001/api/user/service/${id}`);
        setService(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load service");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex flex-col">
        <NavbarDemo />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-lg">Loading service...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex flex-col">
        <NavbarDemo />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-lg">Service not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white flex flex-col min-h-screen">
      <NavbarDemo />
      <Toaster />

      <main className="flex-1 p-6 max-w-5xl mx-auto">
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
          {service.coverImage && (
            <img
              src={`http://localhost:5001/${service.coverImage}`}
              alt={service.name}
              className="w-full md:w-1/2 h-64 md:h-auto object-cover"
            />
          )}

          <div className="p-6 flex flex-col flex-1">
            <h1 className="text-3xl font-bold mb-4">{service.name}</h1>
            <p className="text-green-400 font-bold text-xl mb-2">₹{service.price}</p>
            <p className="text-sm text-gray-400 mb-4">
              {service.location?.name}, {service.location?.district?.name},{" "}
              {service.location?.district?.state?.name}
            </p>

            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-300 mb-4">{service.description || "No description available."}</p>

            {service.additionalInfo && (
              <>
                <h2 className="text-xl font-semibold mb-2">Additional Information</h2>
                <p className="text-gray-300 mb-4">{service.additionalInfo}</p>
              </>
            )}

            <button
              onClick={() => navigate(`/request-service/${service._id}`)}
              className="mt-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 transition rounded text-white font-semibold"
            >
              Request Service
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ServiceView;
