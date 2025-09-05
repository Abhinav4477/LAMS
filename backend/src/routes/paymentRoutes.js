import express from "express";
import { makePayment, getPaymentHistory,getProviderTransactionHistory,getProviderReport } from "../controllers/paymentController.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

router.post("/pay/:reqId", authenticateUser, makePayment);
router.get("/history", authenticateUser, getPaymentHistory);
router.get("/provider/history", authenticateUser,getProviderTransactionHistory);
router.get("/provider/report",authenticateUser,getProviderReport);


export default router;
