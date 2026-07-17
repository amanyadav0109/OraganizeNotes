import { FaBook, FaEdit, FaTrash } from "react-icons/fa";

function SubjectCard({ subject, onClick, onEdit, onDelete }) {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
    

      <div className="flex items-start justify-between gap-4 mb-5">
       

        <div className="flex items-center gap-4 min-w-0">
          <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
            <FaBook className="text-3xl text-blue-600 dark:text-blue-400" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white capitalize break-words">
            {subject.subjectName}
          </h2>
        </div>

        {/* Right Buttons */}

        <div className="flex items-center gap-2 flex-shrink-0">
      

          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(subject);
            }}
            className="w-10 h-10 rounded-lg flex items-center justify-center
            bg-gray-100 dark:bg-slate-700
            hover:bg-blue-100 dark:hover:bg-blue-900
            transition"
          >
            <FaEdit className="text-blue-600 dark:text-blue-400" />
          </button>

         
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(subject.id);
            }}
            className="w-10 h-10 rounded-lg flex items-center justify-center
            bg-gray-100 dark:bg-slate-700
            hover:bg-red-100 dark:hover:bg-red-900
            transition"
          >
            <FaTrash className="text-red-600 dark:text-red-400" />
          </button>
        </div>
      </div>

 

      <p className="text-gray-500 dark:text-gray-400 text-lg mb-5">
        {subject.totalNotes || 0} Notes
      </p>
      <div className="border-t border-gray-200 dark:border-slate-700 mb-5"></div>
      <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg">
        Open Notes →
      </p>
    </div>
  );
}

export default SubjectCard;