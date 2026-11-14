
import {
  Trophy,
  CheckCircle2,
  XCircle,
  CircleHelp,
  RotateCcw,
  ClipboardCheck,
} from "lucide-react";

export default function ResultScreen({
  result,
  test,
  onBack,
  onReview,
}) {
  const correct = Number(result?.correct) || 0;
  const incorrect = Number(result?.incorrect) || 0;
  const unanswered = Number(result?.unanswered) || 0;
  const total = Number(result?.total) || 0;

  const totalMarks =
    Number(result?.totalMarks) ||
    Number(test?.total_marks) ||
    total;

  const obtainedMarks =
    Number(result?.obtainedMarks) || 0;

  const percentage =
    totalMarks > 0
      ? Math.round((obtainedMarks / totalMarks) * 100)
      : 0;

  return (
    <div className="mx-auto mt-3 max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-slate-700 dark:bg-slate-900 sm:p-10">

      <Trophy size={55} className="mx-auto text-yellow-500" />

      <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
        Test Completed!
      </h2>

      <p className="mt-2 text-gray-500 dark:text-gray-400">
        {test?.title || "Mock Test"} - Your Result
      </p>

      {/* Percentage */}
      <div className="mx-auto mt-8 flex h-36 w-36 flex-col items-center justify-center rounded-full border-8 border-blue-500">
        <span className="text-4xl font-bold text-gray-900 dark:text-white">
          {percentage}%
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Score
        </span>
      </div>

      {/* Marks */}
      <div className="mt-5 rounded-xl bg-blue-50 p-4 dark:bg-blue-950/30">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Marks Obtained
        </p>
        <p className="mt-1 text-2xl font-bold text-blue-700 dark:text-blue-300">
          {obtainedMarks} / {totalMarks}
        </p>
      </div>

      {/* Statistics */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">

        <div className="rounded-xl bg-green-50 p-4 dark:bg-green-950/30">
          <CheckCircle2 className="mx-auto text-green-600" />
          <p className="mt-2 text-2xl font-bold text-green-600">
            {correct}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Correct
          </p>
        </div>

        <div className="rounded-xl bg-red-50 p-4 dark:bg-red-950/30">
          <XCircle className="mx-auto text-red-600" />
          <p className="mt-2 text-2xl font-bold text-red-600">
            {incorrect}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Incorrect
          </p>
        </div>

        <div className="rounded-xl bg-yellow-50 p-4 dark:bg-yellow-950/30">
          <CircleHelp className="mx-auto text-yellow-600" />
          <p className="mt-2 text-2xl font-bold text-yellow-600">
            {unanswered}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Unanswered
          </p>
        </div>

        <div className="rounded-xl bg-gray-100 p-4 dark:bg-slate-800">
          <ClipboardCheck className="mx-auto text-gray-600 dark:text-gray-300" />
          <p className="mt-2 text-2xl font-bold text-gray-700 dark:text-white">
            {total}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Total Questions
          </p>
        </div>

      </div>

      {/* Feedback */}
      <p className="mt-7 font-medium text-gray-600 dark:text-gray-300">
        {percentage >= 80
          ? "Excellent work! Keep it up."
          : percentage >= 50
          ? "Good effort! Keep practicing."
          : "Keep learning and try again."}
      </p>

      {/* Actions */}
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

        <button
          onClick={onReview}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-600 px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-50 dark:hover:bg-blue-950/30"
        >
          <ClipboardCheck size={18} />
          Review Answers
        </button>

        <button
          onClick={onBack}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          <RotateCcw size={18} />
          Back to Mock Tests
        </button>

      </div>
    </div>
  );
}
