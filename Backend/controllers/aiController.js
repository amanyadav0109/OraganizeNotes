

import { GoogleGenAI } from "@google/genai";
import db from "../config/db.js";

const DAILY_FREE_LIMIT = 5;
const MODEL_NAME = "gemini-3.5-flash-lite";
const AI_TIMEOUT_MS = 45000;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const sendError = (res, status, message, extra = {}) =>
  res.status(status).json({
    success: false,
    message,
    ...extra,
  });

function parseAIResponse(text) {
  if (!text || !text.trim()) {
    throw new Error("Gemini returned an empty response.");
  }

  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error("Gemini returned invalid JSON.");
  }
}

function buildPrompt(type, content) {
  const text = String(content ?? "").trim();

  if (!text) {
    throw new Error("Please provide content for AI generation.");
  }

  if (type === "summary") {
    return `
Summarize these notes into clear, concise revision points.
Return ONLY valid JSON:
{
  "title": "Summary",
  "summary": "A concise summary of the notes",
  "points": [
    {
      "heading": "Key concept",
      "description": "Explanation of the concept"
    }
  ]
}

Use 3 to 7 useful points when the notes support them.
Do not invent facts.

Notes:
${text}
`;
  }

  if (type === "interview") {
    return `
Create 5 useful interview questions and answers based on these notes.
Return ONLY valid JSON:
{
  "title": "Interview Questions",
  "questions": [
    {
      "question": "Question text",
      "answer": "Clear suggested answer"
    }
  ]
}

Do not invent facts not supported by the notes.

Notes:
${text}
`;
  }

  if (type === "mcq") {
    return `
Create 5 multiple-choice questions from these notes.
Return ONLY valid JSON:
{
  "title": "MCQ Test",
  "questions": [
    {
      "question": "Question text",
      "options": [
        "First option",
        "Second option",
        "Third option",
        "Fourth option"
      ],
      "answer": "Second option",
      "explanation": "Short explanation"
    }
  ]
}

Rules:
- Each question must have exactly four distinct options.
- The answer must exactly match one option's full text.
- Do not use a letter or number as the answer.
- Make exactly one option correct per question.
- Do not invent facts not supported by the notes.
- Return valid JSON only.

Notes:
${text}
`;
  }

  throw new Error("Invalid AI generation type.");
}

function withTimeout(promise, timeoutMs) {
  let timer;

  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      const error = new Error("AI request timed out. Please try again.");
      error.code = "AI_TIMEOUT";
      reject(error);
    }, timeoutMs);
  });

  return Promise.race([promise, timeout]).finally(() => {
    clearTimeout(timer);
  });
}

export const generateAI = async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return sendError(res, 401, "Please log in again.");
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is missing.");
    return sendError(res, 500, "AI service is not configured.");
  }

  let connection;
  let transactionStarted = false;

  try {
    const type = String(
      req.body?.type ?? req.body?.action ?? req.body?.mode ?? ""
    )
      .trim()
      .toLowerCase();

    const content =
      req.body?.content ??
      req.body?.text ??
      req.body?.notes ??
      req.body?.noteContent;

    const prompt = buildPrompt(type, content);

    connection = await db.promise().getConnection();

    await connection.beginTransaction();
    transactionStarted = true;

    // Get user and lock the row while checking daily usage.
    const [users] = await connection.execute(
      `SELECT id, plan, ai_usage_count, ai_usage_date
       FROM users
       WHERE id = ?
       LIMIT 1
       FOR UPDATE`,
      [userId]
    );

    if (!users.length) {
      await connection.rollback();
      transactionStarted = false;

      return sendError(res, 404, "User not found.");
    }

    const user = users[0];

    // Check whether this user has an active, non-expired subscription.
    const [subscriptionRows] = await connection.execute(
      `SELECT EXISTS (
         SELECT 1
         FROM user_subscriptions
         WHERE user_id = ?
           AND status = 'active'
           AND expires_at > NOW()
       ) AS has_active_subscription`,
      [userId]
    );

    const hasActiveSubscription =
      Number(subscriptionRows[0]?.has_active_subscription ?? 0) === 1;

    // Support both the users.plan field and the subscription table.
    const isPremium =
      String(user.plan ?? "free").toLowerCase() === "premium" ||
      hasActiveSubscription;

    const [usageRows] = await connection.execute(
      `SELECT
         CASE
           WHEN ai_usage_date = UTC_DATE()
             THEN ai_usage_count
           ELSE 0
         END AS used
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [userId]
    );

    const used = Number(usageRows[0]?.used ?? 0);

    // Only non-Premium users are restricted by the daily free limit.
    if (!isPremium && used >= DAILY_FREE_LIMIT) {
      await connection.rollback();
      transactionStarted = false;

      return sendError(
        res,
        403,
        "Daily free AI limit reached. Upgrade to Premium to continue.",
        {
          upgradeRequired: true,
          used,
          limit: DAILY_FREE_LIMIT,
        }
      );
    }

    console.time("GEMINI_API_TIME");

    let response;

    try {
      response = await withTimeout(
        ai.models.generateContent({
          model: MODEL_NAME,
          contents: prompt,
          config: {
            temperature: 0.3,
            maxOutputTokens: 1200,
            responseMimeType: "application/json",
          },
        }),
        AI_TIMEOUT_MS
      );
    } finally {
      console.timeEnd("GEMINI_API_TIME");
    }

    const result = parseAIResponse(response.text);

    // Count successful generations only for Free users.
    let newUsage = used;

    if (!isPremium) {
      newUsage = used + 1;

      await connection.execute(
        `UPDATE users
         SET ai_usage_count = ?,
             ai_usage_date = UTC_DATE()
         WHERE id = ?`,
        [newUsage, userId]
      );
    }

    await connection.commit();
    transactionStarted = false;

    const usage = isPremium
      ? null
      : {
          used: newUsage,
          limit: DAILY_FREE_LIMIT,
          remaining: Math.max(0, DAILY_FREE_LIMIT - newUsage),
        };

    return res.status(200).json({
      success: true,
      result,
      data: result,
      usage,
      isPremium,
    });
  } catch (error) {
    if (transactionStarted && connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error(
          "AI TRANSACTION ROLLBACK ERROR:",
          rollbackError.message
        );
      }

      transactionStarted = false;
    }

    console.error("AI GENERATION ERROR:", error.message);
    console.error("AI ERROR STATUS:", error.status ?? "unknown");

    if (error.code === "AI_TIMEOUT") {
      return sendError(
        res,
        504,
        "AI took too long to respond. Please try again."
      );
    }

    const message = String(error.message ?? "").toLowerCase();
    const status = Number(error.status ?? error.statusCode ?? 0);

    if (
      status === 429 ||
      message.includes("429") ||
      message.includes("quota") ||
      message.includes("resource_exhausted")
    ) {
      return sendError(
        res,
        429,
        "Gemini API quota is exhausted. Please try again later."
      );
    }

    if (
      status === 503 ||
      message.includes("503") ||
      message.includes("overloaded")
    ) {
      return sendError(
        res,
        503,
        "AI service is busy. Please try again shortly."
      );
    }

    return sendError(
      res,
      502,
      "AI generation failed. Please try again.",
      {
        detail:
          process.env.NODE_ENV === "production"
            ? undefined
            : error.message,
      }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export const generateAi = generateAI;
export const generateAIContent = generateAI;
