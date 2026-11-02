import express from "express";
import { isAuth } from "../middleware/authMiddleware.js";

import {
  getPracticeSubjects,
  getPracticeTopics,
  getPracticeQuestions,
  getPracticeQuestionById,
  submitPracticeAnswer,
  getPracticeCounts,
} from "../controllers/practiceController.js";

const router = express.Router();

router.use(isAuth);

router.get("/subjects", getPracticeSubjects);
router.get("/topics/:subjectId", getPracticeTopics);
router.get("/questions", getPracticeQuestions);
router.get("/questions/:id", getPracticeQuestionById);
router.post("/submit", submitPracticeAnswer);
router.get("/count", getPracticeCounts);

export default router;