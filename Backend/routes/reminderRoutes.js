import express from "express";
import { getUpcomingReminders } from "../controllers/reminderController.js";
import { isAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", isAuth , getUpcomingReminders);

export default router;