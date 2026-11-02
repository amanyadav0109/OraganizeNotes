
import { Brain, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RecommendedPractice({ topics = [] }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors duration-300">

      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">
            Recommended Practice
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Topics you can practice next
          </p>
        </div>

        <Sparkles
          className="text-indigo-500 dark:text-indigo-400"
          size={23}
        />
      </div>

      {topics.length > 0 ? (
        <div className="space-y-3">
          {topics.map((topic, index) => (
            <div
              key={topic.id || topic.title || index}
              className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-transparent dark:border-slate-700 transition-colors"
            >
              <div className="p-3 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <Brain size={20} />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  {topic.title}
                </h3>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {topic.description || "Improve your understanding"}
                </p>
              </div>

              <button
                onClick={() =>
                  navigate(
                    `/practice?topic=${encodeURIComponent(topic.title)}`
                  )
                }
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition"
                aria-label={`Practice ${topic.title}`}
              >
                <ArrowRight size={20} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Brain
            size={35}
            className="mx-auto mb-3 text-gray-400 dark:text-gray-500"
          />

          <p className="font-medium text-gray-700 dark:text-gray-300">
            No recommendations yet
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Complete some practice tests to get recommendations.
          </p>
        </div>
      )}

    </div>
  );
}
