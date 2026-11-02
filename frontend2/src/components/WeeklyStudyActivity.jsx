
import { BarChart3 } from "lucide-react";

const defaultData = [
  { day: "Mon", hours: 0 },
  { day: "Tue", hours: 0 },
  { day: "Wed", hours: 0 },
  { day: "Thu", hours: 0 },
  { day: "Fri", hours: 0 },
  { day: "Sat", hours: 0 },
  { day: "Sun", hours: 0 },
];

export default function WeeklyStudyActivity({ data = defaultData }) {
  const maxHours = Math.max(
    1,
    ...data.map((item) => item.hours || 0)
  );

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors duration-300">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">
            Weekly Study Activity
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Your study hours this week
          </p>
        </div>

        <div className="p-3 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
          <BarChart3 size={22} />
        </div>
      </div>

      <div className="h-48 flex items-end justify-between gap-2">
        {data.map((item, index) => {
          const height =
            item.hours > 0
              ? (item.hours / maxHours) * 100
              : 3;

          return (
            <div
              key={item.day || index}
              className="flex-1 h-full flex flex-col justify-end items-center gap-2"
            >
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {item.hours || 0}h
              </span>

              <div className="w-full max-w-10 h-full flex items-end">
                <div
                  className="w-full bg-indigo-500 dark:bg-indigo-400 rounded-t-lg hover:bg-indigo-600 dark:hover:bg-indigo-300 transition-colors"
                  style={{ height: `${height}%` }}
                  title={`${item.hours || 0} hours`}
                />
              </div>

              <span className="text-xs text-gray-500 dark:text-gray-400">
                {item.day}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
}
