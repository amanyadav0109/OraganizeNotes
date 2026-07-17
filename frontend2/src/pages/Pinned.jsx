import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import { getPinnedNotes } from "../services/noteService";

function Pinned() {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);

  const loadPinned = async () => {
    try {
      const data = await getPinnedNotes();
      setNotes(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadPinned();
  }, []);

return (
  <div className="page min-h-screen bg-gray-50 dark:bg-slate-950">
    <Navbar />

    <Sidebar />

    <main
      className="
        lg:ml-56
        
        p-4
        sm:p-6
        lg:p-8
        pb-24
        min-h-[calc(100vh-4rem)]
      "
    >
      <h1 className="text-2xl sm:text-3xl font-bold dark:text-white mb-6 sm:mb-8">
        📌 Pinned Notes
      </h1>

      {notes.length === 0 ? (
        <div className="card p-8 sm:p-12 text-center">
          <h2 className="text-xl sm:text-2xl font-semibold">
            No Pinned Notes 📌
          </h2>

          <p className="text-gray-500 dark:text-gray-400 mt-3">
            Pin your favorite notes to access them quickly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {notes.map((note, index) => (
            <div
              key={note.id}
              onClick={() => navigate(`/note/${note.id}`)}
              className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <span className="text-4xl sm:text-5xl font-extrabold text-blue-500/20 select-none">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>

                  <div>
                    <h2 className="text-lg sm:text-xl font-bold capitalize dark:text-white">
                      {note.title}
                    </h2>

                    <div className="w-full h-1 bg-blue-500 rounded-full mt-1"></div>
                  </div>
                </div>

                <span className="text-2xl">📌</span>
              </div>

              <p className="text-gray-600 dark:text-gray-300 line-clamp-2 leading-7 text-sm sm:text-base">
                {note.content}
              </p>

              <div className="mt-5 pt-4 border-t border-gray-200 dark:border-slate-700 space-y-2">
                {note.dueDate && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    📅 Due : {new Date(note.dueDate).toLocaleDateString()}
                  </p>
                )}

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  📚 Subject :
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {" "}
                    {note.subjectName || "Unknown"}
                  </span>
                </p>

                <div className="flex justify-end pt-2">
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    View Details →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </main>
  </div>
);
}

export default Pinned;
