import { BookOpen, ChevronRight } from "lucide-react";

function SubjectCard({ subject, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 text-left transition hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
        <BookOpen size={23} />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-bold text-gray-900 dark:text-white">
          {subject.name}
        </h3>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Practice subject-wise mock tests
        </p>
      </div>

      <ChevronRight
        size={20}
        className="text-gray-400 group-hover:translate-x-1 group-hover:text-indigo-600"
      />
    </button>
  );
}

export default SubjectCard;