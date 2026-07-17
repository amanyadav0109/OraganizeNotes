
import {
  FaMoon,
  FaRobot,
  FaLock,
  FaBolt,
  FaMobileAlt,
  FaCloud
} from "react-icons/fa";

function WhyChoose() {

  const features = [
    "AI Assitants",
    "Dark Mode",
    "Responsive Design",
    "Secure Login",
    
    
  ];

  const icons = [
    <FaRobot />,
    <FaMoon />,
    <FaMobileAlt />,
    <FaLock />,
    <FaCloud />,
    <FaBolt />
  ];

  return (

    <section className="py-24 bg-gradient-to-b from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">

  <div className="max-w-7xl mx-auto px-6">

    {/* Heading */}

    <div className="text-center">

      <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold">
        ⭐ Why Students Love OrganizeNotes
      </span>

      <h2 className="mt-6 text-4xl sm:text-5xl font-bold dark:text-white">
        Everything You Need For
        <span className="text-blue-600"> Smarter Learning</span>
      </h2>

      <p className="mt-5 max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-8">
        OrganizeNotes combines productivity, organization and smart study
        tools into one beautiful platform designed for students.
      </p>

    </div>

    {/* Feature Cards */}

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">

      {features.map((item, index) => (

        <div
          key={index}
          className="group bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300"
        >

          {/* Icon */}

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl shadow-lg group-hover:scale-110 transition">

            {icons[index]}

          </div>

          {/* Title */}

          <h3 className="mt-7 text-2xl font-bold dark:text-white">

            {item}

          </h3>

          {/* Description */}

          <p className="mt-4 text-gray-600 dark:text-gray-300 leading-7">

            Experience a faster, cleaner and more organized way to
            manage your study materials, reminders and daily learning.

          </p>

        </div>

      ))}

    </div>

  </div>

    </section>

  );
}

export default WhyChoose;

