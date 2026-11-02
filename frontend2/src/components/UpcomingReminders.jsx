
import { useEffect, useState } from "react";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import { getReminders } from "../services/reminderService";
import { completeTask } from "../services/noteService";

function UpcomingReminders() {
  const [upcoming, setUpcoming] = useState([]);
  const [overdue, setOverdue] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await getReminders();
      const now = new Date();

      setUpcoming(
        data
          .filter(
            (note) =>
              !note.isCompleted &&
              new Date(note.dueDate) > now
          )
          .sort(
            (a, b) =>
              new Date(a.dueDate) - new Date(b.dueDate)
          )
      );

      setOverdue(
        data
          .filter(
            (note) =>
              !note.isCompleted &&
              new Date(note.dueDate) <= now
          )
          .sort(
            (a, b) =>
              new Date(b.dueDate) - new Date(a.dueDate)
          )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeTask(id);
      await load();
    } catch (err) {
      console.log(err);
    }
  };

  const scrollStyle = `
    min-h-0 flex-1 overflow-y-auto overflow-x-hidden
    overscroll-contain pr-2 space-y-3
    [&::-webkit-scrollbar]:w-1.5
    [&::-webkit-scrollbar-track]:rounded-full
    [&::-webkit-scrollbar-track]:bg-gray-100
    dark:[&::-webkit-scrollbar-track]:bg-slate-800
    [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar-thumb]:bg-gray-300
    dark:[&::-webkit-scrollbar-thumb]:bg-slate-600
  `;

  return (
    <div className="w-full min-w-0 space-y-5 sm:space-y-6">

      {/* Main Heading */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-100 dark:bg-yellow-900/30">
          <Bell
            size={22}
            className="text-yellow-600 dark:text-yellow-400"
          />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Reminders
        </h2>
      </div>

      {/* Upcoming */}
      <section className="
        h-[190px] w-full
        flex flex-col overflow-hidden
        rounded-2xl border border-yellow-300
        dark:border-yellow-700
        bg-yellow-50 dark:bg-yellow-900/10
        p-4 sm:p-5 shadow
      ">

        {/* Fixed Heading */}
        <div className="mb-3 flex items-center justify-between gap-2 shrink-0">
          <h3 className="text-base sm:text-lg font-bold text-yellow-600 dark:text-yellow-400">
            🟡 Upcoming
          </h3>

          <span className="rounded-full bg-yellow-100 dark:bg-yellow-900/40 px-3 py-1 text-xs font-semibold text-yellow-700 dark:text-yellow-300">
            {upcoming.length} Tasks
          </span>
        </div>

        {/* Scrollable List */}
        <div className={scrollStyle}>

          {upcoming.length === 0 ? (
            <div className="h-full min-h-[80px] flex flex-col items-center justify-center text-center">
              <CheckCircle2
                size={25}
                className="text-yellow-500 mb-2"
              />

              <p className="text-sm text-gray-500 dark:text-gray-400">
                No upcoming tasks.
              </p>
            </div>
          ) : (
            upcoming.map((note) => (
              <div
                key={note.id}
                className="
                  rounded-xl border border-yellow-200
                  dark:border-yellow-800
                  bg-white dark:bg-slate-800
                  p-3 sm:p-4
                  transition hover:shadow-md
                "
              >
                <h4 className="break-words text-sm font-semibold text-gray-900 dark:text-white">
                  {note.title}
                </h4>

                <p className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <CalendarDays size={14} className="shrink-0" />
                  {new Date(note.dueDate).toLocaleString("en-IN")}
                </p>
              </div>
            ))
          )}

        </div>
      </section>

      {/* Overdue */}
      <section className="
        h-[230px] w-full
        flex flex-col overflow-hidden
        rounded-2xl border border-red-300
        dark:border-red-700
        bg-red-50 dark:bg-red-900/10
        p-4 sm:p-5 shadow
      ">

        {/* Fixed Heading */}
        <div className="mb-3 flex items-center justify-between gap-2 shrink-0">
          <h3 className="text-base sm:text-lg font-bold text-red-600 dark:text-red-400">
            🔴 Overdue
          </h3>

          <span className="rounded-full bg-red-100 dark:bg-red-900/40 px-3 py-1 text-xs font-semibold text-red-700 dark:text-red-300">
            {overdue.length} Tasks
          </span>
        </div>

        {/* Scrollable List */}
        <div className={scrollStyle}>

          {overdue.length === 0 ? (
            <div className="h-full min-h-[100px] flex flex-col items-center justify-center text-center">
              <CheckCircle2
                size={25}
                className="text-red-500 mb-2"
              />

              <p className="text-sm text-gray-500 dark:text-gray-400">
                No overdue tasks.
              </p>
            </div>
          ) : (
            overdue.map((note) => (
              <div
                key={note.id}
                className="
                  rounded-xl border border-red-200
                  dark:border-red-800
                  bg-white dark:bg-slate-800
                  p-3 sm:p-4
                  transition hover:shadow-md
                "
              >

                <div className="flex flex-col gap-3">

                  <div className="min-w-0">
                    <h4 className="break-words text-sm font-semibold text-gray-900 dark:text-white">
                      {note.title}
                    </h4>

                    <p className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Clock3 size={14} className="shrink-0" />

                      {new Date(note.dueDate).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleComplete(note.id)}
                      className="
                        inline-flex items-center justify-center gap-2
                        rounded-lg bg-green-600
                        hover:bg-green-700
                        text-white px-4 py-2
                        text-xs sm:text-sm font-semibold
                        transition
                      "
                    >
                      <CheckCircle2 size={15} />
                      Complete
                    </button>
                  </div>

                </div>
              </div>
            ))
          )}

        </div>
      </section>

    </div>
  );
}

export default UpcomingReminders;
