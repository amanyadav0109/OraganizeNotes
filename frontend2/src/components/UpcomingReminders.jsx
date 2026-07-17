import { useEffect, useState } from "react";
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
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      );

      setOverdue(
        data
          .filter(
            (note) =>
              !note.isCompleted &&
              new Date(note.dueDate) <= now
          )
          .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeTask(id);
      load();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="space-y-6">

      {/* Heading */}

      <h2 className="text-2xl font-bold dark:text-white">
        🔔 Reminders
      </h2>

      {/* Upcoming Card */}

      <div className="rounded-2xl border border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/10 p-5 shadow">

        <h3 className="text-lg font-bold text-yellow-600 dark:text-yellow-400 mb-4">
          🟡 Upcoming
        </h3>

        {upcoming.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No upcoming tasks.
          </p>
        ) : (
          <div className="space-y-3">

            {upcoming.map((note) => (

              <div
                key={note.id}
                className="rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-4"
              >

                <h3 className="font-semibold dark:text-white">
                  {note.title}
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  📅 {new Date(note.dueDate).toLocaleString()}
                </p>

              </div>

            ))}

          </div>
        )}

      </div>

      {/* Overdue Card */}

      <div className="rounded-2xl border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10 p-5 shadow">

        <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4">
          🔴 Overdue
        </h3>

        {overdue.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No overdue tasks.
          </p>
        ) : (
          <div className="space-y-3">

            {overdue.map((note) => (

              <div
                key={note.id}
                className="rounded-xl bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800 p-4"
              >

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                  <div>

                    <h3 className="font-semibold dark:text-white">
                      {note.title}
                    </h3>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      📅 {new Date(note.dueDate).toLocaleString()}
                    </p>

                  </div>

                  <button
                    onClick={() => handleComplete(note.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl font-semibold transition"
                  >
                    ✅ Complete
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default UpcomingReminders;