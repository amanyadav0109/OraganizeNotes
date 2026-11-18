import { Link } from "react-router-dom";

function Hero() {
return (

<section className="relative isolate overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">


  <div className="absolute -top-32 -left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
  <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
  <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

  <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-28">

    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

    
      <div className="text-center lg:text-left">

        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold text-xs sm:text-sm border border-blue-200 dark:border-blue-800">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Smart Learning & Productivity Platform
        </span>

        <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.15] tracking-tight text-slate-900 dark:text-white">
          Your Learning.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            One Smart Space.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 leading-8 max-w-xl mx-auto lg:mx-0">
          Organize notes, manage subjects, practice questions, take mock tests,
          track your performance and prepare smarter with AI-powered learning
          tools — all in one platform.
        </p>

        <div className="mt-7 flex flex-wrap justify-center lg:justify-start gap-2.5">

          {[
            "📝 Smart Notes",
            "🧠 Practice Questions",
            "📊 Performance Analytics",
            "✨ AI Assistant",
          ].map((feature) => (
            <span
              key={feature}
              className="px-3 py-2 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm"
            >
              {feature}
            </span>
          ))}

        </div>

       
        <div className="mt-9 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">

          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-600/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            Get Started
            <span>→</span>
          </Link>

          <Link
            to="/login"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-500 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white font-semibold transition-all duration-300"
          >
            Login
          </Link>

        </div>

        <p className="mt-5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Organize better. Practice smarter. Track your progress.
        </p>

      </div>

      
      <div className="relative w-full max-w-lg mx-auto lg:mx-0">

        
        <div className="absolute -top-5 -right-2 sm:-right-5 z-10 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
            <span>📈</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Learning Progress
            </p>
            <p className="font-bold text-sm text-slate-800 dark:text-white">
              Track Your Growth
            </p>
          </div>
        </div>

       
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-5 sm:p-7 border border-slate-200 dark:border-slate-700">

          
          <div className="flex items-center justify-between gap-3 mb-7">

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                OrganizeNotes
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Your personal learning dashboard
              </p>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Learning
            </div>

          </div>

         
          <div className="grid grid-cols-3 gap-3 mb-6">

            <div className="rounded-xl bg-blue-50 dark:bg-blue-500/10 p-3 text-center">
              <div className="text-xl">📚</div>
              <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                Notes
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                Organized
              </p>
            </div>

            <div className="rounded-xl bg-purple-50 dark:bg-purple-500/10 p-3 text-center">
              <div className="text-xl">🧠</div>
              <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                Practice
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                Questions
              </p>
            </div>

            <div className="rounded-xl bg-green-50 dark:bg-green-500/10 p-3 text-center">
              <div className="text-xl">📊</div>
              <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mt-1">
                Analytics
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                Performance
              </p>
            </div>

          </div>

          
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-4 sm:p-5 text-white mb-4">

            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-blue-100 text-xs sm:text-sm">
                  Your Learning Plan
                </p>
                <h3 className="text-lg font-bold mt-1">
                  Keep Moving Forward 🚀
                </h3>
              </div>

              <span className="text-3xl">🎯</span>
            </div>

            <div className="mt-5">
              <div className="flex justify-between text-xs text-blue-100 mb-2">
                <span>Daily Progress</span>
                <span>Stay Consistent</span>
              </div>

              <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                <div className="h-full w-3/5 bg-white rounded-full" />
              </div>
            </div>

          </div>

         
          <div className="space-y-3">

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-lg">
                📝
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-slate-800 dark:text-white">
                  Smart Notes
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Organize your study material
                </p>
              </div>

              <span className="text-green-500 text-xs font-semibold">
                Ready
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-lg">
                🧠
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-slate-800 dark:text-white">
                  Practice & Mock Tests
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Test your knowledge
                </p>
              </div>

              <span className="text-purple-500 text-xs font-semibold">
                Learn
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-lg">
                ✨
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-slate-800 dark:text-white">
                  AI Study Assistant
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Learn with AI-powered tools
                </p>
              </div>

              <span className="text-amber-500 text-xs font-semibold">
                Smart
              </span>
            </div>

          </div>

        </div>

      
        <div className="absolute -bottom-5 -left-2 sm:-left-5 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
            <span>✨</span>
          </div>

          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Study Smarter
            </p>
            <p className="font-bold text-sm text-slate-800 dark:text-white">
              All in One Place
            </p>
          </div>
        </div>

      </div>

    </div>

  </div>

</section>

);
}

export default Hero;