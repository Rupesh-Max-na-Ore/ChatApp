import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
// Middleware to parse JSON requests, like signup requests
app.use(express.json());
// allow to parse cookies from incoming requests
app.use(cookieParser());

// authentication routes
app.use("/api/auth", authRoutes);
// message route
app.use("/api/message", messageRoutes);

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
    connectDB();
});