import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import NavbarDemo from "../../components/user/Unavbar";
import Footer from "../../components/Footer";

// Star rating component
const StarRating = ({ rating, setRating }) => (
  <div className="flex space-x-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => setRating && setRating(star)}
        className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-400"} focus:outline-none`}
      >
        ★
      </button>
    ))}
  </div>
);

const ServiceView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  const [requesting, setRequesting] = useState(false);
  const [canRequest, setCanRequest] = useState(null);
  const [checkMessage, setCheckMessage] = useState("");
  const [activeRequest, setActiveRequest] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [newRating, setNewRating] = useState(0);
  const [newReview, setNewReview] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Fetch service
  const fetchService = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5001/api/user/service/${id}`, {
        withCredentials: true,
      });
      setService(res.data);
    } catch (err) {
      console.error("Service fetch error:", err);
      if (err.response?.status === 401) toast.error("Unauthorized. Please login.");
      else toast.error(err.response?.data?.message || "Failed to load service");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchService(); }, [id]);

  // Check request
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
      setCanRequest(true);
      setActiveRequest(null);
      setCheckMessage("");
    }
  };

  useEffect(() => { checkRequest(); }, [id]);

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/review/${id}`, { withCredentials: true });
      setReviews(res.data.reviews);
      setAvgRating(res.data.avgRating);
      setReviewCount(res.data.reviewCount);
    } catch (err) {
      console.error("Fetch reviews error:", err);
    }
  };

  useEffect(() => { fetchReviews(); }, [id]);

  // Submit review
  const handleAddReview = async () => {
    if (!newRating) return toast.error("Please select a rating");

    try {
      setSubmittingReview(true);
      // The backend should attach logged-in user automatically
      await axios.post(
        "http://localhost:5001/api/review",
        { serviceId: id, rating: newRating, review: newReview },
        { withCredentials: true }
      );
      toast.success("Review added successfully!");
      setNewRating(0);
      setNewReview("");
      fetchReviews();
    } catch (err) {
      console.error("Add review error:", err);
      if (err.response?.status === 401) toast.error("Unauthorized. Please login.");
      else toast.error(err.response?.data?.message || "Failed to add review");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Request service
  const handleRequestService = async () => {
    if (!canRequest) return toast.error("You already have an active request!");
    if (!service?.provider?._id) return toast.error("Service provider not found");

    try {
      setRequesting(true);
      const res = await axios.post(
        "http://localhost:5001/api/user/service-request",
        { serviceId: service._id, providerId: service.provider._id },
        { withCredentials: true }
      );
      toast.success(res.data.message || "Service requested!");
      checkRequest();
    } catch (err) {
      console.error("Request error:", err);
      if (err.response?.status === 401) toast.error("Unauthorized. Please login.");
      else toast.error(err.response?.data?.message || "Failed to request service");
    } finally {
      setRequesting(false);
    }
  };

  // Cancel request
  const handleCancelRequest = async () => {
    if (!activeRequest?._id) return;

    try {
      setRequesting(true);
      const res = await axios.patch(
        `http://localhost:5001/api/user/service-request/${activeRequest._id}/cancel`,
        {},
        { withCredentials: true }
      );
      toast.success(res.data.message || "Request cancelled!");
      checkRequest();
    } catch (err) {
      console.error("Cancel error:", err);
      if (err.response?.status === 401) toast.error("Unauthorized. Please login.");
      else toast.error(err.response?.data?.message || "Failed to cancel request");
    } finally {
      setRequesting(false);
    }
  };

  if (loading) return <p className="text-white text-lg">Loading service...</p>;
  if (!service) return <p className="text-white text-lg">Service not found</p>;

  const status = activeRequest?.status?.toLowerCase();
  let buttonElement;
  if (canRequest) buttonElement = <button onClick={handleRequestService} disabled={requesting} className={`mt-4 px-6 py-3 rounded text-white font-semibold transition ${requesting ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}>{requesting ? "Requesting..." : "Request Service"}</button>;
  else if (status === "pending") buttonElement = <button onClick={handleCancelRequest} disabled={requesting} className={`mt-4 px-6 py-3 rounded text-white font-semibold transition ${requesting ? "bg-gray-600 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}>{requesting ? "Processing..." : "Cancel Pending Request"}</button>;
  else if (["accepted","working"].includes(status)) buttonElement = <button disabled className="mt-4 px-6 py-3 bg-gray-600 rounded text-white font-semibold cursor-not-allowed">Request Already Active ({activeRequest.status})</button>;
  else buttonElement = <button onClick={handleRequestService} disabled={requesting} className={`mt-4 px-6 py-3 rounded text-white font-semibold transition ${requesting ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}>{requesting ? "Requesting..." : "Request Service"}</button>;

  return (
    <div className="bg-gray-900 text-white flex flex-col min-h-screen">
      <NavbarDemo />
      <Toaster />
      <main className="flex-1 p-4 md:p-6 max-w-5xl mx-auto space-y-6">

        {/* Service info */}
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row relative">
          <button onClick={() => navigate(-1)} className="absolute top-4 left-4 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded z-10">&larr; Go Back</button>
          {service.coverImage && <img src={`http://localhost:5001/${service.coverImage}`} alt={service.name} className="w-full md:w-1/2 h-64 md:h-auto object-cover" />}
          <div className="p-6 flex flex-col flex-1 space-y-2">
            <h1 className="text-3xl font-bold">{service.name}</h1>
            <p className="text-green-400 font-bold text-xl">₹{service.price}</p>
            <p className="text-sm text-gray-400">{service.location?.name}, {service.location?.district?.name}, {service.location?.district?.state?.name}</p>
            <h2 className="text-xl font-semibold mt-2">Description</h2>
            <p className="text-gray-300">{service.description || "No description available."}</p>
            {service.additionalInfo && <><h2 className="text-xl font-semibold mt-2">Additional Information</h2><p className="text-gray-300">{service.additionalInfo}</p></>}
            {service.provider && <div className="mt-4 p-4 bg-gray-700 rounded"><h2 className="text-xl font-semibold mb-2">Service Provider</h2><p className="text-gray-300">Name: {service.provider.username}</p><p className="text-gray-300">Email: {service.provider.email}</p></div>}
            {buttonElement}
            {checkMessage && <p className="text-gray-400 text-sm mt-2">{checkMessage}</p>}
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-2xl font-bold">Reviews ({reviewCount})</h2>
          <p className="text-yellow-400 text-lg">Average Rating: {avgRating} ★</p>

          <div className="mt-4 p-4 bg-gray-700 rounded space-y-2">
            <h3 className="text-xl font-semibold">Add Your Review</h3>
            <StarRating rating={newRating} setRating={setNewRating} />
            <textarea value={newReview} onChange={(e) => setNewReview(e.target.value)} className="w-full p-2 rounded bg-gray-600 text-white focus:outline-none" placeholder="Write your review..." />
            <button onClick={handleAddReview} disabled={submittingReview} className={`px-4 py-2 rounded text-white font-semibold ${submittingReview ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}>{submittingReview ? "Submitting..." : "Submit Review"}</button>
          </div>

          <div className="space-y-4">
            {reviews.length === 0 ? <p className="text-gray-400">No reviews yet.</p> :
              reviews.map((r) => (
                <div key={r._id} className="p-4 bg-gray-700 rounded space-y-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold">{r.user?.username || "Anonymous"}</p>
                    <p className="text-yellow-400">{Array(r.rating).fill("★").join("")}</p>
                  </div>
                  {r.review && <p className="text-gray-300">{r.review}</p>}
                  <p className="text-gray-400 text-sm">{new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default ServiceView;
