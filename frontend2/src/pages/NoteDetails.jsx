import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import AIAssistant from "../components/AIAssistant";
import { generateAI } from "../services/aiService";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AddNoteModal from "../components/AddNoteModal";
import { exportNotePDF } from "../utils/pdfExport";
import { getSingleNote, deleteNote } from "../services/noteService";
import { Share2 } from "lucide-react";
import BottomNav from "../components/BottomNav";
import {
  FaEdit,
  FaTrash,
  FaRobot,
  FaFilePdf,
  FaShareAlt,
} from "react-icons/fa";
function NoteDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [note, setNote] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showAI, setShowAI] = useState(false);

  const [selectedContent, setSelectedContent] = useState("");
  const loadNote = async () => {
    try {
      const data = await getSingleNote(id);

      setNote(data);
    } catch (err) {
      console.log(err);
    }
  };
 const handleShare = async () => {
  if (!note) {
    alert("Note is still loading.");
    return;
  }

  const shareData = {
    title: note.title,
    text: note.content,
  };

  try {
    await navigator.share(shareData);
  } catch (err) {
    console.log(err);
  }
};

  useEffect(() => {
    loadNote();
    handleShare();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Delete this note?");

    if (!confirmDelete) return;

    try {
      await deleteNote(id);

      navigate("/notes");
    } catch (err) {
      console.log(err);
    }
  };

  if (!note) {
    return (
      <div className="page">
        <Navbar />

        <div className="flex">
          <Sidebar />

          <main className="flex-1 flex justify-center items-center">
            <h2 className="text-2xl font-bold dark:text-white">Loading...</h2>
          </main>
        </div>
      </div>
    );
  }

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

        {/* Back */}

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-5 lg:mb-8"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* Card */}

        <div className="bg-white dark:bg-slate-800 rounded-2xl lg:rounded-3xl shadow-xl border border-gray-200 dark:border-slate-700 p-5 sm:p-7 lg:p-10">

          {/* Header */}

          <div className="flex flex-col xl:flex-row justify-between gap-8">

            {/* Left */}

            <div className="flex-1">

              <div className="border-l-4 border-blue-600 pl-4 sm:pl-5">

                <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white capitalize break-words">
                  {note.title}
                </h1>

                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-2">
                  Study Note
                </p>

              </div>

            </div>

            {/* Right */}

            <div className="flex flex-col gap-3 w-full xl:w-auto">

              <span className="px-4 py-3 rounded-xl bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold text-sm sm:text-base text-center">

                🕒 Last Updated

                <br />

                {new Date(
                  note.updatedAt || note.createdAt
                ).toLocaleDateString()}

              </span>

              {note.dueDate && (

                <span className="px-4 py-3 rounded-xl bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 font-semibold text-sm sm:text-base text-center">

                  📅 Created

                  <br />

                  {new Date(note.dueDate).toLocaleDateString()}

                </span>

              )}

            </div>

          </div>

          {/* Divider */}

          <hr className="my-6 lg:my-8 border-gray-300 dark:border-slate-700" />

          {/* Content */}

          <h2 className="text-xl sm:text-2xl font-bold mb-5 dark:text-white">

            📖 Content

          </h2>

          <div className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-4 sm:p-6 lg:p-8 text-gray-700 dark:text-gray-200 whitespace-pre-line leading-8 sm:leading-9 text-sm sm:text-base lg:text-lg break-words">

            {note.content}

          </div>

          {/* Action Buttons */}

          <div className="mt-10 flex justify-center sm:justify-end">

            <div className="grid grid-cols-3 sm:flex gap-3 sm:gap-4">

              {/* Edit */}

              <button
                onClick={() => setShowModal(true)}
                title="Edit Note"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg transition"
              >
                <FaEdit size={20} />
              </button>

              {/* Delete */}

              <button
                onClick={handleDelete}
                title="Delete Note"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transition"
              >
                <FaTrash size={20} />
              </button>

              {/* Share */}

              <button
                onClick={handleShare}
                title="Share"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white flex items-center justify-center shadow-lg transition"
              >
                <FaShareAlt size={20} />
              </button>

              {/* AI */}

              <button
                onClick={() => {
                  setSelectedContent(note.content);
                  setShowAI(true);
                }}
                title="AI Assistant"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-lg transition"
              >
                <FaRobot size={20} />
              </button>

              {/* PDF */}

              <button
                onClick={() => exportNotePDF(note)}
                title="Export PDF"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-green-600 hover:bg-green-700 text-white flex items-center justify-center shadow-lg transition"
              >
                <FaFilePdf size={20} />
              </button>

            </div>

          </div>

        </div>

      </main>

   

    <BottomNav />

    {showModal && (
      <AddNoteModal
        editNote={note}
        subjectId={note.subjectId}
        refreshNotes={loadNote}
        closeModal={() => {
          setShowModal(false);
          loadNote();
        }}
      />
    )}

    {showAI && (
      <AIAssistant
        text={selectedContent}
        closeModal={() => setShowAI(false)}
      />
    )}

  </div>
);
}

export default NoteDetails;
