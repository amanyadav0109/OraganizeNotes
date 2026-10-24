import express from "express";
import {
    createNote,
    getMyNotes,
    getPinnedNotes,
    getNotesBySubject,
    getSingleNote,
    updateNote,
    deleteNote,
    pinNote,searchNotes,completeTask,getNotePdf
} from "../controllers/noteController.js";
import upload from "../middleware/uploadMiddleware.js";
import { isAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", isAuth, upload.single("pdf"), createNote);
router.get("/all", isAuth, getMyNotes);
router.get("/pinned", isAuth, getPinnedNotes);
router.get("/subject/:subjectId", isAuth, getNotesBySubject);
router.get("/search", isAuth, searchNotes);
router.get("/:id", isAuth, getSingleNote);

router.put(
    "/:id",
    isAuth,
    upload.single("pdf"),
    updateNote
);
router.get("/pdf/:id", isAuth, getNotePdf);
router.delete("/delete/:id", isAuth, deleteNote);
router.put("/pin/:id", isAuth, pinNote);
router.put("/complete/:id", isAuth, completeTask);

export default router;