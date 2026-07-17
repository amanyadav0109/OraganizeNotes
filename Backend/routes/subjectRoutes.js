import express from "express";

import {
    createSubject,
    getAllSubjects,
    updateSubject,
    deleteSubject,searchSubjects
} from "../controllers/subjectController.js";

import { isAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", isAuth, createSubject);

router.get("/all", isAuth, getAllSubjects);
router.get("/search", isAuth, searchSubjects);
router.put("/update/:id", isAuth, updateSubject);

router.delete("/delete/:id", isAuth, deleteSubject);

export default router;