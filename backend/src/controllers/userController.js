// controllers/userController.js
import Service from "../models/Service.js";

export const getAllServices = async (req, res) => {
  try {
    const {
      categoryId,
      stateId,
      districtId,
      locationId,
      minPrice,
      maxPrice,
      sortBy,
    } = req.query;

    const query = {};

    // Category filter
    if (categoryId) {
      query.category = categoryId;
    }

    // Location filters (cascading)
    if (locationId) {
      query.location = locationId;
    } else if (districtId) {
      query["location.district"] = districtId;
    } else if (stateId) {
      query["location.district.state"] = stateId;
    }

    // Price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sorting
    let sort = { createdAt: -1 }; // default: latest
    if (sortBy === "priceAsc") sort = { price: 1 };
    if (sortBy === "priceDesc") sort = { price: -1 };

    // Fetch services with populated references
    const services = await Service.find(query)
      .populate("category")
      .populate({
        path: "location",
        populate: {
          path: "district",
          populate: {
            path: "state",
          },
        },
      })
      .sort(sort);

    res.json(services);
  } catch (err) {
    console.error("Get services error:", err);
    res.status(500).json({ message: "Failed to fetch services" });
  }
};

//Function to get service by ID for detailed view
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if id is provided
    if (!id) {
      return res.status(400).json({ message: "Service ID is required" });
    }

    // Find service by ID and populate related fields
    const service = await Service.findById(id)
      .populate("category") // category field
      .populate({
        path: "location",
        populate: {
          path: "district",
          populate: {
            path: "state",
          },
        },
      });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    return res.status(200).json(service);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};