import express from "express";
import {
  getAllServices,
  getServiceById,
  createServiceRequest,
  checkServiceRequest,
  getMyRequests,
  cancelServiceRequest,
  getCustomerDetails,
  updateCustomerDetails
} from "../controllers/userController.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

// Get all services with filtering and sorting
router.get("/services", authenticateUser, getAllServices);

// Get a single service by ID
router.get("/service/:id", authenticateUser, getServiceById);

// Create a service request
router.post("/service-request", authenticateUser, createServiceRequest);

// Check if a service request already exists
router.get("/service-request/check/:id", authenticateUser, checkServiceRequest);

// Get all requests of the logged-in user
router.get("/service-request/my-requests", authenticateUser, getMyRequests);

// Cancel a service request
router.patch("/service-request/:id/cancel", authenticateUser, cancelServiceRequest);

// Get account details
router.get("/account", authenticateUser, getCustomerDetails);

// Update account details
router.put("/account", authenticateUser, updateCustomerDetails);

export default router;
