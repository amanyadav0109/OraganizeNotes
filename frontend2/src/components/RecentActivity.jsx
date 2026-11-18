
import {
  BookOpen,
  Brain,
  ClipboardList,
  Clock,
  CheckCircle2,
  CircleX,
  Activity,
} from "lucide-react";

const getIcon = (type) => {
  switch (type) {
    case "practice":
      return Brain;
    case "test":
      return ClipboardList;
    default:
      return BookOpen;
  }
};

const formatActivityDate = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function RecentActivity({ activities = [] }) {
  return (
    <section className="w-full min-w-0 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-sm transition-colors duration-300">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5 sm:mb-6">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
            Recent Activity
          </h2>

          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Your latest learning activities
          </p>
        </div>

        <div className="shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-indigo-50 dark:bg-indigo-500/20 flex items-center justify-center">
          <Activity
            size={21}
            className="text-indigo-600 dark:text-indigo-400"
          />
        </div>
      </div>

      {/* Activity List */}
      {activities.length > 0 ? (
        <div className="max-h-[320px] sm:max-h-[380px] overflow-y-auto overflow-x-hidden space-y-2 sm:space-y-3 pr-1 sm:pr-2
          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-track]:bg-slate-100
          dark:[&::-webkit-scrollbar-track]:bg-slate-800
          [&::-webkit-scrollbar-thumb]:bg-slate-300
          dark:[&::-webkit-scrollbar-thumb]:bg-slate-600
          [&::-webkit-scrollbar-thumb]:rounded-full"
        >
          {activities.map((activity, index) => {
            const Icon = getIcon(activity.type);

            return (
              <div
                key={activity.id || index}
                className="flex items-start gap-3 p-3 sm:p-4 rounded-xl border border-transparent hover:border-gray-100 dark:hover:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/70 transition-all"
              >
                {/* Activity Icon */}
                <div className="shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Icon size={19} />
                </div>

                {/* Activity Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-800 dark:text-white break-words">
                    {activity.title || "Learning Activity"}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 break-words">
                    {activity.description || "Activity completed"}
                  </p>

                  {activity.date && (
                    <p className="text-[11px] sm:text-xs text-gray-400 dark:text-gray-500 mt-2 flex items-center gap-1.5 flex-wrap">
                      <Clock size={13} className="shrink-0" />
                      <span>
                        {formatActivityDate(activity.date)}
                      </span>
                    </p>
                  )}
                </div>

                {/* Activity Status */}
                {activity.type === "practice" && (
                  <div className="shrink-0 pt-1">
                    {activity.isCorrect ? (
                      <CheckCircle2
                        size={18}
                        className="text-green-500 dark:text-green-400"
                        title="Correct answer"
                      />
                    ) : (
                      <CircleX
                        size={18}
                        className="text-red-500 dark:text-red-400"
                        title="Incorrect answer"
                      />
                    )}
                  </div>
                )}

                {activity.type !== "practice" && activity.completed && (
                  <CheckCircle2
                    size={18}
                    className="shrink-0 text-green-500 dark:text-green-400"
                  />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center text-center py-8 sm:py-10 px-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50">
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center mb-3">
            <Clock
              size={27}
              className="text-indigo-500 dark:text-indigo-400"
            />
          </div>

          <p className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200">
            No recent activity yet
          </p>

          <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-1 max-w-xs">
            Start practicing questions and your learning activities will appear here.
          </p>
        </div>
      )}
    </section>
  );
}
