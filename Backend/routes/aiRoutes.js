import express from "express";

import { generateAI } from "../controllers/aiController.js";

import { isAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate",isAuth,generateAI);

export default router;