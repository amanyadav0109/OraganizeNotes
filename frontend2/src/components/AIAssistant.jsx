

import { useState } from "react";
import {
  FaRobot,
  FaTimes,
  FaArrowLeft,
  FaCopy,
  FaCrown,
} from "react-icons/fa";

import { generateAI } from "../services/aiService";

import SummaryView from "./SummaryView";
import InterviewView from "./InterviewView";
import MCQView from "./MCQView";

function AIAssistant({ text, closeModal }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedAction, setSelectedAction] = useState("");
  const [error, setError] = useState("");
  const [upgradeRequired, setUpgradeRequired] = useState(false);

  const actions = [
    {
      key: "summary",
      title: "📝 Summarize Notes",
      desc: "Short revision notes",
    },
    {
      key: "interview",
      title: "🎯 Generate Questions",
      desc: "Prepare for interviews",
    },
    {
      key: "mcq",
      title: "❓ MCQ Test",
      desc: "Practice with quiz",
    },
  ];

  const runAI = async (action) => {
    if (typeof text !== "string" || !text.trim()) {
      setError("This note is empty. Please add some content first.");
      return;
    }

    setLoading(true);
    setSelectedAction(action);
    setResult(null);
    setError("");
    setUpgradeRequired(false);

    try {
      // aiService.js must return the complete res.data object.
      const payload = await generateAI(action, text);

      if (!payload || typeof payload !== "object") {
        throw new Error("Invalid response received from the AI server.");
      }

      if (payload.success === false) {
        const apiError = new Error(
          payload.message || "AI generation failed."
        );

        apiError.upgradeRequired = payload.upgradeRequired;
        throw apiError;
      }

      const output =
        payload.result ??
        payload.output ??
        payload.data;

      if (
        output == null ||
        (typeof output !== "object" && typeof output !== "string")
      ) {
        throw new Error("The AI server returned no generated content.");
      }

      let parsedOutput = output;

      if (typeof output === "string") {
        try {
          parsedOutput = JSON.parse(output);
        } catch {
          throw new Error("The AI response is not valid JSON.");
        }
      }

      setResult(parsedOutput);
    } catch (err) {
      console.error("AI ASSISTANT ERROR:", err);

      const response = err.response?.data;
      const status = err.response?.status;

      if (response?.upgradeRequired || err.upgradeRequired) {
        setUpgradeRequired(true);
        setError(
          response?.message ||
            err.message ||
            "You have used all 5 free AI generations for today."
        );
      } else if (status === 429) {
        setError(
          response?.message ||
            "Gemini API quota exceeded. Please try again later."
        );
      } else if (status === 502 || status === 503) {
        setError(
          response?.message ||
            "The AI service failed or is busy. Please try again."
        );
      } else {
        setError(
          response?.message ||
            err.message ||
            "AI could not generate a response."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(
        JSON.stringify(result, null, 2)
      );
      alert("Copied successfully!");
    } catch {
      setError("Unable to copy. Please copy the response manually.");
    }
  };

  const resetAssistant = () => {
    setSelectedAction("");
    setResult(null);
    setError("");
    setUpgradeRequired(false);
  };

  const handleUpgrade = () => {
    setError(
      "Premium checkout is not connected yet. Payment verification must be implemented first."
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm sm:max-w-2xl lg:max-w-5xl xl:max-w-6xl h-[95vh] sm:h-[90vh] rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-slate-700 flex flex-col">
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 px-5 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl">
              <FaRobot className="text-white text-3xl" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">
                AI Study Assistant
              </h2>
              <p className="text-white/80 text-sm">
                Powered by Gemini AI
              </p>
            </div>
          </div>

          <button
            onClick={closeModal}
            aria-label="Close AI assistant"
            className="text-white text-2xl hover:rotate-90 transition"
          >
            <FaTimes />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {error && (
            <div
              role="alert"
              className={`mx-6 mt-6 rounded-xl border p-4 ${
                upgradeRequired
                  ? "bg-amber-100 dark:bg-amber-950 border-amber-300 dark:border-amber-700"
                  : "bg-red-100 dark:bg-red-950 border-red-300 dark:border-red-700"
              }`}
            >
              <p
                className={
                  upgradeRequired
                    ? "text-amber-800 dark:text-amber-200"
                    : "text-red-700 dark:text-red-300"
                }
              >
                {upgradeRequired ? "👑 " : "⚠️ "}
                {error}
              </p>

              {upgradeRequired && (
                <button
                  onClick={handleUpgrade}
                  className="mt-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2 rounded-xl flex items-center gap-2"
                >
                  <FaCrown />
                  Upgrade to Premium
                </button>
              )}
            </div>
          )}

          {!selectedAction ? (
            <div className="p-6 lg:p-8">
              <h2 className="text-2xl font-bold dark:text-white mb-8 text-center">
                Choose an AI Feature
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {actions.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => runAI(item.key)}
                    disabled={loading}
                    className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50"
                  >
                    <h3 className="text-xl font-bold dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-gray-500 dark:text-gray-400">
                      {item.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 lg:p-8">
              <div className="flex justify-between items-center mb-8">
                <button
                  onClick={resetAssistant}
                  disabled={loading}
                  className="flex items-center gap-2 text-blue-600 font-semibold hover:underline disabled:opacity-50"
                >
                  <FaArrowLeft />
                  Back
                </button>

                {!loading && result && (
                  <button
                    onClick={copy}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl flex items-center gap-2"
                  >
                    <FaCopy />
                    Copy
                  </button>
                )}
              </div>

              {loading ? (
                <div className="flex flex-col justify-center items-center py-24">
                  <div className="w-16 h-16 rounded-full border-4 border-purple-600 border-t-transparent animate-spin" />

                  <h2 className="text-2xl font-bold mt-8 dark:text-white">
                    🤖 AI is Generating...
                  </h2>

                  <p className="text-gray-500 mt-3 text-center">
                    Generating your response. Please wait.
                  </p>
                </div>
              ) : result ? (
                <>
                  {selectedAction === "summary" && (
                    <SummaryView data={result} />
                  )}

                  {selectedAction === "interview" && (
                    <InterviewView data={result} />
                  )}

                  {selectedAction === "mcq" && (
                    <MCQView data={result} />
                  )}
                </>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AIAssistant;
