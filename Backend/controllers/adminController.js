import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { promiseDb } from "../config/db.js";
export const adminLogin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  const sql = `
    SELECT id, name, email, password, status
    FROM admins
    WHERE email = ?
  `;

  db.query(sql, [email], async (err, result) => {
    if (err) {
      console.error("ADMIN LOGIN DB ERROR:", err);

      return res.status(500).json({
        message: "Database Error",
      });
    }

    if (result.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const admin = result[0];

    if (admin.status !== "active") {
      return res.status(403).json({
        message: "Admin account is inactive",
      });
    }

    try {
      const isMatch = await bcrypt.compare(
        password,
        admin.password
      );

      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      const token = jwt.sign(
        {
          id: admin.id,
          role: "admin",
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      return res.status(200).json({
        message: "Admin Login Successful",
        token,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
        },
      });
    } catch (error) {
      console.error("ADMIN LOGIN ERROR:", error);

      return res.status(500).json({
        message: "Login Failed",
      });
    }
  });
};


export const getAdminDashboard = async (req, res) => {
  try {
    // ---------------- SELECT YEAR ----------------

    const selectedYear = Number(
      req.query.year || new Date().getFullYear()
    );

    if (
      !Number.isInteger(selectedYear) ||
      selectedYear < 2020 ||
      selectedYear > 2100
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid year selected",
      });
    }

    // ---------------- DATABASE QUERIES ----------------

    const [
      [studentRows],
      [noteRows],
      [questionRows],
      [premiumRows],
      [revenueRows],
      [aiRows],
      [attemptRows],
      [monthlyRevenueRows],
      [recentUsers],
    ] = await Promise.all([

      // Total Students
      db.promise().query(`
        SELECT COUNT(*) AS totalStudents
        FROM users
      `),

      // Total Notes
      db.promise().query(`
        SELECT COUNT(*) AS totalNotes
        FROM notes
      `),

      // Total Practice Questions
      db.promise().query(`
        SELECT COUNT(*) AS totalQuestions
        FROM practice_questions
      `),

      // Premium Users
      db.promise().query(`
        SELECT COUNT(DISTINCT user_id) AS premiumUsers
        FROM user_subscriptions
        WHERE LOWER(status) = 'active'
      `),

      // Total Revenue
      db.promise().query(`
        SELECT
          (
            SELECT COALESCE(SUM(amount), 0)
            FROM user_subscriptions
            WHERE LOWER(status) = 'active'
          ) +
          (
            SELECT COALESCE(SUM(amount), 0)
            FROM marketplace_purchases
            WHERE LOWER(status) = 'paid'
          ) AS totalRevenue
      `),

      // Today's AI Requests
      db.promise().query(`
        SELECT COALESCE(SUM(ai_usage_count), 0) AS aiRequests
        FROM users
        WHERE ai_usage_date = CURDATE()
      `),

      // Practice Attempts
      db.promise().query(`
        SELECT COUNT(*) AS practiceAttempts
        FROM practice_attempts
      `),

      // Monthly Revenue (Selected Year + Previous December)
      db.promise().query(
        `
          SELECT
            DATE_FORMAT(paymentDate, '%Y-%m') AS month,
            SUM(amount) AS monthlyRevenue
          FROM (
            SELECT amount, created_at AS paymentDate
            FROM user_subscriptions
            WHERE LOWER(status) = 'active'

            UNION ALL

            SELECT amount, created_at AS paymentDate
            FROM marketplace_purchases
            WHERE LOWER(status) = 'paid'
          ) AS payments

          WHERE paymentDate >= ?
          AND paymentDate < ?

          GROUP BY DATE_FORMAT(paymentDate, '%Y-%m')
          ORDER BY month
        `,
        [
          `${selectedYear - 1}-12-01`,
          `${selectedYear + 1}-01-01`,
        ]
      ),

      // Recent Users
      db.promise().query(`
        SELECT
          u.id,
          u.name,
          u.email,
          CASE
            WHEN EXISTS (
              SELECT 1
              FROM user_subscriptions s
              WHERE s.user_id = u.id
              AND LOWER(s.status) = 'active'
            )
            THEN 'premium'
            ELSE 'free'
          END AS plan
        FROM users u
        ORDER BY u.id DESC
        LIMIT 5
      `),

    ]);

    // ---------------- MONTHLY REVENUE CALCULATION ----------------

    const revenueMap = {};

    monthlyRevenueRows.forEach((row) => {
      revenueMap[row.month] = Number(row.monthlyRevenue);
    });

    const monthlyRevenue = [];

    for (let month = 1; month <= 12; month++) {

      const currentMonth = String(month).padStart(2, "0");

      const currentKey = `${selectedYear}-${currentMonth}`;

      // Previous month calculation
      let previousKey;

      if (month === 1) {
        previousKey = `${selectedYear - 1}-12`;
      } else {
        previousKey = `${selectedYear}-${String(
          month - 1
        ).padStart(2, "0")}`;
      }

      const previousRevenue = revenueMap[previousKey] || 0;

      const currentRevenue = revenueMap[currentKey] || 0;

      // Candle calculation
      const open = previousRevenue;
      const close = currentRevenue;

      const high = Math.max(open, close);
      const low = Math.min(open, close);

      let trend = "same";

      if (close > open) {
        trend = "up";
      } else if (close < open) {
        trend = "down";
      }

      monthlyRevenue.push({
        month: currentKey,

        open,
        close,
        high,
        low,

        totalRevenue: currentRevenue,

        change: currentRevenue - previousRevenue,

        trend,
      });
    }

    // ---------------- RESPONSE ----------------

    return res.status(200).json({
      success: true,

      selectedYear,

      stats: {
        totalStudents: studentRows[0].totalStudents,
        totalNotes: noteRows[0].totalNotes,
        totalQuestions: questionRows[0].totalQuestions,
        premiumUsers: premiumRows[0].premiumUsers,

        totalRevenue: Number(
          revenueRows[0].totalRevenue
        ),

        aiRequests: Number(aiRows[0].aiRequests),

        practiceAttempts: attemptRows[0].practiceAttempts,
      },

      monthlyRevenue,

      recentUsers,
    });

  } catch (error) {
    console.error("ADMIN DASHBOARD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch admin dashboard data",
    });
  }
};
// Get all students for Admin Users Page


export const getAdminUsers = (req, res) => {
  const sql = `
    SELECT
      u.id,
      u.name,
      u.email,
      u.profilePic,
      u.createdAt,

      CASE
        WHEN EXISTS (
          SELECT 1
          FROM user_subscriptions us
          WHERE us.user_id = u.id
            AND LOWER(us.status) = 'active'
        )
        THEN 'premium'
        ELSE 'free'
      END AS plan

    FROM users u
    ORDER BY u.createdAt DESC
  `;

  db.query(sql, (error, users) => {
    if (error) {
      console.error("Get Admin Users Error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch students",
      });
    }

    const formattedUsers = users.map((user) => ({
      ...user,
      status: "Active",
    }));

    return res.status(200).json({
      success: true,
      totalUsers: formattedUsers.length,
      users: formattedUsers,
    });
  });
};



export const getAdminNotes = async (req, res) => {
  try {
    const [notes] = await db.promise().query(`
      SELECT
        n.id,
        n.title,
        n.content,
        n.userId,
        n.subjectId,
        n.isPinned,
        n.isCompleted,
        n.dueDate,
        n.createdAt,
        n.updatedAt,
        n.filePath,
        n.fileName,
        u.name AS studentName,
        u.email AS studentEmail,
        s.subjectName
      FROM notes n
      LEFT JOIN users u ON u.id = n.userId
      LEFT JOIN subjects s ON s.id = n.subjectId
      ORDER BY n.createdAt DESC
    `);

    const formattedNotes = notes.map((note) => ({
      ...note,
      isPinned: Boolean(note.isPinned),
      isCompleted: Boolean(note.isCompleted),
      subjectName: note.subjectName || "Uncategorized",
      studentName: note.studentName || "Unknown Student",
    }));

    const stats = {
      totalNotes: formattedNotes.length,
      pinnedNotes: formattedNotes.filter((n) => n.isPinned).length,
      completedNotes: formattedNotes.filter((n) => n.isCompleted).length,
      pendingNotes: formattedNotes.filter((n) => !n.isCompleted).length,
      attachmentNotes: formattedNotes.filter((n) => n.filePath).length,
    };

    return res.status(200).json({
      success: true,
      stats,
      notes: formattedNotes,
    });
  } catch (error) {
    console.error("GET ADMIN NOTES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch notes",
    });
  }
};



export const deleteAdminNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !Number.isInteger(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
      });
    }

    const [result] = await db.promise().query(
      "DELETE FROM notes WHERE id = ?",
      [Number(id)]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ADMIN NOTE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete note",
    });
  }
};


export const getAdminMarketplace = async (req, res) => {
  try {
    const [[summaryRows]] = await db.promise().query(`
      SELECT
        COUNT(p.id) AS totalSales,
        COALESCE(SUM(p.amount), 0) AS totalRevenue,
        COUNT(DISTINCT mn.id) AS totalNotes
      FROM marketplace_notes mn
      LEFT JOIN marketplace_purchases p
        ON p.note_id = mn.id
        AND LOWER(p.status) = 'paid'
        AND p.user_id <> mn.seller_id
    `);

    const [notesCountRows] = await db.promise().query(`
      SELECT COUNT(*) AS totalNotes
      FROM marketplace_notes
    `);

    const totalRevenue = Number(summaryRows.totalRevenue || 0);

    const [salesDetails] = await db.promise().query(`
      SELECT
        mn.id AS noteId,
        mn.title,
        mn.seller_id AS sellerId,
        mn.seller_name AS sellerName,
        COUNT(p.id) AS totalSold,
        COALESCE(SUM(p.amount), 0) AS totalRevenue,
        ROUND(COALESCE(SUM(p.amount), 0) * 0.60, 2) AS sellerEarnings,
        ROUND(COALESCE(SUM(p.amount), 0) * 0.40, 2) AS platformEarnings
      FROM marketplace_notes mn
      LEFT JOIN marketplace_purchases p
        ON p.note_id = mn.id
        AND LOWER(p.status) = 'paid'
        AND p.user_id <> mn.seller_id
      GROUP BY
        mn.id,
        mn.title,
        mn.seller_id,
        mn.seller_name
      ORDER BY totalRevenue DESC
    `);

    const [notesDetails] = await db.promise().query(`
      SELECT
        mn.id,
        mn.title,
        mn.seller_id AS sellerId,
        mn.seller_name AS sellerName,
        mn.subject,
        mn.unit,
        mn.price,
        mn.created_at AS createdAt,
        COUNT(p.id) AS totalSold,
        COALESCE(SUM(p.amount), 0) AS totalRevenue
      FROM marketplace_notes mn
      LEFT JOIN marketplace_purchases p
        ON p.note_id = mn.id
        AND LOWER(p.status) = 'paid'
        AND p.user_id <> mn.seller_id
      GROUP BY
        mn.id,
        mn.title,
        mn.seller_id,
        mn.seller_name,
        mn.subject,
        mn.unit,
        mn.price,
        mn.created_at
      ORDER BY mn.created_at DESC
    `);

    const [sellerPayouts] = await db.promise().query(`
      SELECT
        mn.seller_id AS sellerId,
        MAX(mn.seller_name) AS sellerName,

        COUNT(DISTINCT mn.id) AS totalNotes,
        COUNT(p.id) AS totalSales,

        COALESCE(SUM(p.amount), 0) AS totalSalesRevenue,

        ROUND(
          COALESCE(SUM(p.amount), 0) * 0.60,
          2
        ) AS totalEarnings,

        COALESCE((
          SELECT SUM(sp.amount)
          FROM marketplace_seller_payouts sp
          WHERE sp.seller_id = mn.seller_id
        ), 0) AS totalPaid,

        ROUND(
          COALESCE(SUM(p.amount), 0) * 0.60
          -
          COALESCE((
            SELECT SUM(sp.amount)
            FROM marketplace_seller_payouts sp
            WHERE sp.seller_id = mn.seller_id
          ), 0),
          2
        ) AS pendingBalance

      FROM marketplace_notes mn

      LEFT JOIN marketplace_purchases p
        ON p.note_id = mn.id
        AND LOWER(p.status) = 'paid'
        AND p.user_id <> mn.seller_id

      GROUP BY mn.seller_id
      ORDER BY pendingBalance DESC
    `);

    const [payoutHistory] = await db.promise().query(`
      SELECT
        sp.id,
        sp.seller_id AS sellerId,
        COALESCE(MAX(mn.seller_name), 'Unknown Seller') AS sellerName,
        sp.amount,
        sp.transfer_reference AS transferReference,
        sp.notes,
        sp.status,
        sp.paid_at AS paidAt,
        sp.admin_id AS adminId
      FROM marketplace_seller_payouts sp
      LEFT JOIN marketplace_notes mn
        ON mn.seller_id = sp.seller_id
      GROUP BY
        sp.id,
        sp.seller_id,
        sp.amount,
        sp.transfer_reference,
        sp.notes,
        sp.status,
        sp.paid_at,
        sp.admin_id
      ORDER BY sp.paid_at DESC
    `);

    const totalSellerEarnings = Number(
      (totalRevenue * 0.60).toFixed(2)
    );

    const totalPlatformEarnings = Number(
      (totalRevenue * 0.40).toFixed(2)
    );

    return res.status(200).json({
      success: true,

      summary: {
        totalSales: Number(summaryRows.totalSales || 0),
        totalNotes: Number(notesCountRows[0].totalNotes || 0),
        totalRevenue,
        totalSellerEarnings,
        totalPlatformEarnings,
      },

      salesDetails,
      notesDetails,
      sellerPayouts,
      payoutHistory,
    });

  } catch (error) {
    console.error("ADMIN MARKETPLACE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch marketplace data",
    });
  }
};



export const createSellerPayout = async (req, res) => {
  let connection;

  try {
    const sellerId = Number(req.body.sellerId);
    const amount = Number(req.body.amount);

    const transferReference = String(
      req.body.transferReference || ""
    ).trim();

    const notes = String(req.body.notes || "").trim();

    const adminId = Number(req.adminId);

    if (
      !Number.isInteger(sellerId) ||
      sellerId <= 0 ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !/^\d+(\.\d{1,2})?$/.test(String(req.body.amount)) ||
      !transferReference ||
      !Number.isInteger(adminId) ||
      adminId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid seller, amount, transfer reference and admin are required",
      });
    }

    connection = await db.promise().getConnection();

    await connection.beginTransaction();

    // Lock seller row to prevent concurrent payout records
    const [sellerRows] = await connection.query(
      `SELECT id FROM users WHERE id = ? FOR UPDATE`,
      [sellerId]
    );

    if (sellerRows.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    // Calculate seller's total eligible earnings
    const [earningRows] = await connection.query(`
      SELECT
        ROUND(
          COALESCE(SUM(p.amount), 0) * 0.60,
          2
        ) AS totalEarnings
      FROM marketplace_notes mn
      INNER JOIN marketplace_purchases p
        ON p.note_id = mn.id
      WHERE mn.seller_id = ?
        AND LOWER(p.status) = 'paid'
        AND p.user_id <> mn.seller_id
    `, [sellerId]);

    // Calculate already recorded payouts
    const [paidRows] = await connection.query(`
      SELECT COALESCE(SUM(amount), 0) AS totalPaid
      FROM marketplace_seller_payouts
      WHERE seller_id = ?
    `, [sellerId]);

    const totalEarnings = Number(
      earningRows[0].totalEarnings || 0
    );

    const totalPaid = Number(
      paidRows[0].totalPaid || 0
    );

    const pendingBalance = Number(
      (totalEarnings - totalPaid).toFixed(2)
    );

    const payoutAmount = Number(amount.toFixed(2));

    if (payoutAmount > pendingBalance) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "Payout amount exceeds seller's pending balance",
        pendingBalance,
      });
    }

    // Save payout record only after actual manual transfer
    await connection.query(`
      INSERT INTO marketplace_seller_payouts
      (
        seller_id,
        amount,
        transfer_reference,
        notes,
        admin_id,
        status
      )
      VALUES (?, ?, ?, ?, ?, 'paid')
    `, [
      sellerId,
      payoutAmount,
      transferReference,
      notes || null,
      adminId,
    ]);

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: "Seller payout recorded successfully",
      payout: {
        sellerId,
        amount: payoutAmount,
        transferReference,
        totalEarnings,
        totalPaid: Number((totalPaid + payoutAmount).toFixed(2)),
        pendingBalance: Number(
          (pendingBalance - payoutAmount).toFixed(2)
        ),
      },
    });

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "This transfer reference has already been used",
      });
    }

    console.error("CREATE SELLER PAYOUT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to record seller payout",
    });

  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export const getAdminSubscriptions = async (req, res) => {
  try {
    // 1. Subscription summary
    const [summaryRows] = await db.promise().query(`
      SELECT
        COUNT(DISTINCT CASE
          WHEN status = 'active'
          AND (expires_at IS NULL OR expires_at >= NOW())
          THEN user_id
        END) AS totalPremiumUsers,

        SUM(CASE
          WHEN status = 'active'
          AND (expires_at IS NULL OR expires_at >= NOW())
          THEN 1 ELSE 0
        END) AS activeSubscriptions,

        SUM(CASE
          WHEN status = 'expired'
          OR (status = 'active' AND expires_at < NOW())
          THEN 1 ELSE 0
        END) AS expiredSubscriptions,

        COALESCE(SUM(CASE
          WHEN status IN ('active', 'expired')
          AND razorpay_payment_id IS NOT NULL
          THEN amount ELSE 0
        END), 0) AS totalRevenue

      FROM user_subscriptions
    `);

    // 2. All subscription records with student details
    const [subscriptions] = await db.promise().query(`
      SELECT
        us.id AS subscriptionId,
        us.user_id AS userId,
        u.name AS studentName,
        u.email,
        us.plan_name AS planName,
        us.amount,
        us.razorpay_order_id AS razorpayOrderId,
        us.razorpay_payment_id AS razorpayPaymentId,
        us.status AS originalStatus,
        CASE
          WHEN us.status = 'active'
            AND us.expires_at IS NOT NULL
            AND us.expires_at < NOW()
          THEN 'expired'
          ELSE us.status
        END AS status,
        us.started_at AS startedAt,
        us.expires_at AS expiresAt,
        us.created_at AS createdAt,
        CASE
          WHEN us.status = 'active'
            AND (us.expires_at IS NULL OR us.expires_at >= NOW())
          THEN GREATEST(
            DATEDIFF(us.expires_at, NOW()),
            0
          )
          ELSE 0
        END AS remainingDays

      FROM user_subscriptions us
      INNER JOIN users u ON u.id = us.user_id
      ORDER BY us.created_at DESC
    `);

    // 3. Payment history
    const [payments] = await db.promise().query(`
      SELECT
        us.id AS subscriptionId,
        u.name AS studentName,
        u.email,
        us.plan_name AS planName,
        us.amount,
        us.razorpay_order_id AS razorpayOrderId,
        us.razorpay_payment_id AS razorpayPaymentId,
        us.status,
        us.created_at AS paymentDate

      FROM user_subscriptions us
      INNER JOIN users u ON u.id = us.user_id
      WHERE us.razorpay_payment_id IS NOT NULL
      ORDER BY us.created_at DESC
    `);

    return res.status(200).json({
      success: true,
      summary: {
        totalPremiumUsers: Number(
          summaryRows[0].totalPremiumUsers || 0
        ),
        activeSubscriptions: Number(
          summaryRows[0].activeSubscriptions || 0
        ),
        expiredSubscriptions: Number(
          summaryRows[0].expiredSubscriptions || 0
        ),
        totalRevenue: Number(
          summaryRows[0].totalRevenue || 0
        ),
      },
      subscriptions,
      payments,
    });
  } catch (error) {
    console.error("ADMIN SUBSCRIPTIONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch subscription details",
    });
  }
};

export const getAdminAIUsage = async (req, res) => {
  try {
    const [summaryRows] = await db.promise().query(`
      SELECT
        COUNT(
          CASE
            WHEN u.ai_usage_date = UTC_DATE()
             AND u.ai_usage_count > 0
            THEN 1
          END
        ) AS freeUsersUsedToday,

        COALESCE(SUM(
          CASE
            WHEN u.ai_usage_date = UTC_DATE()
            THEN u.ai_usage_count
            ELSE 0
          END
        ), 0) AS freeRequestsToday,

        COUNT(
          CASE
            WHEN u.ai_usage_date = UTC_DATE()
             AND u.ai_usage_count >= 10
            THEN 1
          END
        ) AS freeUsersAtLimit,

        COUNT(
          CASE
            WHEN LOWER(u.plan) = 'premium'
              OR EXISTS (
                SELECT 1
                FROM user_subscriptions us
                WHERE us.user_id = u.id
                  AND us.status = 'active'
                  AND us.expires_at > NOW()
              )
            THEN 1
          END
        ) AS premiumUsers

      FROM users u
    `);

    const [users] = await db.promise().query(`
      SELECT
        u.id AS userId,
        u.name,
        u.email,
        u.plan,
        u.ai_usage_count AS storedUsage,
        u.ai_usage_date AS usageDate,

        CASE
          WHEN LOWER(u.plan) = 'premium'
            OR EXISTS (
              SELECT 1
              FROM user_subscriptions us
              WHERE us.user_id = u.id
                AND us.status = 'active'
                AND us.expires_at > NOW()
            )
          THEN 'premium'
          ELSE 'free'
        END AS effectivePlan,

        CASE
          WHEN u.ai_usage_date = UTC_DATE()
          THEN u.ai_usage_count
          ELSE 0
        END AS usedToday

      FROM users u
      ORDER BY usedToday DESC, u.id DESC
    `);

    const summary = summaryRows[0];

    return res.status(200).json({
      success: true,
      summary: {
        freeRequestsToday: Number(summary.freeRequestsToday || 0),
        freeUsersUsedToday: Number(summary.freeUsersUsedToday || 0),
        freeUsersAtLimit: Number(summary.freeUsersAtLimit || 0),
        premiumUsers: Number(summary.premiumUsers || 0),
        dailyFreeLimit: 10,
      },
      users,
    });
  } catch (error) {
    console.error("ADMIN AI USAGE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch AI usage",
    });
  }
};
