import Review from "../models/Review.js";
import Service from "../models/Service.js"; // optional if updating avg rating

// Add a new review
export const addReview = async (req, res) => {
  try {
    const userId = req.user.id; // from your authenticateUser middleware
    const { serviceId, rating, review } = req.body;

    if (!serviceId || !rating) {
      return res.status(400).json({ message: "Service ID and rating are required" });
    }

    // Optional: check if service exists
    const serviceExists = await Service.findById(serviceId);
    if (!serviceExists) return res.status(404).json({ message: "Service not found" });

    // Check if user already has a review
    let existingReview = await Review.findOne({ service: serviceId, user: userId });

    if (existingReview) {
      // Update existing review
      existingReview.rating = rating;
      existingReview.review = review;
      existingReview.updatedAt = Date.now();
      await existingReview.save();
      return res.status(200).json({ message: "Review updated successfully", review: existingReview });
    }

    // Create new review
    const newReview = new Review({
      service: serviceId,
      user: userId,
      rating,
      review,
    });
    await newReview.save();

    res.status(201).json({ message: "Review added successfully", review: newReview });
  } catch (err) {
    console.error("Add/Update review error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all reviews for a service
export const getReviewsByService = async (req, res) => {
  const { serviceId } = req.params;

  try {
    // Populate the 'user' field to get the username and email
    const reviews = await Review.find({ service: serviceId })
      .populate("user", "username email")  // fetch username
      .sort({ createdAt: -1 });

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    res.json({
      reviews,
      avgRating: avgRating.toFixed(1),
      reviewCount: reviews.length,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};