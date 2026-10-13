import db from "../config/db.js";

import * as mupdf from "mupdf";
import { bucket } from "../config/firebaseAdmin.js";
import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import sharp from "sharp";



// GET ALL MARKETPLACE NOTES
// GET ALL MARKETPLACE NOTES
export const getMarketplaceNotes = (req, res) => {
    const sql = `
        SELECT
            id,
            title,
            subject,
            unit,
            description,
            price,
            seller_id,
            seller_name,
            file_path,
            file_name,
            created_at
        FROM marketplace_notes
        ORDER BY created_at DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("GET MARKETPLACE NOTES ERROR:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch marketplace notes"
            });
        }

        return res.status(200).json({
            success: true,
            notes: results
        });
    });
};

// CREATE MARKETPLACE NOTE
export const createMarketplaceNote = (req, res) => {

    const sellerId = req.userId;

    const {
        title,
        subject,
        unit,
        description,
        price,
        filePath,
        fileName
    } = req.body;


    // ================= VALIDATION =================

    if (
        !title ||
        !subject ||
        !unit ||
        price === undefined ||
        !filePath ||
        !fileName
    ) {

        return res.status(400).json({
            success: false,
            message: "Required fields are missing"
        });

    }


    // ================= INSERT =================

    const sql = `
        INSERT INTO marketplace_notes
        (
            title,
            subject,
            unit,
            description,
            price,
            seller_id,
            seller_name,
            file_path,
            file_name
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;


    // Temporary seller name
    // We will make this come from users table
    // after checking your users table structure.

    const sellerName = "Student";


    const values = [
        title,
        subject,
        unit,
        description || "",
        Number(price),
        sellerId,
        sellerName,
        filePath,
        fileName
    ];


    db.query(
        sql,
        values,
        (err, result) => {

            if (err) {

                console.error(
                    "CREATE MARKETPLACE NOTE ERROR:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to create marketplace note"
                });

            }


            return res.status(201).json({

                success: true,

                message: "Note listed successfully",

                noteId: result.insertId

            });

        }
    );
};

export const uploadMarketplacePdf = async (req, res) => {
     console.log("REQ.FILE:", req.file);
    console.log("REQ.BODY:", req.body);
  try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "PDF file is required"
            });
        }

        const fileName = `${crypto.randomUUID()}.pdf`;

        const filePath = `marketplace_notes/${fileName}`;

        const file = bucket.file(filePath);

        await file.save(req.file.buffer, {
            metadata: {
                contentType: "application/pdf"
            }
        });

        return res.status(200).json({
            success: true,
            message: "PDF uploaded successfully",
            filePath: filePath,
            fileName: req.file.originalname
        });

    } catch (error) {
        console.error("PDF UPLOAD ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to upload PDF"
        });
    }
};
export const createMarketplaceOrder = (req, res) => {

  const userId = req.user.id;
  const { noteId } = req.body;

  if (!noteId) {
    return res.status(400).json({
      success: false,
      message: "Note ID is required",
    });
  }

  // IMPORTANT:
  // Price frontend se nahi lenge.
  // Database se actual price lenge.

  const sql = `
    SELECT id, title, price
    FROM marketplace_notes
    WHERE id = ?
  `;

  db.query(sql, [noteId], async (err, results) => {

    if (err) {
      console.error("GET NOTE ERROR:", err);

      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    const note = results[0];

    try {

      // ₹20 → 2000 paise
      const amount = Math.round(Number(note.price) * 100);

      const options = {
        amount,
        currency: "INR",

        receipt: `note_${note.id}_user_${userId}`,

        notes: {
          noteId: String(note.id),
          userId: String(userId),
        },
      };

      const order = await razorpay.orders.create(options);

      return res.status(200).json({
        success: true,

        order: {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
        },

        note: {
          id: note.id,
          title: note.title,
          price: note.price,
        },

        key: process.env.RAZORPAY_KEY_ID,
      });

    } catch (error) {

      console.error("RAZORPAY ORDER ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to create Razorpay order",
      });
    }
  });
};


// ==========================================
// VERIFY PAYMENT
// ==========================================

export const verifyMarketplacePayment = (req, res) => {

  const userId = req.user.id;

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    noteId,
  } = req.body;


  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !noteId
  ) {
    return res.status(400).json({
      success: false,
      message: "Payment details are missing",
    });
  }


  // ========================================
  // CREATE SIGNATURE
  // ========================================

  const body =
    razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET
    )
    .update(body)
    .digest("hex");


  // ========================================
  // VERIFY SIGNATURE
  // ========================================

  if (expectedSignature !== razorpay_signature) {

    return res.status(400).json({
      success: false,
      message: "Payment verification failed",
    });
  }


  // ========================================
  // GET ACTUAL NOTE PRICE
  // ========================================

  const noteSql = `
    SELECT id, price
    FROM marketplace_notes
    WHERE id = ?
  `;

  db.query(noteSql, [noteId], (err, results) => {

    if (err) {

      console.error("NOTE PRICE ERROR:", err);

      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }


    if (results.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }


    const amount = results[0].price;


    // ======================================
    // SAVE PURCHASE
    // ======================================

    const purchaseSql = `
      INSERT INTO marketplace_purchases
      (
        user_id,
        note_id,
        razorpay_order_id,
        razorpay_payment_id,
        amount,
        status
      )
      VALUES (?, ?, ?, ?, ?, 'paid')
    `;


    db.query(
      purchaseSql,
      [
        userId,
        noteId,
        razorpay_order_id,
        razorpay_payment_id,
        amount,
      ],
      (err) => {

        if (err) {

          // Duplicate purchase
          if (err.code === "ER_DUP_ENTRY") {

            return res.status(200).json({
              success: true,
              message: "Note already purchased",
            });
          }


          console.error(
            "SAVE PURCHASE ERROR:",
            err
          );

          return res.status(500).json({
            success: false,
            message: "Failed to save purchase",
          });
        }


        return res.status(200).json({
          success: true,
          message: "Payment successful",
          noteId,
        });
      }
    );
  });
};
// ==========================================
// PREVIEW MARKETPLACE PDF
// ==========================================

export const previewMarketplaceNote = async (req, res) => {
    try {
        const { id } = req.params;
        const pageNumber = Number(req.query.page || 0);

        if (pageNumber < 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid page number"
            });
        }

        const sql = `
            SELECT id, file_path, file_name
            FROM marketplace_notes
            WHERE id = ?
        `;

        db.query(sql, [id], async (err, results) => {

            if (err) {
                console.error("PREVIEW DB ERROR:", err);

                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Note not found"
                });
            }

            const note = results[0];

            if (!note.file_path) {
                return res.status(404).json({
                    success: false,
                    message: "PDF file not found"
                });
            }

            try {

                // Firebase se PDF download
                const file = bucket.file(note.file_path);

                const [pdfBuffer] =
                    await file.download();

                // MuPDF
                const document =
                    mupdf.Document.openDocument(
                        pdfBuffer,
                        "application/pdf"
                    );

                const pageCount =
                    document.countPages();

                // IMPORTANT
                res.setHeader(
                    "X-Page-Count",
                    String(pageCount)
                );

                res.setHeader(
                    "Access-Control-Expose-Headers",
                    "X-Page-Count"
                );

                if (pageNumber >= pageCount) {

                    document.destroy();

                    return res.status(404).json({
                        success: false,
                        message: "Page not found"
                    });
                }

                // Check purchase
                const purchaseSql = `
                    SELECT id
                    FROM marketplace_purchases
                    WHERE user_id = ?
                    AND note_id = ?
                    AND status = 'paid'
                    LIMIT 1
                `;

                const purchaseResults =
                    await new Promise(
                        (resolve, reject) => {

                            db.query(
                                purchaseSql,
                                [
                                    req.userId,
                                    id
                                ],
                                (err, results) => {

                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve(results);
                                    }

                                }
                            );

                        }
                    );

                const purchased =
                    purchaseResults.length > 0;

                // Page 2 onward locked before purchase
                if (
                    pageNumber > 0 &&
                    !purchased
                ) {

                    document.destroy();

                    return res.status(403).json({
                        success: false,
                        message:
                            "Purchase required to view this page"
                    });
                }

                // Render page
                const page =
                    document.loadPage(pageNumber);

                const pixmap =
                    page.toPixmap(
                        mupdf.Matrix.scale(2, 2),
                        mupdf.ColorSpace.DeviceRGB
                    );

                const pngBuffer =
                    pixmap.asPNG();

                pixmap.destroy();
                page.destroy();
                document.destroy();

                res.setHeader(
                    "Content-Type",
                    "image/png"
                );

                res.setHeader(
                    "Cache-Control",
                    "private, no-store, max-age=0"
                );

                return res.send(
                    Buffer.from(pngBuffer)
                );

            } catch (renderError) {

                console.error(
                    "PDF PREVIEW ERROR:",
                    renderError
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Failed to render PDF page"
                });
            }
        });

    } catch (error) {

        console.error(
            "PREVIEW ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Preview failed"
        });
    }
};
export const getMyMarketplaceNotes = (req, res) => {

    const sellerId = req.userId;

    const sql = `
        SELECT
            id,
            title,
            subject,
            unit,
            description,
            price,
            seller_id,
            seller_name,
            file_path,
            file_name,
            created_at,
            updated_at
        FROM marketplace_notes
        WHERE seller_id = ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [sellerId], (err, results) => {

        if (err) {
            console.error(
                "GET MY MARKETPLACE NOTES ERROR:",
                err
            );

            return res.status(500).json({
                success: false,
                message: "Failed to fetch your notes"
            });
        }

        return res.status(200).json({
            success: true,
            notes: results
        });
    });
};
export const updateMarketplaceNote = (req, res) => {

    const sellerId = req.userId;
    const { id } = req.params;

    const {
        title,
        subject,
        unit,
        description,
        price
    } = req.body;

    if (
        !title ||
        !subject ||
        !unit ||
        price === undefined
    ) {
        return res.status(400).json({
            success: false,
            message: "Required fields are missing"
        });
    }

    const sql = `
        UPDATE marketplace_notes
        SET
            title = ?,
            subject = ?,
            unit = ?,
            description = ?,
            price = ?
        WHERE
            id = ?
            AND seller_id = ?
    `;

    const values = [
        title,
        subject,
        unit,
        description || "",
        Number(price),
        id,
        sellerId
    ];

    db.query(sql, values, (err, result) => {

        if (err) {
            console.error(
                "UPDATE MARKETPLACE NOTE ERROR:",
                err
            );

            return res.status(500).json({
                success: false,
                message: "Failed to update note"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Note not found or you are not the owner"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Note updated successfully"
        });
    });
};
export const deleteMarketplaceNote = async (req, res) => {

    const sellerId = req.userId;
    const { id } = req.params;

    try {

        const sql = `
            SELECT
                id,
                file_path
            FROM marketplace_notes
            WHERE id = ?
            AND seller_id = ?
        `;

        db.query(
            sql,
            [id, sellerId],
            async (err, results) => {

                if (err) {
                    console.error(
                        "FIND NOTE FOR DELETE ERROR:",
                        err
                    );

                    return res.status(500).json({
                        success: false,
                        message: "Database error"
                    });
                }

                if (results.length === 0) {
                    return res.status(404).json({
                        success: false,
                        message:
                            "Note not found or you are not the owner"
                    });
                }

                const note = results[0];

                try {

                    // Delete PDF from Firebase
                    if (note.file_path) {

                        const file = bucket.file(
                            note.file_path
                        );

                        const [exists] =
                            await file.exists();

                        if (exists) {
                            await file.delete();
                        }
                    }

                    // Delete database record
                    const deleteSql = `
                        DELETE FROM marketplace_notes
                        WHERE id = ?
                        AND seller_id = ?
                    `;

                    db.query(
                        deleteSql,
                        [id, sellerId],
                        (deleteErr) => {

                            if (deleteErr) {
                                console.error(
                                    "DELETE NOTE ERROR:",
                                    deleteErr
                                );

                                return res.status(500).json({
                                    success: false,
                                    message:
                                        "Failed to delete note"
                                });
                            }

                            return res.status(200).json({
                                success: true,
                                message:
                                    "Note deleted successfully"
                            });
                        }
                    );

                } catch (firebaseError) {

                    console.error(
                        "FIREBASE DELETE ERROR:",
                        firebaseError
                    );

                    return res.status(500).json({
                        success: false,
                        message:
                            "Failed to delete PDF"
                    });
                }
            }
        );

    } catch (error) {

        console.error(
            "DELETE MARKETPLACE NOTE ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to delete note"
        });
    }
};