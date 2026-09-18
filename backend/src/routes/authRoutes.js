import express from "express";
import {startAuth,verifyOtp,logout,} from "../controllers/authController.js";

const router = express.Router();
router.post("/start", startAuth);
router.post("/verify-otp", verifyOtp);
router.post("/logout", logout);

export default router;