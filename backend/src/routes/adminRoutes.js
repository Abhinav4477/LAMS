import express from "express";
import { addState } from "../controllers/adminController.js";
import { getStates } from "../controllers/adminController.js";

const router = express.Router();
// Route to add a new state
router.post("/addstate", addState);
// Route to get all states
router.get("/getstates", getStates);

export default router;