import Service from "../models/Service.js";
import Category from "../models/Category.js";
import Location from "../models/Location.js";
import User from "../models/Users.js";
import ServiceRequest from "../models/Servicerequest.js";
import ServiceProvider from "../models/ServiceProvider.js";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";

// Nodemailer transporter for sending emails
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,        // smtp-relay.brevo.com
  port: Number(process.env.SMTP_PORT), // 587
  secure: false,                       // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

// -------------------- Service CRUD --------------------

// Create a new service with optional cover image
export const createService = async (req, res) => {
  try {
    const { name, description, price, categoryId, locationId } = req.body;
    const userId = req.user?.id;

    if (!name || !description || !price || !categoryId || !locationId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const category = await Category.findById(categoryId);
    if (!category) return res.status(400).json({ error: "Invalid category" });

    const location = await Location.findById(locationId);
    if (!location) return res.status(400).json({ error: "Invalid location" });

    const service = new Service({
      name,
      description,
      price,
      category: category._id,
      location: location._id,
      provider: userId,
      coverImage: req.file ? req.file.path : "",
    });

    const savedService = await service.save();
    res.status(201).json({ message: "Service created", service: savedService });
  } catch (err) {
    console.error("Create service error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all services by provider
export const getServicesByProvider = async (req, res) => {
  try {
    const userId = req.user?.id;
    const services = await Service.find({ provider: userId })
      .populate("category", "name")
      .populate("location", "name")
      .exec();

    res.status(200).json(services);
  } catch (err) {
    console.error("Get services by provider error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get service by ID
export const getServiceById = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const service = await Service.findById(serviceId)
      .populate("category", "name")
      .populate("location", "name")
      .populate("provider", "name email")
      .exec();

    if (!service) return res.status(404).json({ error: "Service not found" });

    res.status(200).json(service);
  } catch (err) {
    console.error("Get service by ID error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update a service by ID
export const updateServiceById = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const userId = req.user?.id;
    const { name, description, price, categoryId, locationId } = req.body;

    if (!name || !description || !price || !categoryId || !locationId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const category = await Category.findById(categoryId);
    if (!category) return res.status(400).json({ error: "Invalid category" });

    const location = await Location.findById(locationId);
    if (!location) return res.status(400).json({ error: "Invalid location" });

    const service = await Service.findOne({ _id: serviceId, provider: userId });
    if (!service) return res.status(404).json({ error: "Service not found or unauthorized" });

    const updatedData = {
      name,
      description,
      price,
      category: category._id.toString(),
      location: location._id.toString(),
    };

    if (req.file) {
      if (service.coverImage) {
        fs.unlink(service.coverImage, (err) => {
          if (err) console.error("Failed to delete old image:", err);
        });
      }
      updatedData.coverImage = req.file.path;
    }

    const updatedService = await Service.findByIdAndUpdate(serviceId, updatedData, { new: true });
    res.status(200).json({ message: "Service updated", service: updatedService });
  } catch (err) {
    console.error("Update service error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a service by ID
export const deleteService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const userId = req.user?.id;

    const service = await Service.findOne({ _id: serviceId, provider: userId });
    if (!service) return res.status(404).json({ error: "Service not found or unauthorized" });

    if (service.coverImage) {
      fs.unlink(service.coverImage, (err) => {
        if (err) console.error("Failed to delete cover image:", err);
      });
    }

    await Service.findByIdAndDelete(serviceId);
    res.status(200).json({ message: "Service and cover image deleted" });
  } catch (err) {
    console.error("Delete service error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// -------------------- Service Provider Profile --------------------

// Get service provider profile
export const getServiceProviderProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const serviceProvider = await ServiceProvider.findOne({ user: userId })
      .populate("user", "email")
      .lean();

    if (!serviceProvider) return res.status(404).json({ error: "Service provider profile not found" });

    const { _id, user, __v, ...providerData } = serviceProvider;
    res.status(200).json({ ...providerData, email: user.email });
  } catch (err) {
    console.error("Get service provider profile error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update service provider profile
export const updateServiceProviderProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { name, phone, address } = req.body;

    if (!name || !phone || !address) return res.status(400).json({ error: "All fields are required" });

    const serviceProvider = await ServiceProvider.findOneAndUpdate(
      { user: userId },
      { name, phone, address },
      { new: true }
    ).populate("user", "email");

    if (!serviceProvider) return res.status(404).json({ error: "Service provider profile not found" });

    const { _id, user, __v, ...providerData } = serviceProvider.toObject();
    res.status(200).json({ message: "Profile updated", profile: { ...providerData, email: user.email } });
  } catch (err) {
    console.error("Update service provider profile error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// -------------------- Service Requests --------------------

// Get all service requests for the provider
export const getServiceProviderRequests = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;

    const requests = await ServiceRequest.find({ providerId: loggedInUserId })
      .populate("userId", "username email")
      .populate("serviceId", "name description price")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    console.error("Error fetching service provider requests:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Accept or Reject a service request and send email
export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const request = await ServiceRequest.findById(id)
      .populate("userId", "username email")
      .populate("serviceId", "name");

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    if (request.providerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    request.status = status;
    await request.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: request.userId.email,
      subject: `Your request for ${request.serviceId.name} is ${status}`,
      text: `Hello ${request.userId.username},\n\nYour request for "${request.serviceId.name}" has been ${status.toLowerCase()} by the service provider.\n\nRegards,\nLocal Aid Team`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: `Request ${status.toLowerCase()}`, request });
  } catch (error) {
    console.error("Update request error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get only accepted requests for a provider
export const getAcceptedRequests = async (req, res) => {
  try {
    const providerId = req.user.id;

    const requests = await ServiceRequest.find({ providerId, status: "Accepted" })
      .populate("userId", "username email")
      .populate("serviceId", "name description price")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    console.error("Error fetching accepted requests:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update request status (Working / Completed / Rejected)
export const updateRequestStatus1 = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Working", "Completed", "Rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const request = await ServiceRequest.findById(id)
      .populate("userId", "username email")
      .populate("serviceId", "name");

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    if (request.providerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    request.status = status;
    await request.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: request.userId.email,
      subject: `Your request for ${request.serviceId.name} is ${status}`,
      text: `Hello ${request.userId.username},\n\nYour request for "${request.serviceId.name}" has been marked as ${status.toLowerCase()} by the service provider.\n\nRegards,\nLocal Aid Team`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: `Request marked as ${status}`, request });
  } catch (error) {
    console.error("Update request error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Controller function for fetching provider requests
export const getProviderRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({
      providerId: req.user.id,
      status: { $in: ["Accepted", "Working", "Completed"] },
    })
      .populate("userId", "username email")
      .populate("serviceId", "name description price");

    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    console.error("Error fetching provider requests:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update provider availability
export const updateAvailability = async (req, res) => {
  try {
    const { is_available } = req.body;

    if (typeof is_available !== "boolean") {
      return res.status(400).json({ message: "is_available must be true or false" });
    }

    const serviceProvider = await ServiceProvider.findOneAndUpdate(
      { user: req.user.id },
      { is_available },
      { new: true }
    );

    if (!serviceProvider) {
      return res.status(404).json({ message: "Service provider not found" });
    }

    res.status(200).json({
      message: "Availability updated successfully",
      serviceProvider,
    });
  } catch (error) {
    console.error("Error updating availability:", error);
    res.status(500).json({ message: "Server error" });
  }
};
