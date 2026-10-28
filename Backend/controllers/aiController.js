
import { GoogleGenerativeAI } from "@google/generative-ai";
import db from "../config/db.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODEL_NAME = "gemini-3.8-flash";
const DAILY_FREE_LIMIT = 5;
const MAX_RETRIES = 3;

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const generateAI = async (req, res) => {
  let usageReserved = false;
  let userId;

  try {
    userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login again.",
      });
    }

    const { action, text } = req.body;

    if (!["summary", "interview", "mcq"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid AI action.",
      });
    }

    if (typeof text !== "string" || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide notes for AI generation.",
      });
    }

    // Atomically reserve one daily use for free users.
    // The database date is used consistently for the daily limit.
    const [reservation] = await db.promise().execute(
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
           plan = 'premium'
           OR ai_usage_date IS NULL
           OR ai_usage_date <> UTC_DATE()
           OR ai_usage_count < ?
         )`,
      [userId, DAILY_FREE_LIMIT]
    );

    if (reservation.affectedRows === 0) {
      const [users] = await db.promise().execute(
        "SELECT id, plan, ai_usage_count, ai_usage_date FROM users WHERE id = ?",
        [userId]
      );

      if (!users.length) {
        return res.status(404).json({
          success: false,
          message: "User account not found.",
        });
      }

      const user = users[0];

      if (
        user.plan !== "premium" &&
        user.ai_usage_date &&
        String(user.ai_usage_date).slice(0, 10) ===
          new Date().toISOString().slice(0, 10) &&
        user.ai_usage_count >= DAILY_FREE_LIMIT
      ) {
        return res.status(403).json({
          success: false,
          upgradeRequired: true,
          message:
            "You have used all 5 free AI generations for today. Upgrade to Premium for more access.",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Could not verify your AI usage. Please try again.",
      });
    }

    // Premium usage is not restricted. Free usage is reserved
    // before the Gemini call to prevent concurrent requests bypassing the limit.
    const [userRows] = await db.promise().execute(
      "SELECT plan FROM users WHERE id = ?",
      [userId]
    );

    const isPremium = userRows[0]?.plan === "premium";
    usageReserved = !isPremium;

    let prompt = "";

    switch (action) {
      case "summary":
        prompt = `
You are an expert study assistant.
Generate a summary using ONLY the supplied notes.
Do not invent topics.
Return ONLY valid JSON, without markdown:
{
  "title": "Summary",
  "points": [
    { "heading": "", "description": "" }
  ]
}
Generate 3 to 8 points depending on the notes.

Notes:
${text}
`;
        break;

      case "interview":
        prompt = `
You are an expert technical interviewer.
Generate questions ONLY from the supplied notes.
Do not invent concepts.
Return ONLY valid JSON, without markdown:
{
  "title": "Interview Questions",
  "questions": [""]
}
Generate 3 to 10 meaningful questions.

Notes:
${text}
`;
        break;

      case "mcq":
        prompt = `
You are an expert teacher.
Create MCQs ONLY from the supplied notes.
Do not invent facts.
Return ONLY valid JSON, without markdown:
{
  "title": "MCQ Test",
  "questions": [
    {
      "question": "",
      "options": ["", "", "", ""],
      "answer": 0,
      "explanation": ""
    }
  ]
}
Generate 3 to 5 questions.
Each question must have exactly 4 options.
The answer must be 0, 1, 2, or 3.

Notes:
${text}
`;
        break;
    }

    console.log("AI CONTROLLER VERSION: daily-limit-v1");
    console.log("GEMINI MODEL:", MODEL_NAME);
console.log("AI CONTROLLER CALLED");
console.log("USER ID:", req.userId);
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
        generationConfig: {
    thinkingConfig: {
      thinkingLevel: "low"
    }
  }
    });
    console.log("USAGE UPDATE RESULT:", result.affectedRows);

    let result;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        result = await model.generateContent(prompt);
        break;
      } catch (err) {
        console.error(`Gemini attempt ${attempt} failed:`, err.message);

        // A quota error will not be fixed by retrying.
        if (err.status === 429) {
          throw err;
        }

        const isTemporary =
          err.status === 503 ||
          err.message?.toLowerCase().includes("fetch failed") ||
          err.cause?.code === "ECONNRESET" ||
          err.cause?.code === "ETIMEDOUT";

        if (!isTemporary || attempt === MAX_RETRIES) {
          throw err;
        }

        await sleep(attempt * 1000);
      }
    }

    if (!result) {
      throw new Error("Gemini did not return a result.");
    }

    let output = result.response.text()
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(output);
    } catch {
      return res.status(502).json({
        success: false,
        message: "Gemini returned an invalid response. Please retry.",
      });
    }

    switch (action) {
      case "summary":
        parsed.title = parsed.title || "Summary";
        parsed.points = Array.isArray(parsed.points)
          ? parsed.points
          : [];
        break;

      case "interview":
        parsed.title = parsed.title || "Interview Questions";
        parsed.questions = Array.isArray(parsed.questions)
          ? parsed.questions
          : [];
        break;

      case "mcq":
        parsed.title = parsed.title || "MCQ Test";
        parsed.questions = Array.isArray(parsed.questions)
          ? parsed.questions.map((q) => ({
              question: q.question || "",
              options:
                Array.isArray(q.options) && q.options.length === 4
                  ? q.options
                  : ["Option A", "Option B", "Option C", "Option D"],
              answer:
                Number.isInteger(q.answer) &&
                q.answer >= 0 &&
                q.answer <= 3
                  ? q.answer
                  : 0,
              explanation: q.explanation || "",
            }))
          : [];
        break;
    }

    return res.json({
      success: true,
      output: JSON.stringify(parsed),
    });
  } catch (err) {
    console.error("Gemini API Error:", err.message);
    console.error("Status:", err.status);

    // Release the reserved free use if generation fails.
    // This avoids charging a use for a failed generation.
    if (usageReserved && userId) {
      try {
        await db.promise().execute(
          `UPDATE users
           SET ai_usage_count = GREATEST(ai_usage_count - 1, 0)
           WHERE id = ? AND ai_usage_date = UTC_DATE()`,
          [userId]
        );
      } catch (rollbackError) {
        console.error(
          "Could not restore AI usage:",
          rollbackError.message
        );
      }
    }

    if (err.status === 429) {
      return res.status(429).json({
        success: false,
        message:
          "Google AI quota is currently exhausted. Please try again after it resets.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "AI generation failed. Please try again later.",
    });
  }
};
