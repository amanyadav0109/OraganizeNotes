import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  FileQuestion,
  Languages,
  Play,
  Trophy,
} from "lucide-react";

function TestInstructions({
  test,
  category,
  subject,
  language,
  stream,
  exam,
  onBack,
  onStart,
}) {
  const instructions = [
    "Read each question carefully before selecting an answer.",
    "Each question carries 1 mark.",
    "There is no negative marking in this demo test.",
    "The timer will start when you click Start Test.",
    "You can navigate between questions during the test.",
    "You can submit the test before the timer ends.",
    "The test will automatically submit when the timer reaches zero.",
  ];

  return (
    <section className="mx-auto mt-8 max-w-3xl">
      <button
        onClick={onBack}
        className="mb-5 flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400"
      >
        <ArrowLeft size={17} />
        Back to Test Sets
      </button>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        {/* Heading */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <BookOpen size={28} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Test Instructions
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Read all instructions before starting.
            </p>
          </div>
        </div>

        {/* Test details */}
        <div className="mt-7 rounded-2xl bg-gray-50 p-5 dark:bg-slate-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {test?.title}
          </h3>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {category?.name}
            {stream ? ` / ${stream}` : ""}
            {exam ? ` / ${exam}` : ""}
            {" / "}
            {subject?.name}
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-100 px-3 py-2 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
            <Languages size={15} />
            Selected Language: {language}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-100 p-4 dark:border-slate-700">
            <FileQuestion size={21} className="text-indigo-500" />
            <p className="mt-3 text-xl font-bold text-gray-900 dark:text-white">
              {test?.questions}
            </p>
            <p className="mt-1 text-xs text-gray-500">Questions</p>
          </div>

          <div className="rounded-xl border border-gray-100 p-4 dark:border-slate-700">
            <Clock3 size={21} className="text-orange-500" />
            <p className="mt-3 text-xl font-bold text-gray-900 dark:text-white">
              {test?.duration} min
            </p>
            <p className="mt-1 text-xs text-gray-500">Duration</p>
          </div>

          <div className="rounded-xl border border-gray-100 p-4 dark:border-slate-700">
            <Trophy size={21} className="text-emerald-500" />
            <p className="mt-3 text-xl font-bold text-gray-900 dark:text-white">
              {test?.questions}
            </p>
            <p className="mt-1 text-xs text-gray-500">Total Marks</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8">
          <h3 className="font-bold text-gray-900 dark:text-white">
            Important Instructions
          </h3>

          <ul className="mt-4 space-y-4">
            {instructions.map((instruction, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-sm leading-6 text-gray-600 dark:text-gray-300"
              >
                <CheckCircle2
                  size={18}
                  className="mt-1 shrink-0 text-emerald-500"
                />
                {instruction}
              </li>
            ))}
          </ul>
        </div>

        {/* Start */}
        <button
          onClick={onStart}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-4 font-bold text-white transition hover:bg-indigo-700"
        >
          <Play size={18} />
          Start Test Now
        </button>
      </div>
    </section>
  );
}

export default TestInstructions;