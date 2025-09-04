import express from "express";
import { addReview, getReviewsByService } from "../controllers/reviewController.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticateUser, addReview); // must require auth
router.get("/:serviceId", getReviewsByService); // public

export default router;
