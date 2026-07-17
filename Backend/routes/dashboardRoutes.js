import express from "express";

import { getDashboardStats } from "../controllers/dashboardController.js";

import { isAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", isAuth, getDashboardStats);

export default router;