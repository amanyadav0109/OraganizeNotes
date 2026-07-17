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

import { getDashboardStats } from "../services/dashboardService";

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalSubjects: 0,
    totalNotes: 0,
    totalPinned: 0,
  });

  const loadStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="page bg-gray-50 dark:bg-slate-950 min-h-screen">
      <Navbar />

      <Sidebar />

      <main
        className="
        lg:ml-56
        
        p-4
        sm:p-6
        lg:p-8
        pb-24
        min-h-[calc(100vh-4rem)]
      "
      >
       

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

        

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mt-8">
          {/* Subjects */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <BookOpen className="text-blue-600 dark:text-blue-300" />
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold dark:text-white">
                {stats.totalSubjects}
              </h1>
            </div>

            <p className="mt-4 text-sm sm:text-base text-gray-500 dark:text-gray-400">
              Subjects
            </p>
          </div>

         
          <div className="bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <StickyNote className="text-green-600 dark:text-green-300" />
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold dark:text-white">
                {stats.totalNotes}
              </h1>
            </div>

            <p className="mt-4 text-sm sm:text-base text-gray-500 dark:text-gray-400">
              Notes
            </p>
          </div>

       
          <div className="bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                <Pin className="text-yellow-600 dark:text-yellow-300" />
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold dark:text-white">
                {stats.totalPinned}
              </h1>
            </div>

            <p className="mt-4 text-sm sm:text-base text-gray-500 dark:text-gray-400">
              Pinned
            </p>
          </div>

         
          <div className="bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-100 dark:bg-red-900 flex items-center justify-center">
                <CalendarDays className="text-red-600 dark:text-red-300" />
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold dark:text-white">
                {stats.dueToday}
              </h1>
            </div>

            <p className="mt-4 text-sm sm:text-base text-gray-500 dark:text-gray-400">
              Due Today
            </p>
          </div>
        </div>

     

        <section className="mt-8 lg:mt-10 bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl shadow-lg p-4 sm:p-6 lg:p-8">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-5 dark:text-white">
            📈 Notes Activity
          </h2>

          <div className="overflow-x-auto">
            <DashboardChart />
          </div>
        </section>

       

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 mt-8 lg:mt-10">
          

          <div className="xl:col-span-2 flex flex-col gap-6">
            {/* Calendar */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-5 dark:text-white">
                📅 Calendar
              </h2>
              <ReminderCalendar />
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-5 dark:text-white">
                ✅ Recently Completed
              </h2>
              <CompletedTasks />
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl shadow-lg p-4 sm:p-6 lg:p-8 h-full">
            <UpcomingReminders />
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}

export default Dashboard;
