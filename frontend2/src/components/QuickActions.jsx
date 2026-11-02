
import {
  Plus,
  Brain,
  ClipboardList,
  CalendarDays,
  ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
   
    {
      title: "Practice",
      description: "Practice your topics",
      icon: Brain,
      color: "bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400",
      path: "/practice",
    },
    {
      title: "Mock Tests",
      description: "Test your knowledge",
      icon: ClipboardList,
      color: "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400",
      path: "/mock-tests",
    },
    {
      title: "Revision Plan",
      description: "Revise weak topics",
      icon: CalendarDays,
      color: "bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400",
      path: "/revision-plan",
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors duration-300">

      <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
        Quick Actions
      </h2>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
        What would you like to do today?
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              onClick={() => navigate(action.path)}
              className="flex items-center gap-3 text-left border border-gray-100 dark:border-slate-700 rounded-xl p-4 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/50 transition-colors duration-300"
            >
              <div className={`p-3 rounded-xl ${action.color}`}>
                <Icon size={21} />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  {action.title}
                </h3>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {action.description}
                </p>
              </div>

              <ArrowUpRight
                size={17}
                className="text-gray-400 dark:text-gray-500"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
