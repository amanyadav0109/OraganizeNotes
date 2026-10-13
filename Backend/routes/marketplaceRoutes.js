import express from "express";

import {
    getMarketplaceNotes,
    createMarketplaceNote,
    uploadMarketplacePdf,
    previewMarketplaceNote,
    getMyMarketplaceNotes,
    updateMarketplaceNote,
    deleteMarketplaceNote
} from "../controllers/marketplaceController.js";

import { isAuth } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import db from "../config/db.js";

const router = express.Router();


/* =====================================================
   UPLOAD PDF
===================================================== */

router.post(
    "/upload-pdf",
    isAuth,
    upload.single("pdf"),
    uploadMarketplacePdf
);


/* =====================================================
   CREATE MARKETPLACE NOTE
===================================================== */

router.post(
    "/",
    isAuth,
    createMarketplaceNote
);


/* =====================================================
   GET ALL MARKETPLACE NOTES
===================================================== */

router.get(
    "/",
    getMarketplaceNotes
);


/* =====================================================
   GET MY UPLOADED NOTES
===================================================== */

router.get(
    "/my-notes",
    isAuth,
    getMyMarketplaceNotes
);


/* =====================================================
   PDF PREVIEW
   IMPORTANT:
   NO isAuth HERE
===================================================== */

router.get(
    "/preview/:id",
    isAuth,
    previewMarketplaceNote
);


/* =====================================================
   PURCHASE STATUS
===================================================== */

router.get(
    "/purchase-status/:id",
    isAuth,
    async (req, res) => {

        try {

            const userId = req.userId;
            const noteId = req.params.id;

            const sql = `
                SELECT id
                FROM marketplace_purchases
                WHERE user_id = ?
                AND note_id = ?
                AND status = 'paid'
                LIMIT 1
            `;

            db.query(
                sql,
                [userId, noteId],
                (err, results) => {

                    if (err) {

                        console.error(
                            "PURCHASE STATUS ERROR:",
                            err
                        );

                        return res.status(500).json({
                            success: false,
                            purchased: false
                        });
                    }

                    return res.status(200).json({
                        success: true,
                        purchased:
                            results.length > 0
                    });
                }
            );

        } catch (error) {

            console.error(
                "PURCHASE STATUS ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                purchased: false
            });
        }
    }
);


/* =====================================================
   UPDATE NOTE
===================================================== */

router.put(
    "/:id",
    isAuth,
    updateMarketplaceNote
);


/* =====================================================
   DELETE NOTE
===================================================== */

router.delete(
    "/:id",
    isAuth,
    deleteMarketplaceNote
);


export default router;