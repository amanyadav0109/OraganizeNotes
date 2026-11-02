
import {
  BookOpen,
  Brain,
  ClipboardList,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function RecentActivity({ activities = [] }) {
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

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors duration-300">

      <div className="mb-5">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
          Recent Activity
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Your latest learning activities
        </p>
      </div>

      {activities.length > 0 ? (
        <div className="space-y-4 max-h-80 overflow-y-auto">

          {activities.map((activity, index) => {
            const Icon = getIcon(activity.type);

            return (
              <div
                key={activity.id || index}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                  <Icon size={20} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-gray-800 dark:text-white">
                    {activity.title}
                  </h3>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {activity.description || "Activity completed"}
                  </p>

                  {activity.date && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 flex items-center gap-1">
                      <Clock size={13} />
                      {activity.date}
                    </p>
                  )}
                </div>

                {activity.completed && (
                  <CheckCircle2
                    size={18}
                    className="text-green-500 dark:text-green-400"
                  />
                )}
              </div>
            );
          })}

        </div>
      ) : (
        <div className="text-center py-8">
          <Clock
            size={35}
            className="mx-auto mb-3 text-gray-400 dark:text-gray-500"
          />

          <p className="text-gray-600 dark:text-gray-300">
            No recent activity yet.
          </p>

          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Your learning activities will appear here.
          </p>
        </div>
      )}

    </div>
  );
}
