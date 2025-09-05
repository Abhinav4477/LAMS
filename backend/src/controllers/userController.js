// controllers/userController.js
import Service from "../models/Service.js";
import ServiceRequest from "../models/Servicerequest.js";
import mongoose from "mongoose";
import Payment from "../models/Payment.js"
import Customer from "../models/Customer.js"
import User from "../models/Users.js"
import ServiceProvider from "../models/Serviceprovider.js"

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

    // ---------- Filtering ----------
    if (categoryId) query.category = categoryId;
    if (locationId) query.location = locationId;
    else if (districtId) query["location.district"] = districtId;
    else if (stateId) query["location.district.state"] = stateId;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // ---------- Sorting ----------
    let sort = { createdAt: -1 };
    if (sortBy === "priceAsc") sort = { price: 1 };
    if (sortBy === "priceDesc") sort = { price: -1 };

    // ---------- Get available providers (user IDs) ----------
    const availableProviders = await ServiceProvider.find({ is_available: true }).select("user");
    const availableUserIds = availableProviders.map((p) => p.user);

    // Add provider filter
    query.provider = { $in: availableUserIds };

    // ---------- Fetch services ----------
    const services = await Service.find(query)
      .populate("category")
      .populate({
        path: "location",
        populate: {
          path: "district",
          populate: { path: "state" },
        },
      })
      .populate("provider", "username email") // provider is the user ID
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

//Function to get user info 

export const getCustomerDetails = async (req, res) => {
  try {
    console.log("🔹 Incoming user object from middleware:", req.user);

    // Fallback in case JWT payload has id instead of _id
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: No user ID found" });
    }

    console.log("🔹 Resolved userId:", userId);

    // Populate user info along with customer info
    const customer = await Customer.findOne({ user: userId }).populate(
      "user",
      "username email role"
    );

    if (!customer) {
      console.log("⚠️ No customer document found for userId:", userId);
      return res.status(404).json({ error: "Customer details not found" });
    }

    res.status(200).json({
      name: customer.name,
      phone: customer.phone,
      age: customer.age,
      gender: customer.gender,
      username: customer.user.username,
      email: customer.user.email,
      role: customer.user.role,
    });
  } catch (error) {
    console.error("❌ Error fetching customer details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



//function to update user info

//function to update user info
export const updateCustomerDetails = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id; // ✅ safer check
    const { name, phone, age, gender, username, email } = req.body;

    // Update User fields (username, email) if provided
    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();

    // Update Customer fields
    let customer = await Customer.findOne({ user: userId });
    if (!customer) return res.status(404).json({ error: "Customer details not found" });

    if (name) customer.name = name;
    if (phone) customer.phone = phone;
    if (age) customer.age = age;
    if (gender) customer.gender = gender;

    await customer.save();

    res.status(200).json({ message: "Account updated successfully" });
  } catch (error) {
    console.error("Error updating customer details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
