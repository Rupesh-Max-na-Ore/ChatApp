import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

import path from "path";

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();
// Middleware to parse JSON requests, like signup requests
// app.use(express.json());
// app.use(express.json({ limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// allow to parse cookies from incoming requests
app.use(cookieParser());

// enable CORS for all origins (you can restrict it in production)
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
// app.use(cors());

// authentication routes
app.use("/api/auth", authRoutes);
// message route
app.use("/api/messages", messageRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
    connectDB();
});