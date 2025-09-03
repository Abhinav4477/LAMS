// controllers/userController.js
import Service from "../models/Service.js";
import ServiceRequest from "../models/Servicerequest.js";

// Get all services
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
    if (categoryId) query.category = categoryId;

    // Location filters (cascading)
    if (locationId) query.location = locationId;
    else if (districtId) query["location.district"] = districtId;
    else if (stateId) query["location.district.state"] = stateId;

    // Price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sorting
    let sort = { createdAt: -1 };
    if (sortBy === "priceAsc") sort = { price: 1 };
    if (sortBy === "priceDesc") sort = { price: -1 };

    // Fetch services with populated references
    const services = await Service.find(query)
      .populate("category")
      .populate({
        path: "location",
        populate: {
          path: "district",
          populate: { path: "state" },
        },
      })
      .populate("provider", "name email") // <-- populate provider directly
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
      .populate("provider", "username email role") // <- only provider
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

    const existingRequest = await ServiceRequest.findOne({
      userId,
      serviceId,
      status: "Pending",
    });

    if (existingRequest) {
      return res.status(400).json({ message: "You already have a pending request for this service" });
    }

    const newRequest = await ServiceRequest.create({
      userId,
      serviceId,
      providerId,
    });

    res.status(201).json({ message: "Service request created successfully", request: newRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Check if a service request exists
export const checkServiceRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: serviceId } = req.params;

    const requestExists = await ServiceRequest.exists({ userId, serviceId });

    res.status(200).json({ requestExists: !!requestExists });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to check service request" });
  }
};

//Function to get requests of a user
export const getMyRequests = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id; // <- use `id`, not `_id`

    const requests = await ServiceRequest.find({ userId })
      .populate({
        path: "serviceId",
        select: "name price coverImage location",
        populate: {
          path: "location",
          select: "name", // only name
        },
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
