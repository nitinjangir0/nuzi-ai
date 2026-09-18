import dotenv from "dotenv";
import connectDB from "./config/db.js";
import News from "./models/News.js";

dotenv.config();

const news = [
    {
        title: "AI adoption is reshaping the technology industry",
        category: "AI & Tech",
        source: "THE VERGE",
        preview:
            "The latest developments in artificial intelligence and how businesses are adapting to rapid AI adoption.",
        duration: "3 MIN",
        topics: ["AI & Technology", "Technology"],
        url: "https://www.theverge.com/",
    },
    {
        title: "Global markets react to major economic developments",
        category: "Markets",
        source: "REUTERS",
        preview:
            "Key financial market movements and economic developments investors are watching today.",
        duration: "4 MIN",
        topics: ["Financial Markets", "Indian Business"],
        url: "https://www.reuters.com/",
    },
    {
        title: "Indian startups explore new opportunities for growth",
        category: "Startups",
        source: "TECHCRUNCH",
        preview:
            "New developments across India's startup ecosystem, funding activity and emerging businesses.",
        duration: "3 MIN",
        topics: ["Startups", "Indian Business", "Technology"],
        url: "https://techcrunch.com/",
    },
    {
        title: "New research highlights important scientific developments",
        category: "Science",
        source: "NATURE",
        preview:
            "Researchers are making progress across several areas of science and technology.",
        duration: "5 MIN",
        topics: ["Science", "AI & Technology"],
        url: "https://www.nature.com/",
    },
    {
        title: "Technology companies invest in the next generation of AI",
        category: "AI & Tech",
        source: "WIRED",
        preview:
            "Technology companies continue to invest in artificial intelligence and new computing capabilities.",
        duration: "3 MIN",
        topics: ["AI & Technology", "Startups", "Technology"],
        url: "https://www.wired.com/",
    },
    {
        title: "Business leaders discuss India's changing economy",
        category: "Markets",
        source: "CNBC",
        preview:
            "Business and economic trends shaping India's rapidly changing market environment.",
        duration: "4 MIN",
        topics: ["Indian Business", "Financial Markets"],
        url: "https://www.cnbc.com/",
    },
];

const seedNews = async () => {
    try {
        await connectDB();

        await News.deleteMany();

        await News.insertMany(news);

        console.log(`${news.length} news articles inserted successfully`);

        process.exit(0);
    } catch (error) {
        console.error("News seed error:", error);
        process.exit(1);
    }
};

seedNews();