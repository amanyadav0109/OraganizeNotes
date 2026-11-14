
import express from "express";

import {
  adminLogin,
  getAdminDashboard,
  getAdminUsers,
  getAdminNotes,
  deleteAdminNote,
  getAdminMarketplace,
  createSellerPayout,
  getAdminSubscriptions,
  getAdminAIUsage,
} from "../controllers/adminController.js";

import {
  getAdminPracticeSubjects,
  createPracticeSubject,
  updatePracticeSubject,
  deletePracticeSubject,

  getAdminPracticeTopics,
  createPracticeTopic,
  updatePracticeTopic,
  deletePracticeTopic,

  getAdminPracticeQuestions,
  createPracticeQuestion,
  updatePracticeQuestion,
  deletePracticeQuestion,
} from "../controllers/adminPracticeController.js";

import { adminAuth } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();



router.post("/login", adminLogin);



router.get("/verify", adminAuth, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin authenticated successfully",
    adminId: req.adminId,
  });
});


router.get("/dashboard", adminAuth, getAdminDashboard);


router.get("/users", adminAuth, getAdminUsers);

router.get("/subscriptions", adminAuth, getAdminSubscriptions);


router.get("/ai-usage", adminAuth, getAdminAIUsage);


router.get("/notes", adminAuth, getAdminNotes);
router.delete("/notes/:id", adminAuth, deleteAdminNote);

router.get("/marketplace", adminAuth, getAdminMarketplace);
router.post("/marketplace/payouts", adminAuth, createSellerPayout);

router.get(
  "/practice/subjects",
  adminAuth,
  getAdminPracticeSubjects
);

router.post(
  "/practice/subjects",
  adminAuth,
  createPracticeSubject
);

router.put(
  "/practice/subjects/:id",
  adminAuth,
  updatePracticeSubject
);

router.delete(
  "/practice/subjects/:id",
  adminAuth,
  deletePracticeSubject
);


router.get(
  "/practice/topics",
  adminAuth,
  getAdminPracticeTopics
);

router.post(
  "/practice/topics",
  adminAuth,
  createPracticeTopic
);

router.put(
  "/practice/topics/:id",
  adminAuth,
  updatePracticeTopic
);

router.delete(
  "/practice/topics/:id",
  adminAuth,
  deletePracticeTopic
);



router.get(
  "/practice/questions",
  adminAuth,
  getAdminPracticeQuestions
);

router.post(
  "/practice/questions",
  adminAuth,
  createPracticeQuestion
);

router.put(
  "/practice/questions/:id",
  adminAuth,
  updatePracticeQuestion
);

router.delete(
  "/practice/questions/:id",
  adminAuth,
  deletePracticeQuestion
);

export default router;
