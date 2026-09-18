import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },

        source: {
            type: String,
            required: true,
            trim: true,
        },

        preview: {
            type: String,
            trim: true,
        },

        url: {
            type: String,
            trim: true,
        },

        duration: {
            type: String,
            default: "3 MIN",
        },

        topics: {
            type: [String],
            default: [],
        },

        publishedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const News = mongoose.model("News", newsSchema);

export default News;