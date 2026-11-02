
import {
  CalendarDays,
  BookOpen,
  Clock3,
  Brain,
  RefreshCw,
  Target,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";

function RevisionPlan() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Navbar />
      <Sidebar />

      <main className="lg:ml-56 p-4 sm:p-6 lg:p-8 pb-24">
        <div className="rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-600 p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-3">
            <CalendarDays size={34} />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Revision Plan
              </h1>
              <p className="mt-2 text-sm sm:text-base text-purple-100">
                Build a better revision routine and remember what you learn.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: "Topics to Revise", value: "—", icon: BookOpen },
            { title: "Revision Sessions", value: "—", icon: RefreshCw },
            { title: "Daily Study Goal", value: "—", icon: Target },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl bg-white p-5 shadow-md dark:bg-slate-900"
            >
              <item.icon className="text-purple-600 dark:text-purple-400" size={25} />
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
          <div className="flex items-center gap-3">
            <Brain className="text-purple-600 dark:text-purple-400" size={26} />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Recommended Revision
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Topics that need more attention.
              </p>
            </div>
          </div>

          <div className="mt-6 flex min-h-[190px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 p-5 text-center dark:border-slate-700">
            <BookOpen size={38} className="text-gray-400" />
            <p className="mt-3 font-semibold text-gray-700 dark:text-gray-300">
              No revision recommendations yet
            </p>
            <p className="mt-1 max-w-md text-sm text-gray-500 dark:text-gray-400">
              Once you complete practice tests, we can identify weak topics and create a personalized revision plan.
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-3xl bg-white p-5 sm:p-7 shadow-lg dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <Clock3 className="text-purple-600 dark:text-purple-400" size={25} />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Your Revision Schedule
            </h2>
          </div>

          <div className="mt-5 rounded-2xl bg-gray-50 p-6 text-center dark:bg-slate-800">
            <CalendarDays size={34} className="mx-auto text-gray-400" />
            <p className="mt-3 font-semibold text-gray-700 dark:text-gray-300">
              Your schedule is empty
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Your personalized revision schedule will appear here.
            </p>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

export default RevisionPlan;
