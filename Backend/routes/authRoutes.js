import express from "express";
import {
    register,
    login,
    currentUser,
    logout, googleLogin
} from "../controllers/authController.js";

import { isAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/current-user", isAuth, currentUser);

router.post("/logout", logout);
router.post("/google", googleLogin);
export default router;