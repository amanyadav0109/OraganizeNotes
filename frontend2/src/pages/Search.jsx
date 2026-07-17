import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import { searchNotes,searchSubjects,deleteNote, pinNote } from "../services/noteService";

import AddNoteModal from "../components/AddNoteModal";
import SubjectCard from "../components/SubjectCard";

function Search() {
  const { query } = useParams();
const navigate = useNavigate();
 const [subjects, setSubjects] = useState([]);
const [notes, setNotes] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [selectedNote, setSelectedNote] = useState(null);

  const loadNotes = async () => {
    try {
      const data = await searchNotes(query);

      setNotes(data);
    } catch (err) {
      console.log(err);
    }
  };
  const loadSubjects = async () => {
  try {
    const data = await searchSubjects(query);
    setSubjects(data);
  } catch (err) {
    console.log(err);
  }
};

  useEffect(() => {
  const loadData = async () => {
    try {
      const subjectData = await searchSubjects(query);

      if (subjectData.length > 0) {
        
        setSubjects(subjectData);
        setNotes([]);
      } else {
       
        const noteData = await searchNotes(query);
        setSubjects([]);
        setNotes(noteData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  loadData();
}, [query]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;

    await deleteNote(id);

    loadNotes();
  };

  const handlePin = async (id) => {
    await pinNote(id);

    loadNotes();
  };

return (
  <div className="page">
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
      <h1 className="text-3xl font-bold dark:text-white">
        Search Results
      </h1>

      <p className="text-gray-500 dark:text-gray-400 mt-2 mb-8">
        Searching for <span className="font-semibold">"{query}"</span>
      </p>

      {/* Subjects */}

     {subjects.length > 0 && (
  <>
    <h2 className="text-2xl font-bold mb-6 dark:text-white">
      📚 Subjects
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
      {subjects.map((subject) => (
        <SubjectCard
          key={subject.id}
          subject={subject}
          onClick={() => navigate(`/subject/${subject.id}`)}
        />
      ))}
    </div>
  </>
)}

      {/* Notes */}

   

{notes.length > 0 && (
  <>
    <h2 className="text-2xl font-bold mb-6 dark:text-white">
      📝 Notes
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {notes.map((note) => (
        <div
          key={note.id}
          onClick={() => navigate(`/note/${note.id}`)}
          className="card p-6 hover:shadow-xl hover:-translate-y-1 transition cursor-pointer"
        >
          <div className="flex justify-between">
            <div>
              <h2 className="text-2xl font-bold dark:text-white capitalize">
                {note.title}
              </h2>

              <p className="mt-4 text-gray-600 dark:text-gray-300 line-clamp-3">
                {note.content}
              </p>

              {note.subjectName && (
                <p className="mt-3 text-blue-600 dark:text-blue-400 text-sm">
                  📚 {note.subjectName}
                </p>
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePin(note.id);
              }}
              className="text-2xl"
            >
              {note.isPinned ? "📌" : "📍"}
            </button>
          </div>

          {note.dueDate && (
            <p className="mt-4 text-sm text-gray-500">
              📅 {new Date(note.dueDate).toLocaleDateString()}
            </p>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedNote(note);
                setShowModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              Edit
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(note.id);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  </>
)}

      {subjects.length === 0 && notes.length === 0 && (
        <div className="card p-10 text-center mt-10">
          <h2 className="text-2xl font-bold">
            No Results Found 😢
          </h2>

          <p className="mt-3 text-gray-500">
            Try another keyword.
          </p>
        </div>
      )}
    </main>

    {showModal && (
      <AddNoteModal
        editNote={selectedNote}
        subjectId={selectedNote?.subjectId}
        refreshNotes={loadNotes}
        closeModal={() => {
          setSelectedNote(null);
          setShowModal(false);
        }}
      />
    )}
  </div>
);
}

export default Search;
