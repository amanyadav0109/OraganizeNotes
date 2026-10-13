import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import BottomNav from "../components/BottomNav";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function FindNotes() {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/marketplace"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load notes");
      }

      setNotes(data.notes || []);
    } catch (err) {
      console.log("FETCH MARKETPLACE ERROR:", err);
      setError("Unable to load notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const filteredNotes = notes.filter((note) => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) return true;

    return (
      note.title?.toLowerCase().includes(search) ||
      note.subject?.toLowerCase().includes(search) ||
      note.unit?.toLowerCase().includes(search) ||
      note.description?.toLowerCase().includes(search) ||
      note.seller_name?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="page min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Navbar */}
      <Navbar />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
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
        {/* =================================
            PAGE HEADER
        ================================= */}

        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            📚 Find Your Notes
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Discover and purchase useful notes from other students.
          </p>
        </div>

        {/* =================================
            MAIN CARD
        ================================= */}

        <div
          className="
            card
            bg-white
            dark:bg-slate-900
            border
            border-gray-200
            dark:border-slate-700
            rounded-2xl
            shadow-md
            p-5
            sm:p-6
            lg:p-8
          "
        >
          {/* SEARCH */}

          <div className="relative mb-6">
            <span
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
                text-lg
              "
            >
              🔍
            </span>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notes, subjects or units..."
              className="
                w-full
                pl-12
                pr-4
                py-3.5
                rounded-xl
                bg-gray-100
                dark:bg-slate-800
                border
                border-gray-200
                dark:border-slate-700
                text-gray-900
                dark:text-white
                placeholder-gray-400
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-500/10
                transition
              "
            />
          </div>

          {/* RESULT COUNT */}

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {filteredNotes.length}
            </span>{" "}
            {filteredNotes.length === 1 ? "note" : "notes"} available
          </p>

          {/* =================================
              LOADING
          ================================= */}

          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div
                  className="
                    w-10
                    h-10
                    mx-auto
                    rounded-full
                    border-4
                    border-blue-500/30
                    border-t-blue-500
                    animate-spin
                  "
                ></div>

                <p className="mt-4 text-gray-500 dark:text-gray-400">
                  Loading notes...
                </p>
              </div>
            </div>
          )}

          {/* =================================
              ERROR
          ================================= */}

          {!loading && error && (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">⚠️</div>

              <p className="text-red-500 dark:text-red-400">
                {error}
              </p>

              <button
                onClick={loadNotes}
                className="
                  mt-5
                  px-5
                  py-2.5
                  rounded-xl
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  font-semibold
                  transition
                "
              >
                Try Again
              </button>
            </div>
          )}

          {/* =================================
              NO NOTES
          ================================= */}

          {!loading && !error && filteredNotes.length === 0 && (
            <div className="text-center py-16">
              <div
                className="
                  w-16
                  h-16
                  mx-auto
                  rounded-2xl
                  bg-gray-100
                  dark:bg-slate-800
                  flex
                  items-center
                  justify-center
                  text-3xl
                "
              >
                📚
              </div>

              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mt-4">
                No notes found
              </h2>

              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Try another search term.
              </p>
            </div>
          )}

          {/* =================================
              NOTES
          ================================= */}

          {!loading && !error && filteredNotes.length > 0 && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="
                    bg-gray-50
                    dark:bg-slate-800
                    border
                    border-gray-200
                    dark:border-slate-700
                    rounded-2xl
                    p-5
                    sm:p-6
                    shadow-sm
                    hover:shadow-lg
                    hover:border-blue-400
                    dark:hover:border-blue-500
                    transition-all
                    duration-300
                  "
                >
                  {/* TITLE */}

                  <h2
                    className="
                      text-lg
                      sm:text-xl
                      font-bold
                      text-gray-900
                      dark:text-white
                    "
                  >
                    {note.title}
                  </h2>

                  {/* SUBJECT + UNIT */}

                  <div className="flex flex-wrap gap-2 mt-3">
                    <span
                      className="
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-medium
                        bg-cyan-500/10
                        text-cyan-600
                        dark:text-cyan-400
                      "
                    >
                      {note.subject}
                    </span>

                    <span
                      className="
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-medium
                        bg-purple-500/10
                        text-purple-600
                        dark:text-purple-400
                      "
                    >
                      {note.unit}
                    </span>
                  </div>

                  {/* DESCRIPTION */}

                  <p
                    className="
                      text-sm
                      leading-6
                      text-gray-600
                      dark:text-gray-300
                      mt-4
                      line-clamp-2
                    "
                  >
                    {note.description}
                  </p>

                  {/* SELLER */}

                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                    👤 Seller:{" "}
                    <span className="font-semibold text-gray-700 dark:text-gray-200">
                      {note.seller_name}
                    </span>
                  </p>

                  {/* BOTTOM */}

                  <div
                    className="
                      flex
                      flex-col
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                      gap-4
                      mt-6
                      pt-4
                      border-t
                      border-gray-200
                      dark:border-slate-700
                    "
                  >
                    {/* PRICE */}

                    <div>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        ₹{Number(note.price).toFixed(2)}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        One-time purchase
                      </p>
                    </div>

                    {/* GET NOTES */}

                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/get-notes/${note.id}`)
                      }
                      className="
                        w-full
                        sm:w-auto
                        px-6
                        py-3
                        rounded-xl
                        bg-cyan-500
                        hover:bg-cyan-400
                        text-black
                        font-semibold
                        transition-all
                        duration-200
                        hover:shadow-lg
                        hover:shadow-cyan-500/20
                        active:scale-95
                      "
                    >
                      Get Notes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </main>
    </div>
  );
}

export default FindNotes;