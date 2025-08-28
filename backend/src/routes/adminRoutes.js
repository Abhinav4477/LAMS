import express from "express";
import { addState } from "../controllers/adminController.js";
import { getStates } from "../controllers/adminController.js";
import { deleteState } from "../controllers/adminController.js";
import { updateState } from "../controllers/adminController.js";
import { getStateById } from "../controllers/adminController.js";
import { addDistrict } from "../controllers/adminController.js";
import { getDistricts } from "../controllers/adminController.js";
import { getDistrictsByState } from "../controllers/adminController.js";
import { deleteDistrict } from "../controllers/adminController.js";
import { updateDistrict } from "../controllers/adminController.js";
import { getDistrictById } from "../controllers/adminController.js";

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
//Route to add a district
router.post("/adddistrict", addDistrict);
//Route to get all districts
router.get("/getdistricts", getDistricts);
//Route to get districts by state ID
router.get("/getdistricts/:stateId", getDistrictsByState);
//Route to delete a district by ID
router.delete("/deletedistrict/:id", deleteDistrict);
//Route to update a district
router.put("/updatedistrict/:id", updateDistrict);
//Route to get a specific district
router.get("/getdistrict/:id", getDistrictById);


export default router;