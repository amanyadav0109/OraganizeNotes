
import {
  FaMoon,
  FaRobot,
  FaLock,
  FaBolt,
  FaMobileAlt,
  FaChartLine,
  FaBookOpen,
  FaClipboardCheck,
} from "react-icons/fa";

function WhyChoose() {
  const features = [
    {
      title: "AI Study Assistant",
      description:
        "Generate notes summaries, interview questions and MCQs with AI to make your learning faster and more effective.",
      icon: <FaRobot />,
    },
    {
      title: "Smart Practice Questions",
      description:
        "Practice subject-wise and topic-wise questions, check your answers and improve your understanding.",
      icon: <FaBookOpen />,
    },
    {
      title: "Mock Tests",
      description:
        "Test your preparation with mock exams and evaluate your performance to identify areas that need improvement.",
      icon: <FaClipboardCheck />,
    },
    {
      title: "Performance Analytics",
      description:
        "Track your accuracy, correct and incorrect answers, subject-wise performance and weak topics.",
      icon: <FaChartLine />,
    },
    {
      title: "Dark Mode & Responsive Design",
      description:
        "Enjoy a comfortable study experience with dark mode and a responsive interface across desktop, tablet and mobile.",
      icon: <FaMoon />,
    },
    {
      title: "Secure Student Account",
      description:
        "Access your personal study space with secure authentication and manage your learning materials in one place.",
      icon: <FaLock />,
    },
  ];

  return (
    <section
      id="why-choose"
      className="relative overflow-hidden py-20 sm:py-24 bg-gradient-to-b from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
    >
      {/* Background Effects */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-blue-400/10 dark:bg-blue-500/10 blur-3xl rounded-full" />
      <div className="absolute bottom-10 right-0 w-72 h-72 bg-indigo-400/10 dark:bg-indigo-500/10 blur-3xl rounded-full" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">

          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-sm font-semibold">
            <FaBolt />
            Why Choose OrganizeNotes?
          </span>

          <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            Everything You Need For
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Smarter Learning
            </span>
          </h2>

          <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-8">
            From organizing your notes to practicing questions and tracking
            your progress, OrganizeNotes brings your entire study experience
            together in one smart platform.
          </p>

        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-14">

          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-7 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300"
            >

              {/* Icon */}
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl shadow-lg shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="mt-6 text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-7">
                {feature.description}
              </p>

              {/* Bottom Accent */}
              <div className="mt-6 w-12 h-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:w-20 transition-all duration-300" />

            </div>
          ))}

        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Everything you need to stay organized and study smarter.
          </p>
        </div>

      </div>
    </section>
  );
}

export default WhyChoose;
