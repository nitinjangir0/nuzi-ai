import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import preferenceRoutes from "./routes/preferenceRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
dotenv.config();
const app = express();
connectDB();
app.use( cors({ origin: "http://localhost:3000", credentials: true,}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/preferences", preferenceRoutes);
app.use("/api/news", newsRoutes);

app.get("/", (req, res) => {res.json({success: true,message: "Nuzi AI Backend is running 🚀",});});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});