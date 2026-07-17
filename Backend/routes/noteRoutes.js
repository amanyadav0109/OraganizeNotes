import express from "express";
import {
    createNote,
    getMyNotes,
    getPinnedNotes,
    getNotesBySubject,
    getSingleNote,
    updateNote,
    deleteNote,
    pinNote,searchNotes,completeTask
} from "../controllers/noteController.js";

import { isAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", isAuth, createNote);
router.get("/all", isAuth, getMyNotes);
router.get("/pinned", isAuth, getPinnedNotes);
router.get("/subject/:subjectId", isAuth, getNotesBySubject);
router.get("/search", isAuth, searchNotes);
router.get("/:id", isAuth, getSingleNote);

router.put("/update/:id", isAuth, updateNote);

router.delete("/delete/:id", isAuth, deleteNote);
router.put("/pin/:id", isAuth, pinNote);
router.put("/complete/:id", isAuth, completeTask);

export default router;