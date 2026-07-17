import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateAI = async (req, res) => {
  try {
    const { action, text } = req.body;
  if (!text || text.trim() === "") {

  let response = {};

  switch (action) {

    case "summary":
      response = {
        title: "Summary",
        points: []
      };
      break;

    case "interview":
      response = {
        title: "Interview Questions",
        questions: []
      };
      break;

    case "mcq":
      response = {
        title: "MCQ Test",
        questions: []
      };
      break;

    default:
      response = {};
  }

  return res.json({
    output: JSON.stringify(response)
  });
}

    let prompt = "";

    switch (action) {
      case "summary":
       prompt = `
You are an expert study assistant.

Generate a study summary using ONLY the notes provided.

Do NOT invent topics that are not mentioned in the notes.

If the notes are short, summarize whatever information is available.

If there is little information, generate fewer summary points.

Never return an error message.

Always return ONLY valid JSON in this format:

{
  "title": "Summary",
  "points": [
    {
      "heading": "",
      "description": ""
    }
  ]
}

Rules:
- Return only JSON.
- Do not use markdown.
- Do not use \`\`\`.
- Do not explain anything outside the JSON.
- Generate between 3 and 8 summary points depending on the amount of information.

Notes:

${text}
`;
        break;

      case "interview":
  prompt = `
You are an expert technical interviewer.

Generate interview questions ONLY from the notes provided.

Do NOT invent concepts that are not present in the notes.

If the notes are short, generate as many meaningful questions as possible.

Never return an error.

Always return ONLY valid JSON in this format:

{
  "title": "Interview Questions",
  "questions": [
    ""
  ]
}

Rules:
- Return ONLY JSON.
- Do not use markdown.
- Do not use \`\`\`.
- Do not explain anything outside the JSON.
- Generate between 3 and 10 questions depending on the amount of information.
- Questions should be suitable for technical interviews.
- Avoid duplicate questions.

Notes:

${text}
`;
break;   

    case "mcq":
  prompt = `
You are an expert teacher.

Create multiple-choice questions (MCQs) ONLY from the notes provided.

Every question and answer MUST be directly supported by the notes.

Do NOT invent facts.

If the notes contain only one topic, create multiple MCQs from that topic.

Never return an error.

Always return ONLY valid JSON in this format:

{
  "title": "MCQ Test",
  "questions": [
    {
      "question": "",
      "options": [
        "",
        "",
        "",
        ""
      ],
      "answer": 0,
      "explanation": ""
    }
  ]
}

Rules:
- Return ONLY JSON.
- Do not use markdown.
- Do not use \`\`\`.
- Generate between 3 and 5 MCQs depending on the amount of information.
- Each question must have exactly 4 options.
- Only ONE option must be correct.
- "answer" must be 0, 1, 2, or 3.
- "explanation" should briefly explain why the answer is correct.
- Do not create duplicate questions.
- Do not create options unrelated to the notes.

Notes:

${text}
`;
break;
      default:
        prompt = text;
    }

    // Create Gemini model
// ---------------- GEMINI ----------------

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

let result;

const MAX_RETRIES = 3;

for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
  try {
    result = await model.generateContent(prompt);
    break;
  } catch (err) {
    if (err.status === 503 && attempt < MAX_RETRIES) {
      console.log(
        `Gemini busy. Retry ${attempt}/${MAX_RETRIES}...`
      );

      await new Promise((resolve) =>
        setTimeout(resolve, attempt * 2000)
      );
    } else {
      throw err;
    }
  }
}

if (!result) {
  return res.status(500).json({
    message: "Unable to generate AI response."
  });
}

// ---------------- CLEAN RESPONSE ----------------

let output = result.response.text();

output = output
  .replace(/```json/gi, "")
  .replace(/```/g, "")
  .trim();

console.log("========== GEMINI OUTPUT ==========");
console.log(output);

// ---------------- PARSE JSON ----------------

let parsed;

try {
  parsed = JSON.parse(output);
} catch (e) {
  console.log("Invalid JSON Returned:");
  console.log(output);

  return res.status(500).json({
    message: "Gemini returned invalid JSON."
  });
}

// ---------------- NORMALIZE RESPONSE ----------------

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
      ? parsed.questions
      : [];

    parsed.questions = parsed.questions.map((q) => ({

      question: q.question || "",

      options:
        Array.isArray(q.options) && q.options.length === 4
          ? q.options
          : ["Option A", "Option B", "Option C", "Option D"],

      answer:
        typeof q.answer === "number"
          ? q.answer
          : 0,

      explanation:
        q.explanation || ""

    }));

    break;

  default:
    break;
}

// ---------------- SEND ----------------

return res.json({
  output: JSON.stringify(parsed)
});

} catch (err) {

console.error("=========== AI ERROR ===========");
console.error(err);

if (err.status === 503) {
  return res.status(503).json({
    message:
      "Gemini AI is currently busy. Please try again in a few seconds."
  });
}

if (
  err.message &&
  err.message.toLowerCase().includes("api key")
) {
  return res.status(500).json({
    message: "Invalid Gemini API Key."
  });
}

return res.status(500).json({
  message: err.message || "Unknown AI Error"
});

}
};