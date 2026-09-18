import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        language: {
            type: String,
            enum: ["english", "hindi"],
            default: "english",
        },

        locationEnabled: {
            type: Boolean,
            default: false,
        },

        profession: {
            type: [String],
            default: [],
        },

        topics: {
            type: [String],
            default: [],
        },

        notifications: {
            type: Boolean,
            default: false,
        },

        motivation: {
            type: String,
            trim: true,
        },

        trustedVoice: {
            type: String,
            trim: true,
        },

        listeningDuration: {
            type: String,
            trim: true,
        },

        otp: {
            type: String,
        },

        otpExpire: {
            type: Date,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;