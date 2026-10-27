
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODEL_NAME = "gemini-3.8-flash";
const MAX_RETRIES = 3;

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const generateAI = async (req, res) => {
  try {
    const { action, text } = req.body;

    // Validate input
    if (typeof text !== "string" || !text.trim()) {
      const emptyResponses = {
        summary: { title: "Summary", points: [] },
        interview: {
          title: "Interview Questions",
          questions: [],
        },
        mcq: { title: "MCQ Test", questions: [] },
      };

      return res.json({
        output: JSON.stringify(emptyResponses[action] || {}),
      });
    }

    // Create prompt
    let prompt = "";

    switch (action) {
      case "summary":
        prompt = `
You are an expert study assistant.
Generate a summary using ONLY the supplied notes.
Do not invent topics.
Return ONLY valid JSON, without markdown, in this format:
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
Generate interview questions ONLY from the supplied notes.
Do not invent concepts.
Return ONLY valid JSON, without markdown, in this format:
{
  "title": "Interview Questions",
  "questions": [""]
}
Generate 3 to 10 meaningful questions depending on the notes.

Notes:
${text}
`;
        break;

      case "mcq":
        prompt = `
You are an expert teacher.
Create MCQs ONLY from the supplied notes.
Do not invent facts.
Return ONLY valid JSON, without markdown, in this format:
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
Generate 3 to 5 questions depending on the notes.
Each question must have exactly 4 options.
The answer must be 0, 1, 2, or 3.

Notes:
${text}
`;
        break;

      default:
        prompt = text;
    }

    // Log the running controller and model
    console.log("AI CONTROLLER VERSION: model-check-2");
    console.log("GEMINI MODEL:", MODEL_NAME);

    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
    });

    // Call Gemini with retries for temporary errors
    let result;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        result = await model.generateContent(prompt);
        break;
      } catch (err) {
        console.error(`Gemini attempt ${attempt} failed:`, err.message);
        console.error("Status:", err.status);
        console.error("Cause:", err.cause);

        const isTemporary =
          err.status === 503 ||
          err.status === 429 ||
          err.message?.toLowerCase().includes("fetch failed") ||
          err.cause?.code === "ECONNRESET" ||
          err.cause?.code === "ETIMEDOUT";

        if (!isTemporary || attempt === MAX_RETRIES) {
          throw err;
        }

        await sleep(attempt * 2000);
      }
    }

    if (!result) {
      throw new Error("Gemini did not return a result.");
    }

    // Clean Gemini response
    let output = result.response.text()
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    console.log("Gemini response received.");

    // Parse JSON
    let parsed;

    try {
      parsed = JSON.parse(output);
    } catch (parseError) {
      console.error("Gemini returned invalid JSON.");
      return res.status(502).json({
        message: "Gemini returned an invalid response. Please retry.",
      });
    }

    // Normalize response
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
      output: JSON.stringify(parsed),
    });
  } catch (err) {
  console.error("=== GEMINI API ERROR ===");
  console.error("Message:", err.message);
  console.error("Status:", err.status);
  console.error("Status code:", err.statusCode);
  console.error("Error details:", err.errorDetails);

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "AI generation failed",
  });
}
};
