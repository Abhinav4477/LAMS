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
  const [requesting, setRequesting] = useState(false);
  const [canRequest, setCanRequest] = useState(null);
  const [checkMessage, setCheckMessage] = useState("");
  const [activeRequest, setActiveRequest] = useState(null);

  // Fetch service details
  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5001/api/user/service/${id}`, {
          withCredentials: true,
        });
        setService(res.data);
      } catch (err) {
        console.error("Get service by ID error:", err);
        toast.error(err.response?.data?.message || "Failed to load service");
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  // Check active request
  const checkRequest = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/user/service-request/check/${id}`, {
        withCredentials: true,
      });
      setCanRequest(res.data.canRequest);
      setCheckMessage(res.data.message || "");
      setActiveRequest(res.data.activeRequest || null);
    } catch (err) {
      console.error("Check request error:", err);
      setCanRequest(true); // assume user can request if error
      setActiveRequest(null);
      setCheckMessage("");
    }
  };

  useEffect(() => {
    checkRequest();
  }, [id]);

  // Handle request
  const handleRequestService = async () => {
    if (!canRequest) {
      toast.error("You already have an active request for this service!");
      return;
    }
    if (!service?.provider?._id) {
      toast.error("Service provider not found");
      return;
    }
    try {
      setRequesting(true);
      const res = await axios.post(
        "http://localhost:5001/api/user/service-request",
        { serviceId: service._id, providerId: service.provider._id },
        { withCredentials: true }
      );
      toast.success(res.data.message || "Service request sent successfully!");
      await checkRequest();
    } catch (err) {
      console.error("Send request error:", err);
      toast.error(err.response?.data?.message || "Failed to send service request");
    } finally {
      setRequesting(false);
    }
  };

  // Handle cancel
  const handleCancelRequest = async () => {
    if (!activeRequest?._id) return;
    try {
      setRequesting(true);
      const res = await axios.patch(
        `http://localhost:5001/api/user/service-request/${activeRequest._id}/cancel`,
        {},
        { withCredentials: true }
      );
      toast.success(res.data.message || "Request cancelled successfully!");
      await checkRequest();
    } catch (err) {
      console.error("Cancel request error:", err);
      toast.error(err.response?.data?.message || "Failed to cancel request");
    } finally {
      setRequesting(false);
    }
  };

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

  // Determine button
  let buttonElement;
  const status = activeRequest?.status?.toLowerCase();

  if (canRequest) {
    buttonElement = (
      <button
        onClick={handleRequestService}
        disabled={requesting}
        className={`mt-4 px-6 py-3 rounded text-white font-semibold transition ${
          requesting ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {requesting ? "Requesting..." : "Request Service"}
      </button>
    );
  } else if (status === "pending") {
    buttonElement = (
      <button
        onClick={handleCancelRequest}
        disabled={requesting}
        className={`mt-4 px-6 py-3 rounded text-white font-semibold transition ${
          requesting ? "bg-gray-600 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
        }`}
      >
        {requesting ? "Processing..." : "Cancel Pending Request"}
      </button>
    );
  } else if (["accepted", "working"].includes(status)) {
    buttonElement = (
      <button
        disabled
        className="mt-4 px-6 py-3 bg-gray-600 rounded text-white font-semibold cursor-not-allowed"
      >
        Request Already Active ({activeRequest.status})
      </button>
    );
  } else {
    buttonElement = (
      <button
        onClick={handleRequestService}
        disabled={requesting}
        className={`mt-4 px-6 py-3 rounded text-white font-semibold transition ${
          requesting ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {requesting ? "Requesting..." : "Request Service"}
      </button>
    );
  }

  return (
    <div className="bg-gray-900 text-white flex flex-col min-h-screen">
      <NavbarDemo />
      <Toaster />
      <main className="flex-1 p-4 md:p-6 max-w-5xl mx-auto">
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded z-10"
          >
            &larr; Go Back
          </button>

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

            {service.provider && (
              <div className="mt-4 p-4 bg-gray-700 rounded">
                <h2 className="text-xl font-semibold mb-2">Service Provider</h2>
                <p className="text-gray-300">Name: {service.provider.username}</p>
                <p className="text-gray-300">Email: {service.provider.email}</p>
              </div>
            )}

            {buttonElement}

            {checkMessage && <p className="text-gray-400 text-sm mt-2">{checkMessage}</p>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceView;
