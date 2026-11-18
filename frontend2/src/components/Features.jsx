import {
  FaBook,
  FaBell,
  FaFilePdf,
  FaLayerGroup,
  FaBrain,
  FaClipboardList,
  FaChartLine,
  FaRobot,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
function Features() {
 return (
  
<section
  id="features"
  className="relative py-16 sm:py-20 lg:py-24 bg-slate-50 dark:bg-slate-950 overflow-hidden"
>
  
  <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
  <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

  <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

 
    <div className="text-center mb-12 sm:mb-16">

      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-semibold">
        ✨ Everything in One Place
      </span>

      <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
        Everything You Need To
        <span className="block sm:inline text-blue-600 dark:text-blue-400">
          {" "}Study Better
        </span>
      </h2>

      <p className="mt-5 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 leading-7">
        From organizing your study materials to practicing questions
        and tracking performance, get all the tools you need to
        make learning smarter and more productive.
      </p>

    </div>

   
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">

     
      <div className="group bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-200 dark:border-slate-800">

        <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center group-hover:scale-110 transition-transform">
          <FaBook className="text-2xl text-blue-600 dark:text-blue-300" />
        </div>

        <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
          Smart Notes
        </h3>

        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-7">
          Create, organize, pin and manage your study notes with
          an easy-to-use workspace.
        </p>

      </div>

      
      <div className="group bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-200 dark:border-slate-800">

        <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center group-hover:scale-110 transition-transform">
          <FaLayerGroup className="text-2xl text-indigo-600 dark:text-indigo-300" />
        </div>

        <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
          Subject Management
        </h3>

        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-7">
          Keep your subjects and learning materials structured
          and easily accessible in one place.
        </p>

      </div>

     
      <div className="group bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-200 dark:border-slate-800">

        <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center group-hover:scale-110 transition-transform">
          <FaBell className="text-2xl text-green-600 dark:text-green-300" />
        </div>

        <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
          Smart Reminders
        </h3>

        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-7">
          Schedule revisions, manage deadlines and receive
          reminders so you never miss important tasks.
        </p>

      </div>


      <div className="group bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-200 dark:border-slate-800">

        <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center group-hover:scale-110 transition-transform">
          <FaBrain className="text-2xl text-purple-600 dark:text-purple-300" />
        </div>

        <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
          Practice Questions
        </h3>

        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-7">
          Practice subject-wise and topic-wise questions with
          instant answer feedback and explanations.
        </p>

      </div>

      
      <div className="group bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-200 dark:border-slate-800">

        <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center group-hover:scale-110 transition-transform">
          <FaClipboardList className="text-2xl text-orange-600 dark:text-orange-300" />
        </div>

        <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
          Mock Tests
        </h3>

        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-7">
          Attempt structured mock tests, evaluate your answers
          and improve your exam preparation.
        </p>

      </div>

    
      <div className="group bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-200 dark:border-slate-800">

        <div className="w-14 h-14 rounded-2xl bg-cyan-100 dark:bg-cyan-900/40 flex items-center justify-center group-hover:scale-110 transition-transform">
          <FaChartLine className="text-2xl text-cyan-600 dark:text-cyan-300" />
        </div>

        <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
          Performance Analytics
        </h3>

        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-7">
          Track accuracy, analyze subject-wise performance
          and identify topics that need improvement.
        </p>

      </div>

    
      <div className="group bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-200 dark:border-slate-800">

        <div className="w-14 h-14 rounded-2xl bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center group-hover:scale-110 transition-transform">
          <FaRobot className="text-2xl text-pink-600 dark:text-pink-300" />
        </div>

        <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
          AI Study Assistant
        </h3>

        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-7">
          Generate summaries, interview questions and MCQs
          to make your revision more effective.
        </p>

      </div>

      
      <div className="group bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-200 dark:border-slate-800">

        <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center group-hover:scale-110 transition-transform">
          <FaFilePdf className="text-2xl text-red-600 dark:text-red-300" />
        </div>

        <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
          PDF Export
        </h3>

        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-7">
          Download and save your study notes as professional
          PDF documents for offline revision.
        </p>

      </div>

    </div>


    <div className="mt-12 sm:mt-16 text-center">

      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
        Everything you need to stay organized and keep improving.
      </p>

      <Link
        to="/register"
        className="inline-flex items-center gap-2 mt-5 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:-translate-y-1 transition-all duration-300"
      >
        Start Learning Today
        <span>→</span>
      </Link>

    </div>

  </div>
</section>

);
}

export default Features;