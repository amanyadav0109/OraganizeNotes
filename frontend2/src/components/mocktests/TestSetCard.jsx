import { Clock3, FileQuestion, Target, Languages } from "lucide-react";

function TestSetCard({ test, onSelectLanguage }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
          <FileQuestion size={24} />
        </div>

        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
          Available
        </span>
      </div>

      <h3 className="mt-5 text-lg font-bold text-gray-900 dark:text-white">
        {test.title}
      </h3>

      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {test.description}
      </p>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-gray-50 p-3 dark:bg-slate-800">
          <FileQuestion size={17} className="text-indigo-500" />
          <p className="mt-2 text-sm font-bold text-gray-900 dark:text-white">
            {test.questions}
          </p>
          <p className="text-[11px] text-gray-500">Questions</p>
        </div>

        <div className="rounded-xl bg-gray-50 p-3 dark:bg-slate-800">
          <Clock3 size={17} className="text-orange-500" />
          <p className="mt-2 text-sm font-bold text-gray-900 dark:text-white">
            {test.duration} min
          </p>
          <p className="text-[11px] text-gray-500">Duration</p>
        </div>

        <div className="rounded-xl bg-gray-50 p-3 dark:bg-slate-800">
          <Target size={17} className="text-emerald-500" />
          <p className="mt-2 text-sm font-bold text-gray-900 dark:text-white">
            {test.difficulty}
          </p>
          <p className="text-[11px] text-gray-500">Level</p>
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          <Languages size={17} />
          Select Test Language
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onSelectLanguage(test, "English")}
            className="rounded-xl border border-indigo-200 bg-indigo-50 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-600 hover:text-white dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-600 dark:hover:text-white"
          >
            English
          </button>

          <button
            onClick={() => onSelectLanguage(test, "Hindi")}
            className="rounded-xl border border-orange-200 bg-orange-50 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-500 hover:text-white dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-400 dark:hover:bg-orange-600 dark:hover:text-white"
          >
            हिंदी
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestSetCard;