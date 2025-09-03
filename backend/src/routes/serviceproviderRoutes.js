import express from "express";
import { 
  createService, 
  getServicesByProvider, 
  deleteService, 
  getServiceById, 
  updateServiceById, 
  getServiceProviderProfile, 
  updateServiceProviderProfile 
} from "../controllers/serviceproviderController.js";
import { authenticateUser } from "../middleware/auth.js";
import upload from "../middleware/upload.js"; // Multer upload utility

const router = express.Router();

// Create service route with cover image upload
router.post("/service", authenticateUser, upload.single("coverImage"), createService);

// Get all services by the authenticated provider
router.get("/services", authenticateUser, getServicesByProvider);

// Delete service by ID
router.delete("/service/:id", authenticateUser, deleteService);

// Get service by ID
router.get("/service/:id", authenticateUser, getServiceById);

// Update service by ID (you can also add upload.single if updating cover image)
router.put("/service/:id", authenticateUser, upload.single("coverImage"), updateServiceById);

// Get service provider profile
router.get("/account/me", authenticateUser, getServiceProviderProfile);

// Update service provider profile
router.put("/account/me", authenticateUser, updateServiceProviderProfile);

export default router;
