import express from "express";
import { 
  createService, 
  getServicesByProvider, 
  deleteService, 
  getServiceById, 
  updateServiceById, 
  getServiceProviderProfile, 
  updateServiceProviderProfile ,
  getServiceProviderRequests,
  updateRequestStatus,
  getAcceptedRequests,
  updateRequestStatus1,
  getProviderRequests,
  updateAvailability
} from "../controllers/serviceproviderController.js";
import upload from "../middleware/upload.js"; // Multer upload utility

const router = express.Router();

// Create service route with cover image upload
router.post("/service",  upload.single("coverImage"), createService);

// Get all services by the authenticated provider
router.get("/services",  getServicesByProvider);

// Delete service by ID
router.delete("/service/:id",  deleteService);

// Get service by ID
router.get("/service/:id",  getServiceById);

// Update service by ID (you can also add upload.single if updating cover image)
router.put("/service/:id",  upload.single("coverImage"), updateServiceById);

// Get service provider profile
router.get("/account/me", getServiceProviderProfile);

// Update service provider profile
router.put("/account/me",  updateServiceProviderProfile);

//Route to get all the requests of the service provider

router.get("/requests",getServiceProviderRequests);

// ✅ Update request status (Accept or Reject)
router.put("/requests/:id", updateRequestStatus);

//Function to get acceptedd Requests
router.get("/requests/accepted",  getAcceptedRequests);

// Update request status (Accepted / Working / Completed / Rejected)
router.put("/request/:id", updateRequestStatus1);

router.get("/requests/all",  getProviderRequests);


//Route to update avilability
router.put("/availability",  updateAvailability);


export default router;
