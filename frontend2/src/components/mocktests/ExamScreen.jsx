
import { useEffect, useState } from "react";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  Send,
  CheckCircle2,
  Circle,
  AlertCircle
} from "lucide-react";

const fallbackQuestions = [
  {
    id: 1,
    question: {
      English: "Which of the following is a correct option?",
      Hindi: "निम्नलिखित में से कौन सा सही विकल्प है?"
    },
    options: {
      English: ["Option A", "Option B", "Option C", "Option D"],
      Hindi: ["विकल्प A", "विकल्प B", "विकल्प C", "विकल्प D"]
    },
    answer: 0,
    explanation: {
      English: "This is a sample demo question.",
      Hindi: "यह एक नमूना प्रश्न है।"
    }
  }
];

export default function ExamScreen({
  test,
  questions,
  language,
  onSubmit
}) {
  const examQuestions =
    questions?.length > 0 ? questions : fallbackQuestions;

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

  const currentQuestion = examQuestions[currentIndex];
  const totalQuestions = examQuestions.length;

  const answeredCount = Object.keys(answers).length;
  const markedCount = marked.length;
  const unansweredCount = totalQuestions - answeredCount;

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

  const selectAnswer = (optionIndex) => {
    if (submitted) return;

    setAnswers((previous) => ({
      ...previous,
      [currentQuestion.id]: optionIndex
    }));
  };

  const toggleMark = () => {
    setMarked((previous) =>
      previous.includes(currentQuestion.id)
        ? previous.filter((id) => id !== currentQuestion.id)
        : [...previous, currentQuestion.id]
    );
  };

  const finishTest = () => {
    if (submitted) return;

    setSubmitted(true);

    let correct = 0;

    examQuestions.forEach((question) => {
      if (answers[question.id] === question.answer) {
        correct++;
      }
    });

    const incorrect = answeredCount - correct;
    const unanswered = totalQuestions - answeredCount;

    onSubmit({
      answers,
      correct,
      incorrect,
      unanswered,
      total: totalQuestions,
      questions: examQuestions,
      language
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
    }
  };

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

      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        {/* Question section */}
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
            {currentQuestion.question[language] ||
              currentQuestion.question.English}
          </h3>

          <div className="mt-7 space-y-3">
            {currentQuestion.options[language]?.map(
              (option, index) => {
                const selected =
                  answers[currentQuestion.id] === index;

                return (
                  <button
                    key={index}
                    onClick={() => selectAnswer(index)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${
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
                  </button>
                );
              }
            )}
          </div>

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

        {/* Question palette */}
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

      {/* Submit confirmation */}
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

