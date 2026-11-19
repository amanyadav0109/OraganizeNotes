import { isAuth } from "../middleware/authMiddleware.js";
import express from "express";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  getTopics,
  createTopic,
  updateTopic,
  deleteTopic,
  getTestSets,
  createTestSet,
  updateTestSet,
  deleteTestSet,
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,recordMockTestAttempt 
} from "../controllers/mockTestController.js";

const router = express.Router();

// Categories
router.get("/categories", getCategories);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// Subjects
router.get("/subjects", getSubjects);
router.post("/subjects", createSubject);
router.put("/subjects/:id", updateSubject);
router.delete("/subjects/:id", deleteSubject);

// Topics
router.get("/topics", getTopics);
router.post("/topics", createTopic);
router.put("/topics/:id", updateTopic);
router.delete("/topics/:id", deleteTopic);

// Test sets
router.get("/test-sets", getTestSets);
router.post("/test-sets", createTestSet);
router.put("/test-sets/:id", updateTestSet);
router.delete("/test-sets/:id", deleteTestSet);

// Questions
router.get("/questions", getQuestions);
router.post("/questions", createQuestion);
router.put("/questions/:id", updateQuestion);
router.delete("/questions/:id", deleteQuestion);
// Mock Test Attempts (Student)
router.post("/attempts", isAuth, recordMockTestAttempt);
export default router;