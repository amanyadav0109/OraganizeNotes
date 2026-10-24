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
        ml-0
        md:ml-0
        lg:ml-56

        pt-20

        p-4
        sm:p-6
        lg:p-8

        pb-24

        min-h-[calc(100vh-4rem)]
        min-w-0

        transition-all
        duration-200
      "
    >
      <div
        className="
          mb-6
          lg:mb-8

          bg-white
          dark:bg-slate-900

          border
          border-gray-200
          dark:border-slate-800

          rounded-2xl

          px-4
          sm:px-6
          lg:px-8

          py-4
          sm:py-5

          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between

          gap-4

          shadow-sm
          dark:shadow-none

          transition-colors
        "
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="
              w-11
              h-11
              sm:w-12
              sm:h-12

              shrink-0

              flex
              items-center
              justify-center

              rounded-xl

              bg-blue-50
              dark:bg-blue-500/10

              border
              border-blue-100
              dark:border-blue-500/20

              text-xl
              sm:text-2xl
            "
          >
            📝
          </div>

          <div className="min-w-0">
            <h1
              className="
                text-xl
                sm:text-2xl
                md:text-3xl

                font-bold

                text-gray-900
                dark:text-white
              "
            >
              Pinned Notes
            </h1>

            <p
              className="
                mt-1

                text-xs
                sm:text-sm

                text-gray-500
                dark:text-gray-400
              "
            >
              Manage and view all your Pinned notes
            </p>
          </div>
        </div>
      </div>

      {notes.length === 0 ? (
        <div
          className="
            bg-white
            dark:bg-slate-900

            border
            border-gray-200
            dark:border-slate-800

            rounded-2xl

            p-8
            sm:p-12

            text-center

            shadow-sm
            dark:shadow-none
          "
        >
          <h2 className="text-xl sm:text-2xl font-semibold dark:text-white">
            No Pinned Notes 📌
          </h2>

          <p className="text-gray-500 dark:text-gray-400 mt-3">
            Pin your favorite notes to access them quickly.
          </p>
        </div>
      ) : (
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-3

            gap-4
            sm:gap-6
          "
        >
          {notes.map((note, index) => (
            <div
              key={note.id}
              onClick={() => navigate(`/note/${note.id}`)}
              className="
                bg-white
                dark:bg-slate-800

                border
                border-gray-200
                dark:border-slate-700

                rounded-2xl

                p-5
                sm:p-6

                shadow-md

                hover:shadow-xl
                hover:-translate-y-1

                transition-all
                duration-300

                cursor-pointer

                min-w-0
              "
            >
              <div className="flex items-start justify-between mb-5 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="
                      text-4xl
                      sm:text-5xl

                      font-extrabold

                      text-blue-500/20

                      select-none
                      shrink-0
                    "
                  >
                    {(index + 1).toString().padStart(2, "0")}
                  </span>

                  <div className="min-w-0">
                    <h2
                      className="
                        text-lg
                        sm:text-xl

                        font-bold

                        text-gray-900
                        dark:text-white

                        capitalize

                        truncate
                      "
                    >
                      {note.title}
                    </h2>

                    <div className="w-full h-1 bg-blue-500 rounded-full mt-1"></div>
                  </div>
                </div>

                <span className="text-2xl shrink-0">
                  📌
                </span>
              </div>

           <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
  {note.filePath ? (
    <>
      <span className="text-red-500">📄</span>
      <span className="font-medium">PDF Note Attached</span>
    </>
  ) : (
    <>
      <span className="text-blue-500">📝</span>
      <span className="font-medium">Text Note</span>
    </>
  )}
</div>

            

              <div
                className="
                  mt-5
                  pt-4

                  border-t
                  border-gray-200
                  dark:border-slate-700

                  space-y-2
                "
              >
                {note.dueDate && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    📅 Due :{" "}
                    {new Date(note.dueDate).toLocaleDateString()}
                  </p>
                )}

                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
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
