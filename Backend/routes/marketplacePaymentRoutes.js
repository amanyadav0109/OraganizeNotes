import express from "express";

import {
    createMarketplaceOrder,
    verifyMarketplacePayment
} from "../controllers/marketplacePaymentController.js";

import { isAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
    "/create-order",
    isAuth,
    createMarketplaceOrder
);

router.post(
    "/verify",
    isAuth,
    verifyMarketplacePayment
);

export default router;