
import {
  Trophy,
  CheckCircle2,
  XCircle,
  CircleHelp,
  RotateCcw
} from "lucide-react";

export default function ResultScreen({
  result,
  test,
   onBack,
  onReview
}) {
  const percentage = result.total > 0
    ? Math.round((result.correct / result.total) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-3xl  mt-2.5 rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-slate-700 dark:bg-slate-900 sm:p-10">
      <Trophy
        size={55}
        className="mx-auto text-yellow-500"
      />

      <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
        Test Completed!
      </h2>

      <p className="mt-2 text-gray-500 dark:text-gray-400">
        {test?.title || "Mock Test"} - Your Result
      </p>

      <div className="mx-auto mt-8 flex h-36 w-36 flex-col items-center justify-center rounded-full border-8 border-blue-500">
        <span className="text-4xl font-bold text-gray-900 dark:text-white">
          {percentage}%
        </span>
        <span className="text-sm text-gray-500">Score</span>
      </div>

      <div className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl bg-green-50 p-4 dark:bg-green-950/30">
          <CheckCircle2 className="mx-auto text-green-600" />
          <p className="mt-2 text-2xl font-bold text-green-600">
            {result.correct}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Correct
          </p>
        </div>

        <div className="rounded-xl bg-red-50 p-4 dark:bg-red-950/30">
          <XCircle className="mx-auto text-red-600" />
          <p className="mt-2 text-2xl font-bold text-red-600">
            {result.incorrect}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Incorrect
          </p>
        </div>

        <div className="rounded-xl bg-yellow-50 p-4 dark:bg-yellow-950/30">
          <CircleHelp className="mx-auto text-yellow-600" />
          <p className="mt-2 text-2xl font-bold text-yellow-600">
            {result.unanswered}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Unanswered
          </p>
        </div>

        <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-950/30">
          <Trophy className="mx-auto text-blue-600" />
          <p className="mt-2 text-2xl font-bold text-blue-600">
            {result.total}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Total
          </p>
        </div>
      </div>

      <p className="mt-7 text-gray-600 dark:text-gray-300">
        {percentage >= 80
          ? "Excellent work! Keep it up."
          : percentage >= 50
          ? "Good effort! Keep practicing."
          : "Keep learning and try again."}
      </p>
       <button
  onClick={onReview}
  className="mt-8 mr-2 inline-flex items-center gap-2 rounded-xl border border-blue-600 px-7 py-3 font-semibold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
>
  Review Answers
</button>
      <button
        onClick={onBack}
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700"
      >
        <RotateCcw size={18} />
        Back to Mock Tests
      </button>
    </div>
  );
}
