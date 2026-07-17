import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
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

  return (
  <div className="page">
    {/* Header */}
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
        <div className="navbar px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

      <div className="flex items-center gap-3">

        <button
          onClick={() => navigate("/subject")}
          className="hover:text-blue-600 dark:hover:text-blue-400"
        >
          <ArrowLeft size={24} />
        </button>

        <h1 className="text-2xl md:text-3xl font-bold dark:text-white">
          Subject Notes
        </h1>

      </div>

      <button
        onClick={() => setShowModal(true)}
        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition"
      >
        <Plus size={18} />
        Add Note
      </button>

    </div>

    {/* Content */}

    <div className="p-4 sm:p-6 lg:p-8">

      {notes.length === 0 ? (

        <div className="card p-8 sm:p-12 text-center">

          <h2 className="text-2xl md:text-3xl font-bold">
            No Notes Yet 📚
          </h2>

          <p className="text-gray-500 dark:text-gray-300 mt-3">
            Click Add Note to create your first note.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

          {notes.map((note, index) => (

            <div
              key={note.id}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-slate-700 p-5 flex flex-col justify-between"
            >

              {/* Header */}

              <div>

                <div className="flex justify-between items-start gap-3">

                  <div className="flex gap-3">

                    <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-600 opacity-20">
                      {(index + 1).toString().padStart(2, "0")}
                    </h1>

                    <div>

                      <h2 className="text-xl sm:text-2xl font-bold capitalize dark:text-white break-words">
                        {note.title}
                      </h2>

                      <div className="h-1 bg-blue-500 rounded-full mt-2"></div>

                    </div>

                  </div>

                  {note.isPinned === 1 && (
                    <span className="text-2xl shrink-0">
                      📌
                    </span>
                  )}

                </div>

                {note.dueDate && (

                  <p className="mt-5 text-sm text-gray-500 dark:text-gray-400">

                    📅 Due :
                    {" "}
                    {new Date(note.dueDate).toLocaleDateString()}

                  </p>

                )}

              </div>

              {/* Buttons */}

              <div className="flex flex-wrap gap-3 mt-6">

                <button
                  onClick={() => handlePin(note.id)}
                  className={`flex-1 sm:flex-none min-w-[55px] h-12 rounded-xl text-white transition ${
                    note.isPinned === 1
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-gray-600 hover:bg-gray-700"
                  }`}
                >
                  {note.isPinned === 1 ? "📌" : "📍"}
                </button>

                <button
                  onClick={() => {
                    setSelectedNote(note);
                    setShowModal(true);
                  }}
                  className="w-12 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex justify-center items-center transition"
                >
                  <FaEdit />
                </button>

                <button
                  onClick={() => handleDelete(note.id)}
                  className="w-12 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white flex justify-center items-center transition"
                >
                  <FaTrash />
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

    {/* Mobile Bottom Navigation */}

    <div className="lg:hidden">
      <BottomNav />
    </div>
  </main>

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
