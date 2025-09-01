import express from "express"

import { createService } from "../controllers/serviceproviderController.js"
import { getServicesByProvider } from "../controllers/serviceproviderController.js";
import { deleteService } from "../controllers/serviceproviderController.js";
import { getServiceById } from "../controllers/serviceproviderController.js";
import { updateServiceById } from "../controllers/serviceproviderController.js";
import { authenticateUser } from "../middleware/auth.js"
const router = express.Router();

// Create service route
router.post("/service",authenticateUser,createService);
// Get services by provider route
router.get("/services",authenticateUser,getServicesByProvider);
// Delete service route
router.delete("/service/:id",authenticateUser,deleteService);
// Get service by ID route
router.get("/service/:id",authenticateUser,getServiceById);
// Update service by ID route
router.put("/service/:id",authenticateUser,updateServiceById);
export default router;