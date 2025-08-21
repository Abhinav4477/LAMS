import express from "express";
import { addState } from "../controllers/adminController.js";

const router = express.Router();
// Route to add a new state
router.post("/addstate", addState);

export default router;