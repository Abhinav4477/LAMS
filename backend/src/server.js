import express from "express";
import loginRoutes from "./routes/authenticationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import serviceproviderRoutes from "./routes/serviceproviderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import connectDB from "./confg/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors({
  credentials: true,
  origin: "http://localhost:5173"
}));
app.use(express.json());
app.use(cookieParser());

// Serve uploaded images
app.use("/upload", express.static(path.join(path.resolve(), "upload")));

// Routes
app.use("/api/auth", loginRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/provider", serviceproviderRoutes);
app.use("/api/user", userRoutes);

// Connect DB and start server
connectDB().then(() => {
  console.log("Connected to the Database");
  app.listen(PORT, () => {
    console.log("Server Started at PORT " + PORT);
  });
}).catch((err) => {
  console.log("Error connecting to the Database", err);
});
