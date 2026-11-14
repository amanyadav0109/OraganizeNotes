
import crypto from "crypto";
import dotenv from "dotenv";
import razorpay from "../config/razorpay.js";
import db from "../config/db.js";

dotenv.config();

const PREMIUM_PRICE = 19900; // ₹199 in paise
const PLAN_DURATION_DAYS = 30;

// CREATE SUBSCRIPTION ORDER
export const createSubscriptionOrder = async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Please login first",
    });
  }

  try {
    const order = await razorpay.orders.create({
      amount: PREMIUM_PRICE,
      currency: "INR",
      receipt: `premium_${userId}_${Date.now()}`,
      notes: {
        userId: String(userId),
        plan: "premium",
      },
    });

    await db.promise().query(
      `INSERT INTO user_subscriptions
       (user_id, plan_name, razorpay_order_id, amount, status)
       VALUES (?, 'premium', ?, ?, 'created')`,
      [userId, order.id, PREMIUM_PRICE / 100]
    );

    return res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      plan: {
        name: "Premium",
        price: PREMIUM_PRICE / 100,
        durationDays: PLAN_DURATION_DAYS,
      },
    });
  } catch (error) {
    console.error("CREATE SUBSCRIPTION ORDER:", error);

    return res.status(500).json({
      success: false,
      message: "Could not create payment order",
    });
  }
};

// VERIFY SUBSCRIPTION PAYMENT
export const verifySubscriptionPayment = async (req, res) => {
  const userId = req.userId;

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  if (
    !userId ||
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature
  ) {
    return res.status(400).json({
      success: false,
      message: "Payment details are missing",
    });
  }

  // Validate signature format
  if (!/^[a-f0-9]{64}$/i.test(razorpay_signature)) {
    return res.status(400).json({
      success: false,
      message: "Invalid payment signature",
    });
  }

  // Verify Razorpay signature
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
      message: "Invalid payment signature",
    });
  }

  let connection;

  try {
    // Verify order directly with Razorpay
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
        message: "Payment order could not be verified",
      });
    }

    // Verify captured payment directly with Razorpay
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
        message: "Payment is not captured",
      });
    }

    // Start database transaction
    connection = await db.promise().getConnection();

    await connection.beginTransaction();

    // Lock subscription row to prevent duplicate activation
    const [rows] = await connection.query(
      `SELECT id, status, razorpay_payment_id
       FROM user_subscriptions
       WHERE razorpay_order_id = ? AND user_id = ?
       FOR UPDATE`,
      [razorpay_order_id, userId]
    );

    if (!rows.length) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Subscription order not found",
      });
    }

    const subscription = rows[0];

    // Already activated: allow only the same payment
    if (subscription.status === "active") {
      if (
        subscription.razorpay_payment_id !== razorpay_payment_id
      ) {
        await connection.rollback();

        return res.status(409).json({
          success: false,
          message: "Subscription is already activated with another payment",
        });
      }

      // Keep user plan in sync
      await connection.query(
        "UPDATE users SET plan = 'premium' WHERE id = ?",
        [userId]
      );

      await connection.commit();

      return res.status(200).json({
        success: true,
        message: "Subscription already activated",
      });
    }

    // Only newly created orders can be activated
    if (subscription.status !== "created") {
      await connection.rollback();

      return res.status(409).json({
        success: false,
        message: "This subscription order cannot be activated",
      });
    }

    // Activate subscription
    const [updateResult] = await connection.query(
      `UPDATE user_subscriptions
       SET razorpay_payment_id = ?,
           status = 'active',
           started_at = NOW(),
           expires_at = DATE_ADD(NOW(), INTERVAL 30 DAY)
       WHERE id = ? AND status = 'created'`,
      [razorpay_payment_id, subscription.id]
    );

    if (!updateResult.affectedRows) {
      await connection.rollback();

      return res.status(409).json({
        success: false,
        message: "Subscription could not be activated",
      });
    }

    // IMPORTANT: Update user's plan as well
    await connection.query(
      "UPDATE users SET plan = 'premium' WHERE id = ?",
      [userId]
    );

    await connection.commit();

    return res.status(200).json({
      success: true,
      message: "Premium subscription activated successfully",
      plan: "premium",
      expiresInDays: PLAN_DURATION_DAYS,
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error("VERIFY SUBSCRIPTION:", error);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};
