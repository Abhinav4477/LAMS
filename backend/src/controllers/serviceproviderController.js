import Service from "../models/Service.js";
import Category from "../models/Category.js";
import Location from "../models/Location.js";
import User from "../models/Users.js";
import path from "path";
import fs from "fs";
import ServiceProvider from "../models/ServiceProvider.js";
import mongoose from "mongoose";

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
      coverImage: req.file ? req.file.path : "", // store uploaded image path
    });

    const savedService = await service.save();
    res.status(201).json({ message: "Service created", service: savedService });
  } catch (err) {
    console.error("Create service error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all services by provider (returns coverImage path)
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

// Delete a service by ID
export const deleteService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const userId = req.user?.id;

    // Find the service first (so we know the cover image path)
    const service = await Service.findOne({ _id: serviceId, provider: userId });
    if (!service) {
      return res.status(404).json({ error: "Service not found or unauthorized" });
    }

    // Delete the cover image from disk if it exists
    if (service.coverImage) {
      fs.unlink(service.coverImage, (err) => {
        if (err) console.error("Failed to delete cover image:", err);
      });
    }

    // Delete the service document from DB
    await Service.findByIdAndDelete(serviceId);

    res.status(200).json({ message: "Service and cover image deleted" });
  } catch (err) {
    console.error("Delete service error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get service by ID (returns coverImage path)
export const getServiceById = async (req, res) => {
  try {
    const serviceId = req.params.id;

    const service = await Service.findById(serviceId)
      .populate("category", "name")
      .populate("location", "name")
      .populate("provider", "name email")
      .exec();

    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    res.status(200).json(service);
  } catch (err) {
    console.error("Get service by ID error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update a service by ID with optional cover image
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
    if (!service) {
      return res.status(404).json({ error: "Service not found or unauthorized" });
    }

    // Prepare updated data
    const updatedData = {
      name,
      description,
      price,
      category: category._id.toString(),
      location: location._id.toString(),
    };

    // Handle new cover image
    if (req.file) {
      // Delete old image safely
      if (service.coverImage) {
        const oldPath = path.join(process.cwd(), service.coverImage);
        fs.access(oldPath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlink(oldPath, (err) => {
              if (err) console.error("Failed to delete old image:", err);
            });
          }
        });
      }
      updatedData.coverImage = req.file.path;
    }

    // Update service
    const updatedService = await Service.findByIdAndUpdate(serviceId, updatedData, { new: true });

    res.status(200).json({ message: "Service updated", service: updatedService });
  } catch (err) {
    console.error("Update service error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

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
    const response = { ...providerData, email: user.email };

    res.status(200).json(response);
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
    const response = { ...providerData, email: user.email };

    res.status(200).json({ message: "Profile updated", profile: response });
  } catch (err) {
    console.error("Update service provider profile error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
