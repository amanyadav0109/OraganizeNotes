
import { Target, TrendingUp } from "lucide-react";

export default function StudyProgress({
  completed = 0,
  total = 0,
  title = "Study Progress",
}) {
  const percentage =
    total > 0
      ? Math.min(100, Math.round((completed / total) * 100))
      : 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors duration-300">

      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">
            {title}
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Keep moving towards your goals
          </p>
        </div>

        <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
          <Target size={23} />
        </div>
      </div>

      <div className="flex items-end justify-between mb-2">
        <span className="text-3xl font-bold text-gray-800 dark:text-white">
          {percentage}%
        </span>

        <span className="text-sm text-gray-500 dark:text-gray-400">
          {completed} / {total} completed
        </span>
      </div>

      <div className="w-full h-3 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center gap-2 mt-4 text-sm text-green-600 dark:text-green-400">
        <TrendingUp size={17} />
        <span>Every small step counts!</span>
      </div>

    </div>
  );
}
