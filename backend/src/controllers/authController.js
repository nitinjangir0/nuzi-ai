import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import { sendOtpMail } from "../utils/sendOtpMail.js";

const createToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );
};

const generateOtp = () => {
    return Math.floor(
        100000 + Math.random() * 900000
    ).toString();
};

export const startAuth = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const normalizedEmail = email
            .toLowerCase()
            .trim();

        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (!existingUser) {
            const hashedPassword = await bcrypt.hash(
                password,
                10
            );

            const otp = generateOtp();

            const otpExpire = new Date(
                Date.now() + 3 * 60 * 1000
            );

            const user = await User.create({
                email: normalizedEmail,
                password: hashedPassword,
                otp,
                otpExpire,
                isVerified: false,
            });

            const emailSent = await sendOtpMail(
                user.email,
                otp
            );

            if (!emailSent) {
                await User.findByIdAndDelete(
                    user._id
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Unable to send OTP email. Please try again.",
                });
            }

            return res.status(201).json({
                success: true,
                isNewUser: true,
                requiresOtp: true,
                message: "OTP sent to your email",
                userId: user._id,
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        if (!existingUser.isVerified) {
            const otp = generateOtp();

            const otpExpire = new Date(
                Date.now() + 3 * 60 * 1000
            );

            existingUser.otp = otp;
            existingUser.otpExpire = otpExpire;

            await existingUser.save();

            const emailSent = await sendOtpMail(
                existingUser.email,
                otp
            );

            if (!emailSent) {
                return res.status(500).json({
                    success: false,
                    message:
                        "Unable to send OTP email. Please try again.",
                });
            }

            return res.status(200).json({
                success: true,
                isNewUser: false,
                requiresOtp: true,
                message:
                    "Please verify your email with OTP",
                userId: existingUser._id,
            });
        }

        const token = createToken(
            existingUser._id
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure:
                process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge:
                7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            isNewUser: false,
            requiresOtp: false,
            message: "Login successful",
            user: {
                id: existingUser._id,
                email: existingUser.email,
                name: existingUser.name,
            },
        });
    } catch (error) {
        console.error("Start auth error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { userId, otp } = req.body;

        if (!userId || !otp) {
            return res.status(400).json({
                success: false,
                message:
                    "User ID and OTP are required",
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.otp !== otp.toString()) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        if (
            !user.otpExpire ||
            user.otpExpire < new Date()
        ) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired",
            });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpire = undefined;

        await user.save();

        const token = createToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure:
                process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge:
                7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message:
                "Email verified successfully",
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (error) {
        console.error("Verify OTP error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("token");

        return res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        console.error("Logout error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};