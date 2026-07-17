import { useEffect, useState } from "react";
import { getReminders } from "../services/reminderService";
import { deleteNote } from "../services/noteService";
function CompletedTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await getReminders();
      console.log(data);
      const completed = data
        .filter((note) => note.isCompleted)
        .sort(
          (a, b) =>
            new Date(b.lastReminderAt || b.updatedAt) -
            new Date(a.lastReminderAt || a.updatedAt),
        )
        .slice(0, 5);

      setTasks(completed);
    } catch (err) {
      console.log(err);
    }
  };
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmDelete) return;

    try {
      await deleteNote(id);

    
      load();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="space-y-3">
      {tasks.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No completed tasks yet.
        </p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            className="border border-green-300 dark:border-green-700 rounded-xl p-4 bg-green-50 dark:bg-green-900/20"
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="font-semibold dark:text-white">{task.title}</h3>

                <p className="text-green-600 dark:text-green-400 text-sm mt-2">
                  ✔ Completed
                </p>
              </div>

              <button
                onClick={() => handleDelete(task.id)}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition"
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default CompletedTasks;
