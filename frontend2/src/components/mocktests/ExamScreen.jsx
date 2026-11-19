

import { useEffect, useRef, useState } from "react";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  Send,
  CheckCircle2,
  Circle,
  AlertCircle,
  Crown,
  X,
} from "lucide-react";

const API_URL = (
  import.meta.env.VITE_SERVER_URL || "http://localhost:5000"
).replace(/\/$/, "");

// Convert database questions into ExamScreen format
const normalizeQuestions = (questions = []) => {
  return questions.map((item) => {
    const answerMap = {
      A: 0,
      B: 1,
      C: 2,
      D: 3,
    };

    return {
      id: item.id,
      question: {
        English: item.question || "",
        Hindi: item.question_hindi || item.question || "",
      },
      options: {
        English: [
          item.option_a || "",
          item.option_b || "",
          item.option_c || "",
          item.option_d || "",
        ],
        Hindi: [
          item.option_a_hindi || item.option_a || "",
          item.option_b_hindi || item.option_b || "",
          item.option_c_hindi || item.option_c || "",
          item.option_d_hindi || item.option_d || "",
        ],
      },
      answer:
        typeof item.answer === "number"
          ? item.answer
          : answerMap[item.correct_answer] ?? 0,
      explanation: {
        English: item.explanation || "",
        Hindi: item.explanation_hindi || item.explanation || "",
      },
      marks: Number(item.marks) || 1,
    };
  });
};

export default function ExamScreen({
  test,
  questions = [],
  language,
  sessionId,
  onSubmit,
  onUpgrade,
}) {
  const examQuestions = normalizeQuestions(questions);

  const duration = Math.max(
    1,
    Number(test?.duration) || 30
  );

  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState([]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Mock Test attempt limit states
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [attemptInfo, setAttemptInfo] = useState({
    used: 0,
    remaining: 10,
    isPremium: false,
  });

  const [pendingQuestionId, setPendingQuestionId] = useState(null);
  const [answerError, setAnswerError] = useState("");

  // Store successfully attempted questions for this session
  const attemptedQuestionIds = useRef(new Set());

  // Prevent duplicate API requests
  const pendingQuestionIds = useRef(new Set());

  const currentQuestion = examQuestions[currentIndex];
  const totalQuestions = examQuestions.length;

  const answeredCount = Object.keys(answers).length;
  const markedCount = marked.length;
  const unansweredCount = totalQuestions - answeredCount;

  // Reset tracking when a new exam session starts
  useEffect(() => {
    attemptedQuestionIds.current = new Set();
    pendingQuestionIds.current = new Set();
  }, [sessionId]);

  // Timer
  useEffect(() => {
    if (submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted]);

  useEffect(() => {
    if (timeLeft === 0 && !submitted) {
      finishTest();
    }
  }, [timeLeft, submitted]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  // Record an attempt before accepting the first answer
  const selectAnswer = async (optionIndex) => {
    if (submitted || !currentQuestion) return;

    const questionId = currentQuestion.id;

    // If this question was already attempted in this session,
    // changing the option will NOT consume another attempt.
    if (attemptedQuestionIds.current.has(questionId)) {
      setAnswers((previous) => ({
        ...previous,
        [questionId]: optionIndex,
      }));

      setAnswerError("");
      return;
    }

    // Prevent duplicate clicks while API request is running
    if (pendingQuestionIds.current.has(questionId)) return;

    if (!sessionId || !test?.id) {
      setAnswerError("Exam session is invalid. Please restart the test.");
      return;
    }

    pendingQuestionIds.current.add(questionId);
    setPendingQuestionId(questionId);
    setAnswerError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login again to continue.");
      }

      const response = await fetch(
        `${API_URL}/api/mock-tests/attempts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            test_set_id: test.id,
            question_id: questionId,
            session_id: sessionId,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      // Free user has already used 10 attempts
      if (
        response.status === 403 &&
        data.code === "MOCK_TEST_LIMIT_REACHED"
      ) {
        setLimitReached(true);

        setAttemptInfo({
          used: data.used ?? 10,
          remaining: data.remaining ?? 0,
          isPremium: false,
        });

        setShowLimitModal(true);
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to record your answer."
        );
      }

      // Mark question as attempted for this session
      attemptedQuestionIds.current.add(questionId);

      setAttemptInfo({
        used: data.used ?? attemptInfo.used,
        remaining: data.remaining ?? attemptInfo.remaining,
        isPremium: Boolean(data.isPremium),
      });

      // Accept answer only after backend confirms the attempt
      setAnswers((previous) => ({
        ...previous,
        [questionId]: optionIndex,
      }));
    } catch (error) {
      console.error("MOCK TEST ATTEMPT ERROR:", error);

      setAnswerError(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      pendingQuestionIds.current.delete(questionId);
      setPendingQuestionId(null);
    }
  };

  const toggleMark = () => {
    if (!currentQuestion || submitted) return;

    setMarked((previous) =>
      previous.includes(currentQuestion.id)
        ? previous.filter((id) => id !== currentQuestion.id)
        : [...previous, currentQuestion.id]
    );
  };

  const finishTest = () => {
    if (submitted) return;

    setSubmitted(true);
    setShowSubmitModal(false);
    setShowLimitModal(false);

    let correct = 0;
    let incorrect = 0;

    examQuestions.forEach((question) => {
      if (answers[question.id] === undefined) return;

      if (answers[question.id] === question.answer) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const unanswered = totalQuestions - answeredCount;

    const totalMarks = examQuestions.reduce(
      (sum, question) => sum + question.marks,
      0
    );

    const obtainedMarks = examQuestions.reduce(
      (sum, question) => {
        if (answers[question.id] === question.answer) {
          return sum + question.marks;
        }

        return sum;
      },
      0
    );

    onSubmit({
      answers,
      correct,
      incorrect,
      unanswered,
      total: totalQuestions,
      totalMarks,
      obtainedMarks,
      questions: examQuestions,
      language,
    });
  };

  const getQuestionStatus = (question) => {
    if (marked.includes(question.id)) return "marked";
    if (answers[question.id] !== undefined) return "answered";
    return "unanswered";
  };

  const goToQuestion = (index) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentIndex(index);
      setAnswerError("");
    }
  };

  // No fallback/demo questions
  if (totalQuestions === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
        <AlertCircle
          size={40}
          className="mx-auto text-orange-500"
        />

        <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
          No Questions Available
        </h3>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          No questions have been added to this test yet.
        </p>
      </div>
    );
  }

  const questionText =
    currentQuestion.question[language] ||
    currentQuestion.question.English;

  const currentOptions =
    currentQuestion.options[language] ||
    currentQuestion.options.English;

  return (
    <div className="mx-auto max-w-7xl space-y-5 pb-10">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {test?.title || "Mock Test"}
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {language} • {totalQuestions} Questions
          </p>
        </div>

        <div
          className={`flex items-center gap-2 rounded-xl px-4 py-3 font-bold ${
            timeLeft <= 60
              ? "bg-red-100 text-red-600"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          <Clock size={20} />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Attempt Usage */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
        <div>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            Mock Test Attempts
          </p>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {attemptInfo.isPremium
              ? "Premium: Unlimited attempts"
              : `${attemptInfo.used}/10 attempts used in the last 24 hours`}
          </p>
        </div>

        {attemptInfo.isPremium ? (
          <span className="flex items-center gap-1 rounded-lg bg-purple-100 px-3 py-2 text-sm font-semibold text-purple-700">
            <Crown size={16} />
            Premium
          </span>
        ) : (
          <span
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${
              attemptInfo.remaining === 0
                ? "bg-red-100 text-red-600"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {attemptInfo.remaining} remaining
          </span>
        )}
      </div>

      {limitReached && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-orange-300 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950/30">
          <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
            You have reached your 10 Mock Test attempts. You can still review and submit your current test.
          </p>

          <button
            onClick={onUpgrade}
            className="shrink-0 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
          >
            Upgrade
          </button>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">

        {/* Question Section */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900 sm:p-7">

          <div className="flex items-center justify-between gap-3">
            <span className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-700">
              Question {currentIndex + 1} of {totalQuestions}
            </span>

            <button
              onClick={toggleMark}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${
                marked.includes(currentQuestion.id)
                  ? "border-orange-400 bg-orange-50 text-orange-600"
                  : "border-gray-300 text-gray-600 dark:border-slate-600 dark:text-gray-300"
              }`}
            >
              <Flag size={16} />
              {marked.includes(currentQuestion.id)
                ? "Marked"
                : "Mark for Review"}
            </button>
          </div>

          <h3 className="mt-8 text-lg font-semibold leading-8 text-gray-900 dark:text-white">
            {questionText}
          </h3>

          <div className="mt-7 space-y-3">
            {currentOptions.map((option, index) => {
              const selected =
                answers[currentQuestion.id] === index;

              const isPending =
                pendingQuestionId === currentQuestion.id;

              return (
                <button
                  key={index}
                  onClick={() => selectAnswer(index)}
                  disabled={submitted || isPending}
                  className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition disabled:cursor-wait ${
                    selected
                      ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                      : "border-gray-200 text-gray-700 hover:border-blue-300 dark:border-slate-700 dark:text-gray-200"
                  }`}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold">
                    {String.fromCharCode(65 + index)}
                  </span>

                  <span>{option}</span>

                  {selected && (
                    <CheckCircle2
                      className="ml-auto"
                      size={20}
                    />
                  )}

                  {isPending && !selected && index === 0 && (
                    <span className="ml-auto text-xs text-blue-600">
                      Saving...
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {answerError && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
              {answerError}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-10 flex flex-wrap justify-between gap-3 border-t border-gray-200 pt-5 dark:border-slate-700">

            <button
              onClick={() => goToQuestion(currentIndex - 1)}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-gray-200"
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            {currentIndex < totalQuestions - 1 ? (
              <button
                onClick={() => goToQuestion(currentIndex + 1)}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Next
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
              >
                Submit Test
                <Send size={17} />
              </button>
            )}
          </div>
        </div>

        {/* Question Palette */}
        <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">

          <h3 className="font-bold text-gray-900 dark:text-white">
            Question Palette
          </h3>

          <div className="mt-4 grid grid-cols-5 gap-2">
            {examQuestions.map((question, index) => {
              const status = getQuestionStatus(question);

              return (
                <button
                  key={question.id}
                  onClick={() => goToQuestion(index)}
                  className={`h-10 rounded-lg border text-sm font-semibold ${
                    currentIndex === index
                      ? "border-blue-600 bg-blue-600 text-white"
                      : status === "marked"
                      ? "border-orange-400 bg-orange-100 text-orange-700"
                      : status === "answered"
                      ? "border-green-500 bg-green-100 text-green-700"
                      : "border-gray-300 bg-gray-50 text-gray-600 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          <div className="mt-6 space-y-3 border-t border-gray-200 pt-5 text-sm dark:border-slate-700">

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Circle size={13} className="fill-green-500 text-green-500" />
                Answered
              </span>
              <strong>{answeredCount}</strong>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Circle size={13} className="text-gray-400" />
                Not Answered
              </span>
              <strong>{unansweredCount}</strong>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Flag size={14} className="text-orange-500" />
                Marked
              </span>
              <strong>{markedCount}</strong>
            </div>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700"
          >
            Submit Test
            <Send size={17} />
          </button>
        </aside>
      </div>

      {/* Attempt Limit Modal */}
      {showLimitModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">

            <button
              onClick={() => setShowLimitModal(false)}
              className="absolute right-4 top-4 rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              <X size={20} />
            </button>

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <AlertCircle size={34} />
            </div>

            <h3 className="mt-5 text-center text-xl font-bold text-gray-900 dark:text-white">
              Daily Attempt Limit Reached
            </h3>

            <p className="mt-3 text-center text-sm leading-6 text-gray-600 dark:text-gray-300">
              You have used all 10 free Mock Test question attempts in the last 24 hours.
              Upgrade to Premium to get unlimited attempts.
            </p>

            <div className="mt-5 rounded-xl bg-gray-100 p-4 text-center dark:bg-slate-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your usage
              </p>

              <p className="mt-1 text-2xl font-bold text-orange-600">
                {attemptInfo.used}/10
              </p>
            </div>

            <button
              onClick={onUpgrade}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700"
            >
              <Crown size={18} />
              Upgrade to Premium
            </button>

            <button
              onClick={() => setShowLimitModal(false)}
              className="mt-3 w-full rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 dark:border-slate-600 dark:text-gray-200"
            >
              Continue Current Test
            </button>

          </div>
        </div>
      )}

      {/* Submit Confirmation */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">

            <AlertCircle
              size={40}
              className="mx-auto text-orange-500"
            />

            <h3 className="mt-4 text-center text-xl font-bold text-gray-900 dark:text-white">
              Submit Your Test?
            </h3>

            <p className="mt-3 text-center text-sm text-gray-500 dark:text-gray-400">
              You have answered {answeredCount} out of{" "}
              {totalQuestions} questions. Are you sure you want
              to submit?
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-700 dark:border-slate-600 dark:text-gray-200"
              >
                Continue Test
              </button>

              <button
                onClick={finishTest}
                className="flex-1 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
