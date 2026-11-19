
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import AIAssistant from "../components/AIAssistant";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";

import { exportNotePDF } from "../utils/pdfExport";
import { getSingleNote, deleteNote } from "../services/noteService";
import api from "../services/api";

import { toast } from "react-toastify";

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

  const [pdfUrl, setPdfUrl] = useState(null);
  const [note, setNote] = useState(null);
  const [showAI, setShowAI] = useState(false);
  const [selectedContent, setSelectedContent] = useState("");
  const [loading, setLoading] = useState(true);

  const loadNote = async () => {
    try {
      setLoading(true);

      const data = await getSingleNote(id);
      setNote(data);

      if (data.filePath) {
        const response = await api.get(`/notes/pdf/${id}`, {
          responseType: "blob",
        });

        const url = URL.createObjectURL(response.data);

        setPdfUrl((previousUrl) => {
          if (previousUrl) {
            URL.revokeObjectURL(previousUrl);
          }

          return url;
        });
      } else {
        setPdfUrl((previousUrl) => {
          if (previousUrl) {
            URL.revokeObjectURL(previousUrl);
          }

          return null;
        });
      }
    } catch (err) {
      console.error("LOAD NOTE ERROR:", err);
      toast.error(
        err.response?.data?.message || "Failed to load note."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNote();

    return () => {
      setPdfUrl((previousUrl) => {
        if (previousUrl) {
          URL.revokeObjectURL(previousUrl);
        }

        return null;
      });
    };
  }, [id]);

  const handleShare = async () => {
    if (!note) {
      toast.error("Note is still loading.");
      return;
    }

    const shareData = {
      title: note.title,
      text: note.content || "Check out my study note!",
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${note.title}\n\n${note.content || ""}`
        );

        toast.success("Note content copied!");
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("SHARE NOTE ERROR:", err);
        toast.error("Unable to share note.");
      }
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Delete this note?");

    if (!confirmDelete) return;

    try {
      await deleteNote(id);

      toast.success("Note deleted successfully!");
      navigate("/notes");
    } catch (err) {
      console.error("DELETE NOTE ERROR:", err);

      toast.error(
        err.response?.data?.message || "Failed to delete note."
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
        <Navbar />

        <div className="flex">
          <Sidebar />

          <main className="flex-1 lg:ml-56 flex justify-center items-center min-h-[80vh]">
            <h2 className="text-2xl font-bold dark:text-white">
              Loading...
            </h2>
          </main>
        </div>

        <BottomNav />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
        <Navbar />
        <Sidebar />

        <main className="lg:ml-56 p-6 flex flex-col items-center justify-center min-h-[70vh]">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Note not found.
          </h2>

          <button
            onClick={() => navigate("/notes")}
            className="mt-4 px-5 py-2 rounded-lg bg-blue-600 text-white"
          >
            Back to Notes
          </button>
        </main>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors">
      <Navbar />
      <Sidebar />

      <main
        className="
          ml-0 lg:ml-56
          p-4 sm:p-6 lg:p-8
          pb-24
          min-h-[calc(100vh-4rem)]
          min-w-0
        "
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-5 lg:mb-8"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="bg-white dark:bg-slate-800 rounded-2xl lg:rounded-3xl shadow-xl border border-gray-200 dark:border-slate-700 p-5 sm:p-7 lg:p-10">
          <div className="flex flex-col xl:flex-row justify-between gap-8">
            <div className="flex-1 min-w-0">
              <div className="border-l-4 border-blue-600 pl-4 sm:pl-5">
                <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white capitalize break-words">
                  {note.title}
                </h1>

                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-2">
                  Study Note
                </p>
              </div>
            </div>

            <div className="flex flex-row flex-wrap gap-3 w-full xl:w-auto">
              <span className="px-4 py-3 rounded-xl bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold text-sm sm:text-base text-center">
                🕒 Last Updated
                <br />
                {new Date(
                  note.updatedAt || note.createdAt
                ).toLocaleDateString()}
              </span>

              {note.dueDate && (
                <span className="px-4 py-3 rounded-xl bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 font-semibold text-sm sm:text-base text-center">
                  📅 Reminder
                  <br />
                  {new Date(note.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          <hr className="my-6 lg:my-8 border-gray-300 dark:border-slate-700" />

          <h2 className="text-xl sm:text-2xl font-bold mb-5 dark:text-white">
            📖 Content
          </h2>

          <div className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-4 sm:p-6 lg:p-8 text-gray-700 dark:text-gray-200">
            {note.content && (
              <p className="whitespace-pre-line leading-8 sm:leading-9 text-sm sm:text-base lg:text-lg break-words">
                {note.content}
              </p>
            )}

            {pdfUrl && (
              <div
                className={`${
                  note.content
                    ? "mt-6 pt-6 border-t border-gray-200 dark:border-slate-700"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                    📄 Attached PDF
                  </h3>

                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Open PDF
                  </a>
                </div>

                <div className="w-full overflow-hidden rounded-xl border border-gray-200 dark:border-slate-700 bg-white">
                  <iframe
                    src={pdfUrl}
                    title="Attached PDF"
                    className="w-full h-[500px] sm:h-[650px] lg:h-[750px]"
                  />
                </div>
              </div>
            )}

            {!note.content && !pdfUrl && (
              <p className="text-gray-500 dark:text-gray-400">
                No content available.
              </p>
            )}
          </div>

          <div className="mt-10 flex justify-center sm:justify-end">
            <div className="grid grid-cols-3 sm:flex gap-3 sm:gap-4">
              <button
                onClick={() => navigate(`/note/${note.id}/edit`)}
                title="Edit Note"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg transition"
              >
                <FaEdit size={20} />
              </button>

              <button
                onClick={handleDelete}
                title="Delete Note"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transition"
              >
                <FaTrash size={20} />
              </button>

              <button
                onClick={handleShare}
                title="Share"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white flex items-center justify-center shadow-lg transition"
              >
                <FaShareAlt size={20} />
              </button>

              <button
                onClick={() => {
                  setSelectedContent(note.content || "");
                  setShowAI(true);
                }}
                title="AI Assistant"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-lg transition"
              >
                <FaRobot size={20} />
              </button>

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

      {showAI && (
        <AIAssistant
          text={selectedContent}
          noteId={note.id}
          closeModal={() => setShowAI(false)}
        />
      )}
    </div>
  );
}

export default NoteDetails;
