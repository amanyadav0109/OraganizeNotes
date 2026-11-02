
import {
  ChartNoAxesCombined,
  Target,
  Brain,
  TrendingUp,
  Award,
  BarChart3,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";

function Analytics() {
  const stats = [
    { title: "Questions Solved", value: "—", icon: Brain },
    { title: "Average Accuracy", value: "—", icon: Target },
    { title: "Study Progress", value: "—", icon: TrendingUp },
    { title: "Best Score", value: "—", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Navbar />
      <Sidebar />

      <main className="lg:ml-56 p-4 sm:p-6 lg:p-8 pb-24">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-3">
            <ChartNoAxesCombined size={34} />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Performance Analytics
              </h1>
              <p className="mt-2 text-sm sm:text-base text-blue-100">
                Understand your progress and improve your preparation.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-2xl bg-white p-4 sm:p-5 shadow-md dark:bg-slate-900"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/40">
                <stat.icon className="text-blue-600 dark:text-blue-300" size={21} />
              </div>

              <p className="mt-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {stat.title}
              </p>

              <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </h2>
            </div>
          ))}
        </div>

        <div className="mt-7 grid grid-cols-1 xl:grid-cols-2 gap-6">
          <section className="rounded-3xl bg-white p-5 sm:p-7 shadow-lg dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <BarChart3 className="text-blue-600 dark:text-blue-400" size={25} />
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Weekly Performance
              </h2>
            </div>

            <div className="mt-6 flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 dark:border-slate-700 text-center p-5">
              <ChartNoAxesCombined size={38} className="text-gray-400" />
              <p className="mt-3 font-semibold text-gray-700 dark:text-gray-300">
                No performance data yet
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Complete practice sessions to see your weekly progress.
              </p>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-5 sm:p-7 shadow-lg dark:bg-slate-900">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Topic Performance
            </h2>

            <div className="mt-6 flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 dark:border-slate-700 text-center p-5">
              <Target size={38} className="text-gray-400" />
              <p className="mt-3 font-semibold text-gray-700 dark:text-gray-300">
                Topic analysis not available
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Your strong and weak topics will appear after completing tests.
              </p>
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-3xl bg-white p-5 sm:p-7 shadow-lg dark:bg-slate-900">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Areas to Improve
          </h2>
          <div className="mt-5 rounded-2xl bg-gray-50 p-5 text-center dark:bg-slate-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Complete some practice tests to identify your weak areas.
            </p>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

export default Analytics;
