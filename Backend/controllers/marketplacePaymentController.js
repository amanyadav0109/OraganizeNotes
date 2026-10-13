import crypto from "crypto";
import dotenv from "dotenv";
import razorpay from "../config/razorpay.js";
import db from "../config/db.js";

dotenv.config();

export const createMarketplaceOrder = (req, res) => {
    const userId = req.userId;
    const { noteId } = req.body;

    if (!noteId) {
        return res.status(400).json({
            success: false,
            message: "Note ID is required"
        });
    }

    const sql = `
        SELECT id, title, price
        FROM marketplace_notes
        WHERE id = ?
    `;

    db.query(sql, [noteId], async (err, results) => {

        if (err) {
            console.error("CREATE ORDER DB ERROR:", err);

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

        try {

            const amount = Math.round(Number(note.price) * 100);

            const order = await razorpay.orders.create({
                amount: amount,
                currency: "INR",
                receipt: `note_${note.id}_user_${userId}`,
                notes: {
                    noteId: String(note.id),
                    userId: String(userId)
                }
            });

            return res.status(200).json({
                success: true,
                order: {
                    id: order.id,
                    amount: order.amount,
                    currency: order.currency
                },
                note: {
                    id: note.id,
                    title: note.title,
                    price: note.price
                },
                key: process.env.RAZORPAY_KEY_ID
            });

        } catch (error) {

            console.error("RAZORPAY ORDER ERROR:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to create Razorpay order"
            });
        }
    });
};


export const verifyMarketplacePayment = (req, res) => {

    const userId = req.userId;

    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        noteId
    } = req.body;

    if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature ||
        !noteId
    ) {
        return res.status(400).json({
            success: false,
            message: "Payment details are missing"
        });
    }

    const body =
        razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac(
            "sha256",
            process.env.RAZORPAY_KEY_SECRET
        )
        .update(body)
        .digest("hex");

    if (expectedSignature !== razorpay_signature) {

        return res.status(400).json({
            success: false,
            message: "Invalid payment signature"
        });
    }

    const sql = `
        SELECT id, price
        FROM marketplace_notes
        WHERE id = ?
    `;

    db.query(sql, [noteId], (err, results) => {

        if (err) {
            console.error("VERIFY PAYMENT DB ERROR:", err);

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

        const amount = results[0].price;

        const insertSql = `
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

        const values = [
            userId,
            noteId,
            razorpay_order_id,
            razorpay_payment_id,
            amount
        ];

        db.query(insertSql, values, (err) => {

            if (err) {

                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(200).json({
                        success: true,
                        message: "Note already purchased"
                    });
                }

                console.error("SAVE PURCHASE ERROR:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to save purchase"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Payment successful",
                noteId: noteId
            });
        });
    });
};