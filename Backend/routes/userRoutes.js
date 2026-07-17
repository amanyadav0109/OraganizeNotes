import express from "express";
import { isAuth } from "../middleware/authMiddleware.js";
import {
    getProfile,
    updateName,
    
    getPublicProfile
} from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", isAuth, getProfile);

router.put("/name", isAuth, updateName);



router.get("/public/:id", getPublicProfile);

export default router;