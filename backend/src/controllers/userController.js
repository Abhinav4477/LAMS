// controllers/userController.js
import Service from "../models/Service.js";
import ServiceRequest from "../models/Servicerequest.js";
import mongoose from "mongoose";
import Payment from "../models/Payment.js"

// Helper to convert string to ObjectId safely
const toObjectId = (id) => {
  try {
    return new mongoose.Types.ObjectId(id);
  } catch {
    return null;
  }
};

// Get all services
export const getAllServices = async (req, res) => {
  try {
    const { categoryId, stateId, districtId, locationId, minPrice, maxPrice, sortBy } = req.query;
    const query = {};

    if (categoryId) query.category = categoryId;
    if (locationId) query.location = locationId;
    else if (districtId) query["location.district"] = districtId;
    else if (stateId) query["location.district.state"] = stateId;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sort = { createdAt: -1 };
    if (sortBy === "priceAsc") sort = { price: 1 };
    if (sortBy === "priceDesc") sort = { price: -1 };

    const services = await Service.find(query)
      .populate("category")
      .populate({
        path: "location",
        populate: {
          path: "district",
          populate: { path: "state" },
        },
      })
      .populate("provider", "username email")
      .sort(sort);

    res.json(services);
  } catch (err) {
    console.error("Get services error:", err);
    res.status(500).json({ message: "Failed to fetch services" });
  }
};

// Get service by ID
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate("provider", "username email")
      .populate("category", "name")
      .populate({
        path: "location",
        populate: {
          path: "district",
          populate: { path: "state" },
        },
      });

    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (error) {
    console.error("Get service by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create service request
export const createServiceRequest = async (req, res) => {
  try {
    const { serviceId, providerId } = req.body;
    const userId = req.user.id;

    if (!serviceId || !providerId) {
      return res.status(400).json({ message: "Service ID and Provider ID are required" });
    }

    const serviceObjectId = toObjectId(serviceId);
    if (!serviceObjectId) return res.status(400).json({ message: "Invalid Service ID" });

    const activeStatuses = ["Pending", "Accepted", "Working"];
    const existingRequest = await ServiceRequest.findOne({
      userId,
      serviceId: serviceObjectId,
      status: { $in: activeStatuses },
    });

    if (existingRequest) {
      return res.status(400).json({
        message: `You already have an active request (Status: ${existingRequest.status})`,
        activeRequest: existingRequest,
      });
    }

    const newRequest = await ServiceRequest.create({
      userId,
      serviceId: serviceObjectId,
      providerId,
      status: "Pending",
    });

    res.status(201).json({
      message: "Service request created successfully",
      request: newRequest,
      activeRequest: newRequest,
    });
  } catch (error) {
    console.error("Create request error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Check if a service request exists
export const checkServiceRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: serviceId } = req.params;

    const serviceObjectId = toObjectId(serviceId);
    if (!serviceObjectId) return res.status(400).json({ message: "Invalid Service ID" });

    const activeStatuses = ["Pending", "Accepted", "Working"];
    const activeRequest = await ServiceRequest.findOne({
      userId,
      serviceId: serviceObjectId,
      status: { $in: activeStatuses },
    });

    if (activeRequest) {
      return res.status(200).json({
        canRequest: false,
        message: `You already have an active request (Status: ${activeRequest.status}).`,
        activeRequest,
      });
    }

    return res.status(200).json({
      canRequest: true,
      message: "You can request this service.",
      activeRequest: null,
    });
  } catch (err) {
    console.error("Check request error:", err);
    res.status(500).json({ message: "Server error while checking request" });
  }
};

// Cancel service request
export const cancelServiceRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: requestId } = req.params;

    const requestObjectId = toObjectId(requestId);
    if (!requestObjectId) return res.status(400).json({ message: "Invalid Request ID" });

    const request = await ServiceRequest.findOne({ _id: requestObjectId, userId });
    if (!request) return res.status(404).json({ message: "Request not found." });
    if (request.status !== "Pending") return res.status(400).json({ message: "Only pending requests can be cancelled." });

    request.status = "Cancelled";
    await request.save();

    res.status(200).json({
      message: "Service request has been cancelled successfully.",
      request,
    });
  } catch (err) {
    console.error("Cancel request error:", err);
    res.status(500).json({ message: "Server error while cancelling request." });
  }
};

// Get all requests of the logged-in user
export const getMyRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    // Step 1: Find all payments that are Paid
    const paidPayments = await Payment.find({ userId, status: "Paid" }).select("requestId");
    const paidRequestIds = paidPayments.map((p) => p.requestId);

    // Step 2: Fetch ServiceRequests that are NOT in paidRequestIds
    const requests = await ServiceRequest.find({
      userId,
      _id: { $nin: paidRequestIds }, // exclude paid requests
    })
      .populate({
        path: "serviceId",
        select: "name price coverImage location",
        populate: { path: "location", select: "name" },
      })
      .populate({
        path: "providerId",
        select: "username email",
      })
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching user requests:", error);
    res.status(500).json({ message: "Server error while fetching requests" });
  }
};