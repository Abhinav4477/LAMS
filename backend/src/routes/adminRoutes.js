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
import {addLocation}  from "../controllers/adminController.js";
import {getAllLocations} from "../controllers/adminController.js";
import { deleteLocation } from "../controllers/adminController.js";
import { updateLocation } from "../controllers/adminController.js";
import { getLocationById } from "../controllers/adminController.js";
import { getLocationsByDistrict } from "../controllers/adminController.js";
import { addCategory } from "../controllers/adminController.js";
import { getCategories } from "../controllers/adminController.js";
import { deleteCategory } from "../controllers/adminController.js";
import { updateCategory } from "../controllers/adminController.js";
import { getCategoryById } from "../controllers/adminController.js";

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
//Route to add a location
router.post("/addlocation", addLocation);
//Route to get all locations
router.get("/getlocations", getAllLocations);
//Route to delete a location by ID
router.delete("/deletelocation/:id", deleteLocation);
//Route to update a location
router.put("/updatelocation/:id", updateLocation);
//Route to get a specific location
router.get("/getlocation/:id", getLocationById);
//Route to get locations by state and district
router.get("/getlocationbydistrict/:districtId", getLocationsByDistrict);
//Route to add a category
router.post("/addcategory", addCategory);
//Route to get all categories
router.get("/getcategories", getCategories);
//Route to delete a category by ID
router.delete("/deletecategory/:id", deleteCategory);
//Route to update a category
router.put("/updatecategory/:id", updateCategory);
//Route to get a specific category
router.get("/getcategory/:id", getCategoryById);
export default router;