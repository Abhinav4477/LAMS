import express from "express";
import { addState } from "../controllers/adminController.js";
import { getStates } from "../controllers/adminController.js";
import { deleteState } from "../controllers/adminController.js";
import { updateState } from "../controllers/adminController.js";
import { getStateById } from "../controllers/adminController.js";

const router = express.Router();
// Route to add a new state
router.post("/addstate", addState);
// Route to get all states
router.get("/getstates", getStates);
// Route to delete a state by ID
router.delete("/deletestate/:id", deleteState);
// Route to update a state
router.put("/updatestate/:id", updateState);
//Router get a specific state
router.get("/getstate/:id", getStateById);


export default router;