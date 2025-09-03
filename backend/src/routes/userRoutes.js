import mongoose from "mongoose";
import express from "express";
import { getAllServices } from "../controllers/userController.js";
import { getServiceById } from "../controllers/userController.js";

const router = express.Router();

// Public route to get all services with filtering and sorting
router.get("/services", getAllServices);

// Public route to get a single service by ID
router.get("/service/:id", getServiceById);

export default router;