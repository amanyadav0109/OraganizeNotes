import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import { getAllNotes } from "../services/noteService";

function Notes() {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);

  const loadNotes = async () => {
    try {
      const data = await getAllNotes();
      setNotes(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

 return (
  <div className="page">
    <Navbar />

    
      <Sidebar />

         <main  className="
        lg:ml-56
        
        p-4
        sm:p-6
        lg:p-8
        pb-24
        min-h-[calc(100vh-4rem)]
      ">

        {/* Heading */}

        <h1 className="text-2xl sm:text-3xl font-bold dark:text-white mb-6 lg:mb-8">
          📝 All Notes
        </h1>

        {notes.length === 0 ? (

          <div className="card p-8 sm:p-10 lg:p-12 text-center">

            <h2 className="text-xl sm:text-2xl font-semibold">
              No Notes Found 📚
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm sm:text-base">
              Create your first note.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">

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
                  p-4
                  sm:p-5
                  lg:p-6
                  shadow-md
                  hover:shadow-xl
                  hover:-translate-y-1
                  transition-all
                  duration-300
                  cursor-pointer
                "
              >

                {/* Number + Title */}

                <div className="flex items-center gap-3 sm:gap-4 mb-4">

                  <span className="text-4xl sm:text-5xl font-extrabold text-blue-500/20 select-none">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>

                  <div >

                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white capitalize truncate">
                      {note.title}
                    </h2>

                    <div className="w-full h-1 bg-blue-500 rounded-full mt-1"></div>

                  </div>

                </div>

                {/* Content */}

                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 line-clamp-2 leading-6">
                  {note.content}
                </p>

                {/* Footer */}

                <div className="mt-5 pt-4 border-t border-gray-200 dark:border-slate-700 space-y-2">

                  {note.dueDate && (

                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      📅 Due:{" "}
                      {new Date(note.dueDate).toLocaleDateString()}
                    </p>

                  )}

                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                    📚 Subject:
                    <span className="ml-1 font-semibold text-blue-600 dark:text-blue-400">
                      {note.subjectName || "Unknown"}
                    </span>
                  </p>

                  <div className="pt-2 flex justify-end">

                    <span className="text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-semibold">
                      View Details →
                    </span>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    

    <BottomNav />

  </div>
);
}

export default Notes;
