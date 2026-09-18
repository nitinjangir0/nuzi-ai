import News from "../models/News.js";
import User from "../models/User.js";

export const getPersonalizedNews = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase().trim(),
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const userTopics = user.topics || [];
        const userProfessions = user.profession || [];

        const matchingNews = await News.find({
            $or: [
                { topics: { $in: userTopics } },
                { topics: { $in: userProfessions } },
            ],
        })
            .sort({ publishedAt: -1 })
            .limit(10);

        const news = matchingNews.length
            ? matchingNews
            : await News.find()
                .sort({ publishedAt: -1 })
                .limit(10);

        return res.status(200).json({
            success: true,
            count: news.length,
            news,
        });
    } catch (error) {
        console.error("Get personalized news error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};