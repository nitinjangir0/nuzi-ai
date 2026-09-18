import express from "express";

import {getPersonalizedNews,} from "../controllers/newsController.js";

const router = express.Router();
router.get("/personalized", getPersonalizedNews);

export default router;