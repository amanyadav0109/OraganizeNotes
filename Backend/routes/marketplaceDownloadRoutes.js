import express from "express";

import {
    downloadMarketplaceNote
} from "../controllers/marketplaceDownloadController.js";

import { isAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
    "/:noteId",
    isAuth,
    downloadMarketplaceNote
);

export default router;