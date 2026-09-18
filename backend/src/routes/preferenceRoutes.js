import express from "express";
import {saveProfession,saveTopics,saveNotifications} from "../controllers/preferenceController.js";

const router = express.Router();

router.post("/profession", saveProfession);
router.post("/topics", saveTopics);
router.post("/notifications", saveNotifications);

export default router;