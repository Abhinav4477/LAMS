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

const router = express.Router();

// Get all services with filtering and sorting
router.get("/services", getAllServices);

// Get a single service by ID
router.get("/service/:id",  getServiceById);

// Create a service request
router.post("/service-request",  createServiceRequest);

// Check if a service request already exists
router.get("/service-request/check/:id",  checkServiceRequest);

// Get all requests of the logged-in user
router.get("/service-request/my-requests", getMyRequests);

// Cancel a service request
router.patch("/service-request/:id/cancel",  cancelServiceRequest);

// Get account details
router.get("/account",  getCustomerDetails);

// Update account details
router.put("/account",  updateCustomerDetails);

export default router;
