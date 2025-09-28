import express from "express";
import { makePayment, getPaymentHistory,getProviderTransactionHistory,getProviderReport } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/pay/:reqId",  makePayment);
router.get("/history",  getPaymentHistory);
router.get("/provider/history", getProviderTransactionHistory);
router.get("/provider/report",getProviderReport);


export default router;
