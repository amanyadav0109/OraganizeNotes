
import { useEffect, useState } from "react";
import {
  BookOpen,
  StickyNote,
  Pin,
  CalendarDays,
  Sparkles,
} from "lucide-react";

import CompletedTasks from "../components/CompletedTasks";
import { useAuth } from "../context/AuthContext";
import BottomNav from "../components/BottomNav";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ReminderCalendar from "../components/ReminderCalendar";
import UpcomingReminders from "../components/UpcomingReminders";
import DashboardChart from "../components/DashboardChart";
import FindNotes from "../components/FindNotes";
import { getDashboardStats } from "../services/dashboardService";
import TodayTasks from "../components/TodayTasks";

// New Dashboard Components
import StudyProgress from "../components/StudyProgress";
import QuickActions from "../components/QuickActions";
import RecommendedPractice from "../components/RecommendedPractice";
import RecentActivity from "../components/RecentActivity";
import WeeklyStudyActivity from "../components/WeeklyStudyActivity";

function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalSubjects: 0,
    totalNotes: 0,
    totalPinned: 0,
    dueToday: 0,
  });

  const loadStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      console.log("Dashboard stats error:", err);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="page min-h-screen bg-gray-50 dark:bg-slate-950">
      <Navbar />
      <Sidebar />

      <main className="lg:ml-56 p-4 sm:p-6 lg:p-8 pb-24 min-h-[calc(100vh-4rem)]">

        {/* Welcome Banner */}
        <div className="rounded-2xl lg:rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-5 sm:p-7 lg:p-10 shadow-xl">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                Welcome, {user?.name || "User"}!
              </h1>

              <p className="mt-2 text-sm sm:text-base lg:text-lg text-blue-100 max-w-2xl">
                Organize your notes, complete reminders and boost your
                productivity.
              </p>
            </div>

            <div className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl">
              <Sparkles size={28} />

              <div>
                <p className="text-sm text-blue-100">Keep Learning</p>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">
                  Every Day 🚀
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mt-8">

          {[
            {
              title: "Subjects",
              value: stats.totalSubjects,
              icon: BookOpen,
              color: "blue",
            },
            {
              title: "Notes",
              value: stats.totalNotes,
              icon: StickyNote,
              color: "green",
            },
            {
              title: "Pinned",
              value: stats.totalPinned,
              icon: Pin,
              color: "yellow",
            },
            {
              title: "Due Today",
              value: stats.dueToday,
              icon: CalendarDays,
              color: "red",
            },
          ].map((item) => {
            const Icon = item.icon;

            const colors = {
              blue: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
              green: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
              yellow: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300",
              red: "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300",
            };

            return (
              <div
                key={item.title}
                className="bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${colors[item.color]}`}>
                    <Icon size={22} />
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold dark:text-white">
                    {item.value ?? 0}
                  </h2>
                </div>

                <p className="mt-4 text-sm sm:text-base text-gray-500 dark:text-gray-400">
                  {item.title}
                </p>
              </div>
            );
          })}
        </div>

        {/* New Study Dashboard Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

          <StudyProgress
            completed={stats.totalNotes}
            total={stats.totalNotes}
          />

          <QuickActions />

          <WeeklyStudyActivity />

          <RecommendedPractice topics={[]} />

        </section>

        {/* Notes Activity and Find Notes */}
        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-stretch">

          <section className="w-full lg:w-1/2 bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl shadow-lg p-4 sm:p-6 lg:p-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-5 dark:text-white">
              📈 Notes Activity
            </h2>

            <div className="overflow-x-auto">
              <DashboardChart />
            </div>
          </section>

          <section className="notes-scroll w-full lg:w-1/2 bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl shadow-lg p-4 sm:p-6 lg:p-8 flex flex-col max-h-[600px] overflow-y-auto">
            <FindNotes />
          </section>
        </div>

        {/* Calendar and Reminders */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 mt-8 lg:mt-10">

          <div className="xl:col-span-2 flex flex-col gap-6">

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg p-4 sm:p-6 lg:p-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-5 dark:text-white">
                📅 Calendar
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-[350px_minmax(0,1fr)] gap-6 lg:gap-8 items-start">

                <div className="min-w-0">
                  <ReminderCalendar />
                </div>

                <div className="min-w-0">
                  <TodayTasks />
                </div>

              </div>
            </div>

            {/* Recently Completed */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 p-5 sm:p-6 flex flex-col h-[400px]">

              <div className="flex items-center justify-between mb-5 shrink-0">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
                    Recently Completed
                  </h2>

                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Your recently finished tasks
                  </p>
                </div>

                <div className="w-11 h-11 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <span className="text-xl">✅</span>
                </div>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-slate-100 dark:[&::-webkit-scrollbar-track]:bg-slate-800 [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-600 [&::-webkit-scrollbar-thumb]:rounded-full">
                <CompletedTasks />
              </div>

            </div>

          </div>

          {/* Upcoming Reminders */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl shadow-lg p-4 sm:p-6 lg:p-8 h-full">
            <UpcomingReminders />
          </div>

        </section>

        {/* Recent Learning Activity */}
        <section className="mt-8">
          <RecentActivity activities={[]} />
        </section>

      </main>

      <BottomNav />
    </div>
  );
}

export default Dashboard;
