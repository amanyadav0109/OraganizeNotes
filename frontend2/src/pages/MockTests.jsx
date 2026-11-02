
import {
  ClipboardList,
  Clock3,
  Target,
  Trophy,
  FileQuestion,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";

function MockTests() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Navbar />
      <Sidebar />

      <main className="lg:ml-56 p-4 sm:p-6 lg:p-8 pb-24">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-3">
            <ClipboardList size={34} />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Mock Tests</h1>
              <p className="mt-2 text-sm sm:text-base text-indigo-100">
                Test your preparation with timed exams.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: ClipboardList, title: "Tests Attempted", value: "—" },
            { icon: Target, title: "Average Score", value: "—" },
            { icon: Clock3, title: "Time Spent", value: "—" },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl bg-white p-5 shadow-md dark:bg-slate-900"
            >
              <item.icon size={25} className="text-indigo-500" />
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                {item.title}
              </p>
              <h2 className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
                {item.value}
              </h2>
            </div>
          ))}
        </div>

        <section className="mt-7 rounded-3xl bg-white p-5 sm:p-7 shadow-lg dark:bg-slate-900">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Available Mock Tests
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Choose a test to evaluate your preparation.
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "Custom Mock Test",
                description: "Create a test from your selected subjects and notes.",
                questions: "Custom questions",
                time: "Custom duration",
              },
              {
                title: "Full Length Test",
                description: "Attempt a complete exam-style test in one session.",
                questions: "Multiple topics",
                time: "Timed test",
              },
            ].map((test) => (
              <div
                key={test.title}
                className="rounded-2xl border border-gray-200 p-5 dark:border-slate-700"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/40">
                  <FileQuestion className="text-indigo-600 dark:text-indigo-300" size={24} />
                </div>

                <h3 className="mt-4 font-bold text-gray-900 dark:text-white">
                  {test.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {test.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span>{test.questions}</span>
                  <span>•</span>
                  <span>{test.time}</span>
                </div>

                <p className="mt-4 rounded-lg bg-gray-100 p-3 text-center text-sm text-gray-500 dark:bg-slate-800 dark:text-gray-400">
                  Test engine coming next
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-3xl bg-white p-6 shadow-lg dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <Trophy className="text-yellow-500" size={26} />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Previous Test Results
            </h2>
          </div>
          <div className="py-8 text-center">
            <ClipboardList size={34} className="mx-auto text-gray-400" />
            <p className="mt-3 font-semibold text-gray-700 dark:text-gray-300">
              No test results available
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Your test history will appear here after you submit a mock test.
            </p>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

export default MockTests;
