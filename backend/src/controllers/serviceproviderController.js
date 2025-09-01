import Service from "../models/Service.js";
import Category from "../models/Category.js";
import Location from "../models/Location.js";
import mongoose from "mongoose";


// Create a new service

export const createService = async (req, res) => {
  try {
    const { name, description, price, categoryId, locationId } = req.body;
    const userId = req.user?.id; // make sure req.user exists

    if (!name || !description || !price || !categoryId || !locationId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check category & location exist
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
    });

    const savedService = await service.save();
    res.status(201).json({ message: "Service created", service: savedService });
  } catch (err) {
    console.error("Create service error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

//function to get services by provider
export const getServicesByProvider = async (req, res) => {
  try {
    const userId = req.user?.id; // make sure req.user exists
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

//delete service function
export const deleteService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const userId = req.user?.id; // make sure req.user exists
    const service = await Service.findOneAndDelete({ _id: serviceId, provider: userId });
    if (!service) {
      return res.status(404).json({ error: "Service not found or unauthorized" });
    }
    res.status(200).json({ message: "Service deleted" });
  } catch (err) {
    console.error("Delete service error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Function to get service by id
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


//Function to update service by id
export const updateServiceById = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const userId = req.user?.id; // ensure req.user exists
    const { name, description, price, categoryId, locationId } = req.body;

    // Validate required fields
    if (!name || !description || !price || !categoryId || !locationId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) return res.status(400).json({ error: "Invalid category" });

    // Check if location exists
    const location = await Location.findById(locationId);
    if (!location) return res.status(400).json({ error: "Invalid location" });

    // Update the service
    const service = await Service.findOneAndUpdate(
      { _id: serviceId, provider: userId },
      {
        name,
        description,
        price,
        category: category._id.toString(), // ensure string
        location: location._id.toString(), // ensure string
      },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ error: "Service not found or unauthorized" });
    }

    res.status(200).json({ message: "Service updated", service });
  } catch (err) {
    console.error("Update service error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
