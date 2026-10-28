
import express from "express";

import {
    createSubscriptionOrder,
    verifySubscriptionPayment
} from "../controllers/subscriptionController.js";

import { isAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-order", isAuth, createSubscriptionOrder);

router.post("/verify", isAuth, verifySubscriptionPayment);

export default router;
