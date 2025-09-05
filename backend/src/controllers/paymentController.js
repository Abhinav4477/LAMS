import Payment from "../models/Payment.js";
import ServiceRequest from "../models/ServiceRequest.js";
import User from "../models/Users.js"; // import User model
import { v4 as uuidv4 } from "uuid";

// Make payment and generate receipt
export const makePayment = async (req, res) => {
  try {
    const requestId = req.params.reqId;

    const serviceRequest = await ServiceRequest.findById(requestId)
      .populate("serviceId")       // populate service info
      .populate("userId", "username email"); // populate customer info

    if (!serviceRequest)
      return res.status(404).json({ message: "Request not found" });

    // Fetch provider as User directly
    const providerUser = await User.findById(serviceRequest.providerId);

    const payment = await Payment.create({
      requestId,
      userId: serviceRequest.userId._id,
      providerId: providerUser?._id || null,
      serviceId: serviceRequest.serviceId._id,
      amount: serviceRequest.serviceId.price,
      transactionId: uuidv4(),
      receiptId: uuidv4(),
      status: "Paid",
    });

    // Update request status
    serviceRequest.status = "Completed";
    await serviceRequest.save();

    res.status(200).json({
      message: "Payment successful",
      receipt: {
        receiptId: payment.receiptId,
        user: serviceRequest.userId.username,
        service: serviceRequest.serviceId.name,
        provider: providerUser?.username || "N/A", // provider name fixed
        amount: payment.amount,
        transactionId: payment.transactionId,
        date: payment.paymentDate,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment failed" });
  }
};

// Get payment history

export const getPaymentHistory = async (req, res) => {
  try {
    // Fetch payments for this user
    const payments = await Payment.find({ userId: req.user.id })
      .populate("serviceId", "name")       // service name
      .populate("providerId", "username")  // provider name directly from User
      .sort({ paymentDate: -1 });

    const history = payments.map((p) => ({
      _id: p._id,
      receiptId: p.receiptId,
      transactionId: p.transactionId,
      service: p.serviceId?.name || "N/A",
      provider: p.providerId?.username || "N/A", // provider name works now
      amount: p.amount,
      status: p.status,
      date: p.paymentDate ? new Date(p.paymentDate).toLocaleString() : "N/A",
    }));

    res.status(200).json(history);
  } catch (err) {
    console.error("Error fetching payment history:", err);
    res.status(500).json({ message: "Failed to fetch payment history" });
  }
};
