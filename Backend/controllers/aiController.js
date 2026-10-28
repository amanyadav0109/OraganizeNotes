
import { GoogleGenerativeAI } from "@google/generative-ai";
import db from "../config/db.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODEL_NAME = "gemini-3.8-flash";
const DAILY_FREE_LIMIT = 5;
const MAX_ATTEMPTS = 2;

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const isTemporaryError = (err) => {
  const message = err.message?.toLowerCase() || "";

  return (
    err.status === 503 ||
    message.includes("fetch failed") ||
    err.cause?.code === "ECONNRESET" ||
    err.cause?.code === "ETIMEDOUT"
  );
};

export const generateAI = async (req, res) => {
  try {
    const userId = req.userId;

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

    // 1. Fetch the user's current plan and today's usage.
    const [users] = await db.promise().execute(
      `SELECT
         id,
         plan,
         ai_usage_count,
         ai_usage_date,
         (ai_usage_date = UTC_DATE()) AS usage_is_today
       FROM users
       WHERE id = ?`,
      [userId]
    );

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    const user = users[0];
    const isPremium = user.plan === "premium";

    // 2. Block free users who have already used 5 generations today.
    if (
      !isPremium &&
      Number(user.usage_is_today) === 1 &&
      Number(user.ai_usage_count) >= DAILY_FREE_LIMIT
    ) {
      return res.status(403).json({
        success: false,
        upgradeRequired: true,
        message:
          "You have used all 5 free AI generations for today. Upgrade to Premium for more access.",
      });
    }

    // 3. Prepare the prompt.
    let prompt;

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

    console.log("AI CONTROLLER VERSION: daily-limit-v2");
    console.log("AI ACTION:", action);
    console.log("USER ID:", userId);
    console.log("GEMINI MODEL:", MODEL_NAME);

    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: {
        thinkingConfig: {
          thinkingLevel: "low",
        },
      },
    });

    // 4. Generate the response. Retries are for temporary errors only.
    let result;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        result = await model.generateContent(prompt);
        break;
      } catch (err) {
        console.error(
          `Gemini attempt ${attempt} failed:`,
          err.message
        );

        // Retrying a quota error will not restore the quota.
        if (err.status === 429) {
          throw err;
        }

        if (!isTemporaryError(err) || attempt === MAX_ATTEMPTS) {
          throw err;
        }

        await sleep(1000);
      }
    }

    if (!result) {
      throw new Error("Gemini did not return a result.");
    }

    let output = result.response.text()
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // 5. Parse before incrementing usage.
    // Invalid responses do not consume a successful generation.
    let parsed;

    try {
      parsed = JSON.parse(output);
    } catch {
      return res.status(502).json({
        success: false,
        message: "Gemini returned invalid JSON. Please try again.",
      });
    }

    // 6. Normalize the generated data.
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

    // 7. Count only successful generations.
    // The conditional UPDATE protects the limit if requests overlap.
    if (!isPremium) {
      const [updateResult] = await db.promise().execute(
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

      if (updateResult.affectedRows !== 1) {
        // Another simultaneous request may have used the last slot.
        const [latestUsers] = await db.promise().execute(
          `SELECT
             plan,
             ai_usage_count,
             (ai_usage_date = UTC_DATE()) AS usage_is_today
           FROM users
           WHERE id = ?`,
          [userId]
        );

        if (!latestUsers.length) {
          return res.status(404).json({
            success: false,
            message: "User account not found.",
          });
        }

        const latest = latestUsers[0];

        if (
          latest.plan !== "premium" &&
          Number(latest.usage_is_today) === 1 &&
          Number(latest.ai_usage_count) >= DAILY_FREE_LIMIT
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
          message: "Could not update AI usage. Please try again.",
        });
      }
    }

    console.log(
      isPremium
        ? "Premium AI generation completed."
        : "Free AI usage count updated."
    );

    return res.json({
      success: true,
      output: JSON.stringify(parsed),
    });
  } catch (err) {
    console.error("AI GENERATION ERROR:", err.message);
    console.error("HTTP STATUS:", err.status || "unknown");

    if (err.status === 429) {
      return res.status(429).json({
        success: false,
        message:
          "Google AI quota is exhausted. Please try again after the quota resets.",
      });
    }

    if (err.status === 503) {
      return res.status(503).json({
        success: false,
        message:
          "The AI service is temporarily busy. Please try again shortly.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "AI generation failed. Please try again later.",
    });
  }
};
