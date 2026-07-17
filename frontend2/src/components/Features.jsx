import { FaBook, FaBell, FaSearch ,FaFilePdf} from "react-icons/fa";

function Features() {
 return (
  <section  id="features" className="py-20 bg-slate-50 dark:bg-slate-950">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="mt-5 text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
          Everything You Need To
          <span className="text-blue-600"> Study Better</span>
        </h2>

        <p className="mt-5 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
          Powerful tools designed for students to organize notes,
          manage subjects, track reminders and improve productivity.
        </p>

      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
     
        <div className="group bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300 border border-gray-100 dark:border-slate-700">

          <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center group-hover:scale-110 transition">

            <FaBook className="text-3xl text-blue-600 dark:text-blue-300" />

          </div>

          <h3 className="mt-6 text-2xl font-bold dark:text-white">
            Subjects
          </h3>

          <p className="mt-3 text-gray-600 dark:text-gray-300 leading-7">
            Create unlimited subjects and organize every note in one
            beautiful workspace.
          </p>

        </div>

        

        <div className="group bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300 border border-gray-100 dark:border-slate-700">

          <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900 flex items-center justify-center group-hover:scale-110 transition">

            <FaBell className="text-3xl text-green-600 dark:text-green-300" />

          </div>

          <h3 className="mt-6 text-2xl font-bold dark:text-white">
            Smart Reminders
          </h3>

          <p className="mt-3 text-gray-600 dark:text-gray-300 leading-7">
            Never miss your revision schedule with automatic reminder
            notifications.
          </p>

        </div>

       

        <div className="group bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300 border border-gray-100 dark:border-slate-700">

          <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900 flex items-center justify-center group-hover:scale-110 transition">

            <FaFilePdf className="text-3xl text-purple-600 dark:text-purple-300" />

          </div>

          <h3 className="mt-6 text-2xl font-bold dark:text-white">
            PDF Export
          </h3>

          <p className="mt-3 text-gray-600 dark:text-gray-300 leading-7">
             Export your notes as professional PDF files with one click.
          </p>

        </div>

        <div className="group bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300 border border-gray-100 dark:border-slate-700">

          <div className="w-16 h-16 rounded-2xl bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center group-hover:scale-110 transition">

            <FaSearch className="text-3xl text-yellow-500" />

          </div>

          <h3 className="mt-6 text-2xl font-bold dark:text-white">
            Smart Search
          </h3>

          <p className="mt-3 text-gray-600 dark:text-gray-300 leading-7">
           Quickly find notes and subjects using instant search.
          </p>

        </div>

      </div>

    </div>

  </section>
);
}

export default Features;