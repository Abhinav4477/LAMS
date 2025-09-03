import mongoose from "mongoose";
import express from "express";
import { getAllServices } from "../controllers/userController.js";
import { getServiceById } from "../controllers/userController.js";
import { createServiceRequest } from "../controllers/userController.js";
import { authenticateUser } from "../middleware/auth.js";
import { checkServiceRequest } from "../controllers/userController.js";

const router = express.Router();

// Public route to get all services with filtering and sorting
router.get("/services",authenticateUser, getAllServices);

// Public route to get a single service by ID
router.get("/service/:id",authenticateUser, getServiceById);

// Protected route to create a service request
router.post("/service-request", authenticateUser, createServiceRequest);

//route to check requests already exists
router.get("/check/:id", authenticateUser, checkServiceRequest);

export default router;