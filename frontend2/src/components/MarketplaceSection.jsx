import {
  FaStore,
  FaSearch,
  FaFilePdf,
  FaDownload,
  FaUpload,
  FaShieldAlt,
  FaArrowRight,
  FaBookOpen,
  FaShoppingBag,
} from "react-icons/fa";
import { Link } from "react-router-dom";

function MarketplaceSection() {
  const features = [
    {
      icon: <FaSearch />,
      title: "Discover Study Notes",
      description:
        "Explore study materials across different subjects and find notes that match your learning needs.",
    },
    {
      icon: <FaFilePdf />,
      title: "Preview Before Buying",
      description:
        "Get a preview of available notes before purchasing so you can make informed decisions.",
    },
    {
      icon: <FaUpload />,
      title: "Share Your Knowledge",
      description:
        "Upload and publish your study notes to make your learning resources available to other students.",
    },
    {
      icon: <FaDownload />,
      title: "Access Purchased Notes",
      description:
        "Access your purchased study materials and download them whenever you need them.",
    },
  ];

  return (
    <section
      id="marketplace"
      className="relative overflow-hidden py-20 sm:py-24 bg-white dark:bg-slate-950"
    >
      {/* Background Effects */}
      <div className="absolute top-10 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-semibold">
            <FaStore />
            OrganizeNotes Marketplace
          </span>

          <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
            Discover, Share &
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Learn Together
            </span>
          </h2>

          <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-8">
            Explore useful study materials, preview notes before purchasing and
            share your own knowledge with a community of learners.
          </p>
        </div>

        {/* Marketplace Preview */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl">
                <FaShoppingBag />
              </div>

              <div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white">
                  Your Study Notes Marketplace
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  One place for learning resources
                </p>
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-snug">
              Make learning resources accessible to everyone.
            </h3>

            <p className="mt-5 text-slate-600 dark:text-slate-400 leading-8">
              Find helpful notes created by other students or share your own
              study materials. OrganizeNotes Marketplace makes it easier to
              discover and access useful academic resources.
            </p>

            {/* Feature List */}
            <div className="mt-8 space-y-5">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg">
                    {feature.icon}
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      {feature.title}
                    </h4>

                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-6">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 blur-3xl rounded-full" />

            <div className="relative rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-5 sm:p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-7">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    Study Resources
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Explore learning materials
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <FaStore />
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    subject: "Computer Science",
                    title: "Database Management Systems",
                    price: "₹99",
                    tag: "Popular",
                    icon: "💻",
                  },
                  {
                    subject: "Programming",
                    title: "Java Programming Notes",
                    price: "₹79",
                    tag: "Study Material",
                    icon: "☕",
                  },
                  {
                    subject: "Engineering",
                    title: "Operating Systems Notes",
                    price: "₹49",
                    tag: "Revision",
                    icon: "📚",
                  },
                ].map((note, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition"
                  >
                    <div className="w-14 h-16 shrink-0 rounded-xl bg-blue-50 dark:bg-slate-700 flex items-center justify-center text-2xl">
                      {note.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                        {note.subject}
                      </p>

                      <h4 className="mt-1 font-semibold text-sm text-slate-900 dark:text-white">
                        {note.title}
                      </h4>

                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {note.tag}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-bold text-blue-600 dark:text-blue-400">
                        {note.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom */}
              <div className="mt-6 flex items-center justify-between p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">
                    Your knowledge has value!
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Share notes with other learners.
                  </p>
                </div>

                <FaBookOpen className="text-2xl text-blue-600 dark:text-blue-400" />
              </div>

              <p className="mt-4 text-xs text-center text-slate-400">
                Illustrative marketplace preview
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-5">
            Turn your study materials into valuable learning resources.
          </p>
        </div>
      </div>
    </section>
  );
}

export default MarketplaceSection;
