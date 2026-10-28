
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
import SubscriptionModal from "./SubscriptionModal";

function AIAssistant({ text, closeModal }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedAction, setSelectedAction] = useState("");
  const [error, setError] = useState("");
  const [upgradeRequired, setUpgradeRequired] = useState(false);

  const [showSubscription, setShowSubscription] = useState(false);
  const [premiumActive, setPremiumActive] = useState(false);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);

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

  // AI GENERATION
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
    setSubscriptionSuccess(false);

    try {
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

      const output = payload.result ?? payload.output ?? payload.data;

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

  // COPY RESULT
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

  // RESET / BACK
  const resetAssistant = () => {
    setSelectedAction("");
    setResult(null);
    setError("");
    setUpgradeRequired(false);
  };

  // OPEN SUBSCRIPTION
  const handleUpgrade = () => {
    setShowSubscription(true);
  };

  // CALLED AFTER SUCCESSFUL PAYMENT VERIFICATION
  const handleSubscriptionSuccess = () => {
    setPremiumActive(true);
    setSubscriptionSuccess(true);
    setUpgradeRequired(false);
    setError("");
    setShowSubscription(false);
    setSelectedAction("");
    setResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <div className="flex h-[95vh] w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:h-[90vh] sm:max-w-2xl lg:max-w-5xl lg:rounded-3xl xl:max-w-6xl">

        {/* HEADER */}
        <div className="flex items-center justify-between bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 px-5 py-5">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-white/20 p-3">
              <FaRobot className="text-3xl text-white" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">
                AI Study Assistant
              </h2>
              <p className="text-sm text-white/80">
                Powered by Gemini AI
              </p>
            </div>
          </div>

          <button
            onClick={closeModal}
            aria-label="Close AI assistant"
            className="text-2xl text-white transition hover:rotate-90"
          >
            <FaTimes />
          </button>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 overflow-y-auto">

          {/* PAYMENT SUCCESS MESSAGE */}
          {subscriptionSuccess && (
            <div
              role="status"
              className="mx-6 mt-6 rounded-xl border border-green-300 bg-green-100 p-4 dark:border-green-700 dark:bg-green-950"
            >
              <p className="font-bold text-green-800 dark:text-green-200">
                👑 Premium Activated Successfully!
              </p>
              <p className="mt-1 text-green-700 dark:text-green-300">
                Ab aap AI features use kar sakte ho. Neeche se koi
                feature select karein.
              </p>
            </div>
          )}

          {/* PREMIUM STATUS */}
          {premiumActive && (
            <div className="mx-6 mt-4 flex items-center gap-2 rounded-xl border border-green-300 bg-green-50 p-3 font-semibold text-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-200">
              <FaCrown />
              Premium Active
            </div>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <div
              role="alert"
              className={`mx-6 mt-6 rounded-xl border p-4 ${
                upgradeRequired
                  ? "border-amber-300 bg-amber-100 dark:border-amber-700 dark:bg-amber-950"
                  : "border-red-300 bg-red-100 dark:border-red-700 dark:bg-red-950"
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
                premiumActive ? (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2 font-semibold text-white">
                    <FaCrown />
                    Premium Active
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleUpgrade}
                    className="mt-4 flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2 font-semibold text-white hover:bg-amber-600"
                  >
                    <FaCrown />
                    Upgrade to Premium
                  </button>
                )
              )}
            </div>
          )}

          {/* FEATURE SELECTION */}
          {!selectedAction ? (
            <div className="p-6 lg:p-8">
              <h2 className="mb-8 text-center text-2xl font-bold dark:text-white">
                Choose an AI Feature
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {actions.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => runAI(item.key)}
                    disabled={loading}
                    className="rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800"
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
            /* AI RESULT */
            <div className="p-6 lg:p-8">
              <div className="mb-8 flex items-center justify-between">
                <button
                  onClick={resetAssistant}
                  disabled={loading}
                  className="flex items-center gap-2 font-semibold text-blue-600 hover:underline disabled:opacity-50"
                >
                  <FaArrowLeft />
                  Back
                </button>

                {!loading && result && (
                  <button
                    onClick={copy}
                    className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2 text-white hover:bg-green-700"
                  >
                    <FaCopy />
                    Copy
                  </button>
                )}
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-24">
                  <div className="h-16 w-16 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
                  <h2 className="mt-8 text-2xl font-bold dark:text-white">
                    🤖 AI is Generating...
                  </h2>
                  <p className="mt-3 text-center text-gray-500">
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

      {/* SUBSCRIPTION MODAL */}
      {showSubscription && (
        <SubscriptionModal
          closeModal={() => setShowSubscription(false)}
          onSuccess={handleSubscriptionSuccess}
        />
      )}
    </div>
  );
}

export default AIAssistant;
