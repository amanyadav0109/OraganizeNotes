
function Testimonials() {

  const reviews = [
    {
      name: "Aman",
      text: "OrganizeNotes completely changed how I organize my semester."
    },
    {
      name: "Rahul",
      text: "The AI Assistant saves me hours every week."
    },
    {
      name: "Priya",
      text: "Best notes application I've ever used."
    }
  ];

 return (
  <section className="relative py-24 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">

    {/* Background Blur */}

    <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400/20 blur-3xl rounded-full"></div>

    <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/20 blur-3xl rounded-full"></div>

    <div className="relative max-w-7xl mx-auto px-6">

      {/* Heading */}

      <div className="text-center">

       

        <h2 className="mt-6 text-4xl sm:text-5xl font-bold dark:text-white">
          Loved by
          <span className="text-blue-600"> Students</span>
        </h2>

        <p className="mt-5 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
          Thousands of students organize their notes and boost
          productivity with StudyHub.
        </p>

      </div>

      {/* Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-16">

        {reviews.map((review, index) => (

          <div
            key={index}
            className="group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border border-white/20 dark:border-slate-700 rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-500"
          >

            {/* Quote */}

            <div className="absolute top-6 right-6 text-6xl text-blue-100 dark:text-slate-700 font-serif">
              "
            </div>

            {/* Avatar */}

            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg group-hover:scale-110 transition">

              {review.name.charAt(0)}

            </div>

            {/* Stars */}

            <div className="flex gap-1 mt-6 text-yellow-400 text-xl animate-pulse">

              ⭐⭐⭐⭐⭐

            </div>

            {/* Review */}

            <p className="mt-6 leading-8 text-gray-600 dark:text-gray-300 italic">

              "{review.text}"

            </p>

            {/* Divider */}

            <div className="mt-8 border-t border-gray-200 dark:border-slate-700 pt-6">

              <h4 className="text-xl font-bold dark:text-white">

                {review.name}

              </h4>

              <p className="text-blue-600 dark:text-blue-400 mt-1">

                StudyHub User

              </p>

            </div>

          </div>

        ))}

      </div>

    </div>

  </section>
);
}

export default Testimonials;

