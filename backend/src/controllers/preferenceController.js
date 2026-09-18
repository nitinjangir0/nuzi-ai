import User from "../models/User.js";

export const saveProfession = async (req, res) => {
    try {
        const { email, profession } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        if (!Array.isArray(profession) || profession.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one profession is required",
            });
        }

        if (profession.length > 6) {
            return res.status(400).json({
                success: false,
                message: "You can select up to 6 professions",
            });
        }

        const user = await User.findOneAndUpdate(
            {
                email: email.toLowerCase().trim(),
            },
            {
                profession,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profession saved successfully",
            profession: user.profession,
        });
    } catch (error) {
        console.error("Save profession error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

export const saveTopics = async (req, res) => {
    try {
        const { email, topics } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        if (!Array.isArray(topics) || topics.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one topic is required",
            });
        }

        if (topics.length > 7) {
            return res.status(400).json({
                success: false,
                message: "You can select up to 7 topics",
            });
        }

        const user = await User.findOneAndUpdate(
            {
                email: email.toLowerCase().trim(),
            },
            {
                topics,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Topics saved successfully",
            topics: user.topics,
        });
    } catch (error) {
        console.error("Save topics error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};


export const saveNotifications = async (req, res) => {
    try {
        const { email, notifications } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        if (typeof notifications !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "Notifications must be true or false",
            });
        }

        const user = await User.findOneAndUpdate(
            { email: email.toLowerCase().trim() },
            { notifications },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Notification preference saved successfully",
            notifications: user.notifications,
        });
    } catch (error) {
        console.error("Save notifications error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};