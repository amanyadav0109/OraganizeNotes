
import crypto from "crypto";
import dotenv from "dotenv";
import razorpay from "../config/razorpay.js";
import db from "../config/db.js";

dotenv.config();

const PREMIUM_PRICE = 19900; // ₹199 in paise
const PLAN_DURATION_DAYS = 30;

export const createSubscriptionOrder = async (req, res) => {
    const userId = req.userId;

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "Please login first"
        });
    }

    try {
        const order = await razorpay.orders.create({
            amount: PREMIUM_PRICE,
            currency: "INR",
            receipt: `premium_${userId}_${Date.now()}`,
            notes: {
                userId: String(userId),
                plan: "premium"
            }
        });

        const sql = `
            INSERT INTO user_subscriptions
            (user_id, plan_name, razorpay_order_id, amount, status)
            VALUES (?, 'premium', ?, ?, 'created')
        `;

        db.query(
            sql,
            [userId, order.id, PREMIUM_PRICE / 100],
            (err) => {
                if (err) {
                    console.error("SAVE SUBSCRIPTION ORDER:", err);

                    return res.status(500).json({
                        success: false,
                        message: "Could not save subscription order"
                    });
                }

                return res.json({
                    success: true,
                    key: process.env.RAZORPAY_KEY_ID,
                    order: {
                        id: order.id,
                        amount: order.amount,
                        currency: order.currency
                    },
                    plan: {
                        name: "Premium",
                        price: PREMIUM_PRICE / 100,
                        durationDays: PLAN_DURATION_DAYS
                    }
                });
            }
        );
    } catch (error) {
        console.error("CREATE SUBSCRIPTION ORDER:", error);

        return res.status(500).json({
            success: false,
            message: "Could not create payment order"
        });
    }
};

export const verifySubscriptionPayment = async (req, res) => {
    const userId = req.userId;

    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    } = req.body;

    if (
        !userId ||
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature
    ) {
        return res.status(400).json({
            success: false,
            message: "Payment details are missing"
        });
    }

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

    const received = Buffer.from(razorpay_signature, "hex");
    const expected = Buffer.from(expectedSignature, "hex");

    if (
        received.length !== expected.length ||
        !crypto.timingSafeEqual(received, expected)
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid payment signature"
        });
    }

    try {
        const order = await razorpay.orders.fetch(razorpay_order_id);

        if (
            order.status !== "paid" ||
            Number(order.amount) !== PREMIUM_PRICE ||
            order.currency !== "INR" ||
            String(order.notes?.userId) !== String(userId) ||
            order.notes?.plan !== "premium"
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment order could not be verified"
            });
        }

        const payment = await razorpay.payments.fetch(
            razorpay_payment_id
        );

        if (
            payment.order_id !== razorpay_order_id ||
            payment.status !== "captured" ||
            Number(payment.amount) !== PREMIUM_PRICE ||
            payment.currency !== "INR"
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment is not captured"
            });
        }

        db.query(
            `SELECT id, status FROM user_subscriptions
             WHERE razorpay_order_id = ? AND user_id = ?`,
            [razorpay_order_id, userId],
            (err, rows) => {
                if (err) {
                    console.error("FIND SUBSCRIPTION:", err);

                    return res.status(500).json({
                        success: false,
                        message: "Database error"
                    });
                }

                if (!rows.length) {
                    return res.status(404).json({
                        success: false,
                        message: "Subscription order not found"
                    });
                }

                if (rows[0].status === "active") {
                    return res.json({
                        success: true,
                        message: "Subscription already activated"
                    });
                }

                const sql = `
                    UPDATE user_subscriptions
                    SET razorpay_payment_id = ?,
                        status = 'active',
                        started_at = NOW(),
                        expires_at = DATE_ADD(NOW(), INTERVAL 30 DAY)
                    WHERE id = ? AND status = 'created'
                `;

                db.query(
                    sql,
                    [razorpay_payment_id, rows[0].id],
                    (updateErr, result) => {
                        if (updateErr) {
                            console.error("ACTIVATE SUBSCRIPTION:", updateErr);

                            return res.status(500).json({
                                success: false,
                                message: "Could not activate subscription"
                            });
                        }

                        if (!result.affectedRows) {
                            return res.status(409).json({
                                success: false,
                                message: "Subscription status changed; refresh and check"
                            });
                        }

                        return res.json({
                            success: true,
                            message: "Premium subscription activated",
                            expiresInDays: PLAN_DURATION_DAYS
                        });
                    }
                );
            }
        );
    } catch (error) {
        console.error("VERIFY SUBSCRIPTION:", error);

        return res.status(500).json({
            success: false,
            message: "Payment verification failed"
        });
    }
};
