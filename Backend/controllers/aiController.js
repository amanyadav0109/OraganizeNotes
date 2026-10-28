

import { GoogleGenAI } from "@google/genai";
import db from "../config/db.js";

const DAILY_FREE_LIMIT = 5;
const MODEL_NAME = "gemini-3.8-flash";

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
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  return JSON.parse(cleaned);
}

function buildPrompt(type, content) {
  const text = String(content ?? "").trim();

  if (!text) {
    throw new Error("Please provide content for AI generation.");
  }

  if (type === "summary") {
    return `
Summarize the following notes clearly.
Return ONLY valid JSON in this format:
{"summary":"Your summary here"}

Notes:
${text}
`;
  }

  if (type === "interview") {
    return `
Create interview questions and answers from these notes.
Return ONLY valid JSON in this format:
{"questions":[{"question":"Question","answer":"Answer"}]}

Create 5 useful questions.

Notes:
${text}
`;
  }

  if (type === "mcq") {
    return `
Create 5 multiple-choice questions from these notes.
Return ONLY valid JSON in this format:
{"questions":[{"question":"Question","options":["A","B","C","D"],"answer":"Correct option","explanation":"Short explanation"}]}

Ensure every question has exactly four options.

Notes:
${text}
`;
  }

  throw new Error("Invalid AI generation type.");
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

  let reservedUsage = false;

  try {
    const [users] = await db.promise().execute(
      `SELECT id, plan, ai_usage_count, ai_usage_date
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [userId]
    );

    if (!users.length) {
      return sendError(res, 404, "User not found.");
    }

    const user = users[0];
    const isPremium =
      String(user.plan ?? "free").toLowerCase() === "premium";

    const type = String(req.body?.type ?? "").toLowerCase();

    // Support common content field names.
    const content =
      req.body?.content ??
      req.body?.text ??
      req.body?.notes ??
      req.body?.noteContent;

    const prompt = buildPrompt(type, content);

    // Reserve one daily usage atomically for free users.
    // Premium users bypass this limit.
    if (!isPremium) {
      const [update] = await db.promise().execute(
        `UPDATE users
         SET ai_usage_count =
               CASE
                 WHEN ai_usage_date = UTC_DATE()
                   THEN ai_usage_count + 1
                 ELSE 1
               END,
             ai_usage_date = UTC_DATE()
         WHERE id = ?
           AND (
             ai_usage_date IS NULL
             OR ai_usage_date <> UTC_DATE()
             OR ai_usage_count < ?
           )`,
        [userId, DAILY_FREE_LIMIT]
      );

      if (update.affectedRows !== 1) {
        const [latest] = await db.promise().execute(
          `SELECT ai_usage_count, ai_usage_date
           FROM users
           WHERE id = ?
           LIMIT 1`,
          [userId]
        );

        const used =
          latest[0]?.ai_usage_date &&
          String(latest[0].ai_usage_date).slice(0, 10) ===
            new Date().toISOString().slice(0, 10)
            ? Number(latest[0].ai_usage_count)
            : 0;

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

      reservedUsage = true;
    }

    console.time("GEMINI_API_TIME");

    let response;

    try {
      response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          temperature: 0.3,
          maxOutputTokens: 1200,
          responseMimeType: "application/json",
        },
      });
    } finally {
      console.timeEnd("GEMINI_API_TIME");
    }

    const result = parseAIResponse(response.text);

    // Successful generation: keep the reserved usage.
    reservedUsage = false;

    let usage = null;

    if (!isPremium) {
      const [rows] = await db.promise().execute(
        `SELECT ai_usage_count
         FROM users
         WHERE id = ?
         LIMIT 1`,
        [userId]
      );

      usage = {
        used: Number(rows[0]?.ai_usage_count ?? 0),
        limit: DAILY_FREE_LIMIT,
        remaining: Math.max(
          0,
          DAILY_FREE_LIMIT - Number(rows[0]?.ai_usage_count ?? 0)
        ),
      };
    }

    return res.status(200).json({
      success: true,
      result,
      data: result,
      usage,
    });
  } catch (error) {
    console.error("AI GENERATION ERROR:", error.message);
    console.error("AI ERROR STATUS:", error.status ?? "unknown");

    // Failed generation must not consume the reserved free usage.
    if (reservedUsage) {
      try {
        await db.promise().execute(
          `UPDATE users
           SET ai_usage_count = GREATEST(ai_usage_count - 1, 0)
           WHERE id = ?
             AND ai_usage_date = UTC_DATE()`,
          [userId]
        );
      } catch (rollbackError) {
        console.error(
          "AI USAGE ROLLBACK ERROR:",
          rollbackError.message
        );
      }
    }

    const message = String(error.message ?? "");

    if (
      error.status === 429 ||
      message.includes("429") ||
      message.toLowerCase().includes("quota")
    ) {
      return sendError(
        res,
        429,
        "Gemini API quota is exhausted. Please try again later."
      );
    }

    if (
      error.status === 503 ||
      message.includes("503") ||
      message.toLowerCase().includes("overloaded")
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
      { detail: message }
    );
  }
};

// Aliases in case your existing route imports another handler name.
export const generateAi = generateAI;
export const generateAIContent = generateAI;
