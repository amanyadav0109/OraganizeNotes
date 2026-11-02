
import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  Circle,
  Clock3,
  ListTodo,
  RefreshCw,
  Target,
} from "lucide-react";
import { getReminders } from "../services/reminderService";
import { completeTask } from "../services/noteService";

function TodayTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState(null);

  const loadTasks = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);

      const data = await getReminders();
      const today = new Date();

      const todayTasks = data.filter((task) => {
        if (!task.dueDate) return false;

        const dueDate = new Date(task.dueDate);

        return (
          !Number.isNaN(dueDate.getTime()) &&
          dueDate.getFullYear() === today.getFullYear() &&
          dueDate.getMonth() === today.getMonth() &&
          dueDate.getDate() === today.getDate()
        );
      });

      todayTasks.sort((a, b) => {
        if (a.isCompleted !== b.isCompleted) {
          return a.isCompleted ? 1 : -1;
        }

        return new Date(a.dueDate) - new Date(b.dueDate);
      });

      setTasks(todayTasks);
    } catch (error) {
      console.error("TODAY TASKS ERROR:", error);
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleComplete = async (id) => {
    try {
      setCompletingId(id);
      await completeTask(id);
      await loadTasks(false);
    } catch (error) {
      console.error("COMPLETE TASK ERROR:", error);
    } finally {
      setCompletingId(null);
    }
  };

  const completedCount = tasks.filter(
    (task) => task.isCompleted
  ).length;

  const totalTasks = tasks.length;
  const pendingCount = totalTasks - completedCount;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedCount / totalTasks) * 100);

  return (
    <section className="
      w-full min-w-0
      h-[480px] sm:h-[500px] lg:h-[520px]
      overflow-hidden
      rounded-2xl lg:rounded-3xl
      border border-slate-200 dark:border-slate-800
      bg-white dark:bg-slate-900
      p-4 sm:p-5 lg:p-6
      shadow-lg
      flex flex-col
    ">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 shrink-0">

        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/50">
            <ListTodo
              size={23}
              className="text-blue-600 dark:text-blue-300"
            />
          </div>

          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Today's Tasks
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => loadTasks()}
          disabled={loading}
          aria-label="Refresh today's tasks"
          className="
            shrink-0 rounded-xl p-2.5
            text-blue-600 dark:text-blue-300
            hover:bg-blue-50 dark:hover:bg-slate-800
            transition disabled:opacity-50
          "
        >
          <RefreshCw
            size={19}
            className={loading ? "animate-spin" : ""}
          />
        </button>
      </div>

      {/* Daily Progress - Fixed */}
      <div className="
        mt-5 sm:mt-6 shrink-0
        rounded-2xl
        border border-blue-100 dark:border-slate-700
        bg-blue-50/70 dark:bg-slate-800/70
        p-4
      ">

        <div className="flex items-center justify-between gap-3">

          <div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Daily progress
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
              {completedCount}
              <span className="text-base font-medium text-slate-500 dark:text-slate-400">
                {" "}/ {totalTasks} tasks
              </span>
            </p>
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white dark:bg-slate-900">
            <Target
              className="text-blue-600 dark:text-blue-300"
              size={23}
            />
          </div>
        </div>

        <div
          className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-blue-100 dark:bg-slate-700"
          role="progressbar"
          aria-label="Daily task progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {totalTasks === 0
            ? "No tasks scheduled for today."
            : `${progress}% completed — keep going!`}
        </p>
      </div>

      {/* Task List Header - Fixed */}
      <div className="mt-5 mb-3 flex items-center justify-between gap-2 shrink-0">

        <h3 className="font-bold text-slate-900 dark:text-white">
          Your tasks
        </h3>

        <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
          {pendingCount} pending
        </span>
      </div>

      {/* Scrollable Task List */}
      <div className="
        flex-1 min-h-0
        overflow-y-auto overflow-x-hidden
        overscroll-contain
        pr-2 space-y-3
        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-track]:bg-slate-100
        dark:[&::-webkit-scrollbar-track]:bg-slate-800
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-slate-300
        dark:[&::-webkit-scrollbar-thumb]:bg-slate-600
      ">

        {loading ? (

          <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
            <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm">Loading today's tasks...</p>
          </div>

        ) : tasks.length === 0 ? (

          <div className="h-full min-h-[150px] flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 px-4 py-6 text-center">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 dark:bg-slate-800">
              <CheckCircle2
                size={32}
                className="text-blue-600 dark:text-blue-400"
              />
            </div>

            <p className="mt-3 font-semibold text-slate-800 dark:text-white">
              All clear for today!
            </p>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              No tasks scheduled for today.
            </p>

          </div>

        ) : (

          tasks.map((task) => (

            <div
              key={task.id}
              className={`
                w-full rounded-xl border p-3 sm:p-4
                transition-all duration-200
                ${
                  task.isCompleted
                    ? "border-green-200 bg-green-50/70 dark:border-green-900 dark:bg-green-900/10"
                    : "border-slate-200 bg-white hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-800"
                }
              `}
            >

              <div className="flex items-start gap-3">

                {task.isCompleted ? (
                  <CheckCircle2
                    size={21}
                    className="mt-0.5 shrink-0 text-green-600"
                  />
                ) : (
                  <Circle
                    size={21}
                    className="mt-0.5 shrink-0 text-blue-500"
                  />
                )}

                <div className="min-w-0 flex-1">

                  <p
                    className={`
                      break-words text-sm font-semibold
                      ${
                        task.isCompleted
                          ? "text-slate-500 line-through dark:text-slate-400"
                          : "text-slate-900 dark:text-white"
                      }
                    `}
                  >
                    {task.title}
                  </p>

                  <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <Clock3 size={14} className="shrink-0" />

                    {new Date(task.dueDate).toLocaleTimeString(
                      "en-IN",
                      {
                        hour: "numeric",
                        minute: "2-digit",
                      }
                    )}
                  </p>

                  {!task.isCompleted && (
                    <button
                      type="button"
                      onClick={() => handleComplete(task.id)}
                      disabled={completingId !== null}
                      className="
                        mt-3 rounded-lg
                        bg-blue-600 px-3 py-1.5
                        text-xs font-semibold text-white
                        transition hover:bg-blue-700
                        disabled:cursor-not-allowed disabled:opacity-50
                      "
                    >
                      {completingId === task.id
                        ? "Completing..."
                        : "✓ Mark complete"}
                    </button>
                  )}

                  {task.isCompleted && (
                    <p className="mt-2 text-xs font-medium text-green-600 dark:text-green-400">
                      Completed
                    </p>
                  )}

                </div>
              </div>
            </div>

          ))

        )}

      </div>

    </section>
  );
}

export default TodayTasks;
