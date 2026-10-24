import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { getSubjects } from "../services/subjectService";
import {
  getNotesBySubject,
  deleteNote,
  pinNote,
} from "../services/noteService";

import AddNoteModal from "../components/AddNoteModal";
import BottomNav from "../components/BottomNav";

function SubjectNotes() {
  const { id } = useParams();
  const navigate = useNavigate();
const [subjectName, setSubjectName] = useState("");
  const [selectedContent, setSelectedContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const loadNotes = async () => {
    try {
      const data = await getNotesBySubject(id);
      setNotes(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;

    try {
      await deleteNote(id);
      loadNotes();
    } catch (err) {
      console.log(err);
    }
  };

  const handlePin = async (id) => {
    try {
      await pinNote(id);
      loadNotes();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [id]);
  useEffect(() => {
    const loadSubject = async () => {
        try {
            const subjects = await getSubjects();

            const subject = subjects.find(
                (item) => Number(item.id) === Number(id)
            );

            if (subject) {
                setSubjectName(subject.subjectName);
            }
        } catch (err) {
            console.log(err);
        }
    };

    loadSubject();
    loadNotes();
}, [id]);

  return (
    <div className="page min-h-screen bg-gray-50 dark:bg-[#080d18] transition-colors duration-200">

      {/* ================= NAVBAR ================= */}

      <Navbar />

      <Sidebar />

      {/* ================= MAIN ================= */}

     <main
  className="
    ml-0
    lg:ml-[215px]

    pt-20
    sm:pt-10

    p-4
    sm:p-6
    lg:p-8

    pb-24

    min-h-[calc(100vh-4rem)]
    min-w-0
    w-80%

    transition-all
    duration-200
  "
>

        {/* ================= HEADER ================= */}

        <div
          className="
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

          {/* LEFT SIDE */}

          <div className="flex items-center gap-3 min-w-0">

            <button
              onClick={() => navigate("/subject")}
              className="
                w-10
                h-10
                shrink-0
                flex
                items-center
                justify-center
                rounded-xl
                text-gray-600
                dark:text-gray-300
                hover:bg-gray-100
                dark:hover:bg-slate-800
                hover:text-blue-600
                dark:hover:text-blue-400
                transition
              "
            >
              <ArrowLeft size={22} />
            </button>

           <div className="min-w-0">

    <h1
        className="
            text-xl
            sm:text-2xl
            md:text-3xl
            font-bold
            text-gray-900
            dark:text-white
            truncate
        "
    >
        {subjectName || "Subject Notes"}
    </h1>

    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
        Manage your notes for this subject
    </p>

</div>

          </div>

          {/* ADD NOTE */}

          <button
            onClick={() => navigate(`/subject/${id}/add-note`)}
            className="
              w-full
              sm:w-auto
              min-h-[44px]
              bg-blue-600
              hover:bg-blue-700
              active:bg-blue-800
              text-white
              px-5
              py-3
              rounded-xl
              flex
              items-center
              justify-center
              gap-2
              font-semibold
              transition
              shadow-sm
              shrink-0
            "
          >
            <Plus size={18} />
            <span>Add Note</span>
          </button>

        </div>


        {/* ================= CONTENT ================= */}

        <div className="mt-5 sm:mt-6">

          {notes.length === 0 ? (

            /* ================= EMPTY STATE ================= */

            <div
              className="
                bg-white
                dark:bg-slate-900
                border
                border-gray-200
                dark:border-slate-800
                rounded-2xl
                p-6
                sm:p-10
                lg:p-12
                text-center
                shadow-sm
                dark:shadow-none
                transition-colors
              "
            >

              <div className="text-5xl sm:text-6xl mb-4">
                📚
              </div>

              <h2
                className="
                  text-xl
                  sm:text-2xl
                  md:text-3xl
                  font-bold
                  text-gray-900
                  dark:text-white
                "
              >
                No Notes Yet
              </h2>

              <p
                className="
                  text-sm
                  sm:text-base
                  text-gray-500
                  dark:text-gray-400
                  mt-3
                "
              >
                Click Add Note to create your first note.
              </p>

              <button
                onClick={() => navigate(`/subject/${id}/add-note`)}
                className="
                  mt-6
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  px-5
                  py-3
                  rounded-xl
                  font-semibold
                  transition
                "
              >
                + Create Note
              </button>

            </div>

          ) : (

            /* ================= NOTES GRID ================= */

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                xl:grid-cols-3
                2xl:grid-cols-4
                gap-4
                sm:gap-5
                lg:gap-6
              "
            >

              {notes.map((note, index) => (

                <div
                  key={note.id}
                  className="
                    bg-white
                    dark:bg-slate-800
                    rounded-2xl
                    shadow-sm
                    hover:shadow-xl
                    dark:hover:shadow-black/20
                    transition-all
                    duration-300
                    border
                    border-gray-200
                    dark:border-slate-700
                    p-4
                    sm:p-5
                    flex
                    flex-col
                    justify-between
                    min-h-[210px]
                  "
                >

                  {/* ================= CARD HEADER ================= */}

                  <div>

                    <div className="flex justify-between items-start gap-3">

                      <div className="flex gap-3 min-w-0">

                        {/* NUMBER */}

                        <h1
                          className="
                            text-4xl
                            sm:text-5xl
                            font-extrabold
                            text-blue-600
                            opacity-20
                            leading-none
                            shrink-0
                          "
                        >
                          {(index + 1).toString().padStart(2, "0")}
                        </h1>

                        {/* TITLE */}

                        <div className="min-w-0">

                          <h2
                            className="
                              text-lg
                              sm:text-xl
                              font-bold
                              capitalize
                              text-gray-900
                              dark:text-white
                              break-words
                              line-clamp-2
                            "
                          >
                            {note.title}
                          </h2>

                          <div className="h-1 bg-blue-500 rounded-full mt-2 w-12"></div>

                        </div>

                      </div>

                      {/* PIN */}

                      {note.isPinned === 1 && (
                        <span className="text-xl sm:text-2xl shrink-0">
                          📌
                        </span>
                      )}

                    </div>


                    {/* DUE DATE */}

                    {note.dueDate && (

                      <p
                        className="
                          mt-5
                          text-xs
                          sm:text-sm
                          text-gray-500
                          dark:text-gray-400
                        "
                      >
                        📅 Due :{" "}
                        {new Date(note.dueDate).toLocaleDateString()}
                      </p>

                    )}

                  </div>


                  {/* ================= BUTTONS ================= */}

                  <div className="flex gap-2 sm:gap-3 mt-6">

                    {/* PIN */}

                    <button
                      onClick={() => handlePin(note.id)}
                      title={
                        note.isPinned === 1
                          ? "Unpin note"
                          : "Pin note"
                      }
                      className={`
                        flex-1
                        sm:flex-none
                        sm:w-12
                        h-11
                        sm:h-12
                        rounded-xl
                        text-white
                        flex
                        items-center
                        justify-center
                        transition
                        ${
                          note.isPinned === 1
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-gray-600 hover:bg-gray-700"
                        }
                      `}
                    >
                      {note.isPinned === 1 ? "📌" : "📍"}
                    </button>


                    {/* EDIT */}

                    <button
                      onClick={() => {
                        setSelectedNote(note);
                        setShowModal(true);
                      }}
                      title="Edit note"
                      className="
                        w-11
                        sm:w-12
                        h-11
                        sm:h-12
                        shrink-0
                        rounded-xl
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        flex
                        justify-center
                        items-center
                        transition
                      "
                    >
                      <FaEdit />
                    </button>


                    {/* DELETE */}

                    <button
                      onClick={() => handleDelete(note.id)}
                      title="Delete note"
                      className="
                        w-11
                        sm:w-12
                        h-11
                        sm:h-12
                        shrink-0
                        rounded-xl
                        bg-red-600
                        hover:bg-red-700
                        text-white
                        flex
                        justify-center
                        items-center
                        transition
                      "
                    >
                      <FaTrash />
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>


        {/* ================= MOBILE BOTTOM NAV ================= */}

        <div className="lg:hidden">
          <BottomNav />
        </div>

      </main>


      {/* ================= EDIT NOTE MODAL ================= */}

      {showModal && (
        <AddNoteModal
          subjectId={id}
          editNote={selectedNote}
          closeModal={() => {
            setShowModal(false);
            setSelectedNote(null);
          }}
          refreshNotes={loadNotes}
        />
      )}

    </div>
  );
}

export default SubjectNotes;