import express from "express";
import { makePayment, getPaymentHistory } from "../controllers/paymentController.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

router.post("/pay/:reqId", authenticateUser, makePayment);
router.get("/history", authenticateUser, getPaymentHistory);

export default router;
