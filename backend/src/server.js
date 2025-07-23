import express from "express"
import loginRoutes from "./routes/authenticationRoutes.js"
import connectDB from "./confg/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

//created the app object
const app=express();

//setting the port to connect
const PORT=process.env.PORT || 5001;



//connecting to the database
connectDB();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use(cors({credentials:true}))

//redirecting the requests to the corresponding Routes
app.use("/api/auth",loginRoutes);


app.listen(5001,()=>{
    console.log("Server Started at PORT "+PORT);
})

