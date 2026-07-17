import { useEffect, useState } from "react";
import {
  createSubject,
  updateSubject,
} from "../services/subjectService";

function AddSubjectModal({
  closeModal,
  refreshSubjects,
  editSubject,
}) {
  const [subjectName, setSubjectName] = useState("");

  useEffect(() => {
    if (editSubject) {
      setSubjectName(editSubject.subjectName);
    }
  }, [editSubject]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subjectName.trim()) {
      alert("Enter Subject Name");
      return;
    }

    try {
      if (editSubject) {
        await updateSubject(editSubject.id, {
          subjectName,
        });
      } else {
        await createSubject({
          subjectName,
        });
      }

      refreshSubjects();
      closeModal();
    } catch (err) {
      console.log(err);
    }
  };

return (
  <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

    <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in">

      {/* Header */}

      <div className="mb-6">

        <h2 className="text-2xl sm:text-3xl font-bold dark:text-white">
          {editSubject ? "✏️ Edit Subject" : "📚 Create Subject"}
        </h2>

        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
          {editSubject
            ? "Update your subject name."
            : "Create a new subject to organize your notes."}
        </p>

      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Subject Name */}

        <div>

          <label className="block mb-2 font-medium dark:text-white">
            Subject Name
          </label>

          <input
            type="text"
            placeholder="e.g. Data Structures"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

        </div>

        {/* Buttons */}

        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">

          <button
            type="button"
            onClick={closeModal}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 dark:border-slate-600 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700 transition font-medium"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition font-medium"
          >
            {editSubject ? "Update Subject" : "Create Subject"}
          </button>

        </div>

      </form>

    </div>

  </div>
);
}

export default AddSubjectModal;