import { Link } from "react-router-dom";

function Hero() {
return (
  <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">

   
    <div className="absolute -top-32 -left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
    <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

    <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20 lg:py-32">

      <div className="grid lg:grid-cols-2 gap-14 items-center">

   

        <div>

          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold text-sm">
            🚀 Smart Study Platform
          </span>

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight text-slate-900 dark:text-white">
            Study
            <span className="text-blue-600"> Smarter</span>,
            <br />
            Not Harder.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-8 max-w-xl">
            Keep all your study notes organized, manage subjects,
            never miss revision reminders, and boost your productivity
            with one beautiful workspace.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">

            <Link
              to="/register"
              className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition duration-300"
            >
              Get Started →
            </Link>

            <Link
              to="/login"
              className="px-8 py-4 rounded-xl border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition duration-300"
            >
              Login
            </Link>

          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 text-center">
              <h3 className="text-2xl font-bold text-blue-600">📚</h3>
              <p className="mt-2 text-sm font-medium dark:text-white">
                Subjects
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 text-center">
              <h3 className="text-2xl font-bold text-green-600">📝</h3>
              <p className="mt-2 text-sm font-medium dark:text-white">
                Notes
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 text-center">
              <h3 className="text-2xl font-bold text-yellow-500">📌</h3>
              <p className="mt-2 text-sm font-medium dark:text-white">
                Pinned
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 text-center">
              <h3 className="text-2xl font-bold text-red-500">⏰</h3>
              <p className="mt-2 text-sm font-medium dark:text-white">
                Reminders
              </p>
            </div>

          </div>

        </div>

      

        <div className="hidden lg:flex justify-center">

          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-200 dark:border-slate-700">

            <div className="flex justify-between items-center mb-8">

              <h2 className="text-2xl font-bold dark:text-white">
                OrganizeNotes
              </h2>

              <span className="bg-green-100 dark:bg-green-900 text-green-600 px-3 py-1 rounded-full text-sm">
                Active
              </span>

            </div>

            <div className="space-y-5">

              <div className="rounded-xl bg-blue-600 text-white p-5 shadow-lg">
                <h3 className="font-bold text-lg">
                  Java Notes
                </h3>

                <p className="text-blue-100 mt-2">
                  Revision tomorrow • 9:00 AM
                </p>
              </div>

              <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-5">
                <h3 className="font-bold dark:text-white">
                  Database Systems
                </h3>

                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  12 Notes Available
                </p>
              </div>

              <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-5">
                <h3 className="font-bold dark:text-white">
                  Placement Prep
                </h3>

                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  DSA + Aptitude + SQL
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  </section>
);
}

export default Hero;