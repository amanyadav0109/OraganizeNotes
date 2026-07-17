import { useState } from "react";
import { createNote, updateNote } from "../services/noteService";

function AddNoteModal({ subjectId, closeModal, refreshNotes, editNote }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
 const [dueDate, setDueDate] = useState(
  editNote?.dueDate
    ? editNote.dueDate.slice(0, 16).replace(" ", "T")
    : ""
);

  const handleSubmit = async (e) => {
     
    e.preventDefault();

    try {
    
     
    const localDueDate = dueDate
  ? dueDate.replace("T", " ") + ":00"
  : null;

      if (editNote) {
        await updateNote(editNote.id, {
          title,
          content,
          dueDate: localDueDate,
        });
      } else {
        await createNote({
          title,
          content,
          dueDate: localDueDate,
          subjectId,
        });
      }

      refreshNotes();
      closeModal();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="modal w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in">
       

        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold dark:text-white">
            {editNote ? "✏️ Edit Note" : "📝 Add New Note"}
          </h2>

          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            {editNote
              ? "Update your study note."
              : "Create a new study note for your subject."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          

          <div>
            <label className="block mb-2 font-medium dark:text-white">
              Note Title
            </label>

            <input
              type="text"
              placeholder="Enter note title..."
              className="input w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

         

          <div>
            <label className="block mb-2 font-medium dark:text-white">
              Note Content
            </label>

            <textarea
              rows={8}
              placeholder="Write your notes here..."
              className="input w-full resize-none "
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

         

          <div>
            <label className="block mb-2 font-medium dark:text-white">
              Reminder (Optional)
            </label>

            <input
              type="datetime-local"
              className="input w-full"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

        

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-3">
            <button
              type="button"
              onClick={closeModal}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700 transition font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
               
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition font-medium shadow-lg"
            >
              {editNote ? "Update Note" : "Save Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddNoteModal;
