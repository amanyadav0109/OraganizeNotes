
import { useMemo } from "react";
import {
  Brain,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RecommendedPractice() {
  const navigate = useNavigate();

  const weakSubjects = useMemo(() => {
    try {
      const attempts = JSON.parse(
        localStorage.getItem("mockTestAttempts") || "[]"
      );

      const subjectMap = {};

      attempts.forEach((item) => {
        const subject = item.subject || "General";

        if (!subjectMap[subject]) {
          subjectMap[subject] = {
            total: 0,
            correct: 0,
          };
        }

        subjectMap[subject].total += Number(item.total) || 0;
        subjectMap[subject].correct += Number(item.correct) || 0;
      });

      return Object.entries(subjectMap)
        .map(([subject, data]) => ({
          subject,
          accuracy: data.total
            ? Math.round((data.correct / data.total) * 100)
            : 0,
        }))
        .filter((item) => item.accuracy <= 50)
        .sort((a, b) => a.accuracy - b.accuracy);
    } catch (error) {
      console.error("Recommendation error:", error);
      return [];
    }
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors duration-300">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">
            Recommended Practice
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Revise your lowest-performing subjects
          </p>
        </div>

        <Sparkles
          className="text-indigo-500 dark:text-indigo-400"
          size={23}
        />
      </div>

      {/* Recommendations */}
      {weakSubjects.length > 0 ? (
        <>
          <div
            className={`space-y-3 ${
              weakSubjects.length > 2
                ? "max-h-[280px] overflow-y-auto pr-1"
                : ""
            }`}
          >
            {weakSubjects.map((item) => (
              <div
                key={item.subject}
                className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-transparent dark:border-slate-700"
              >
                <div className="p-3 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-xl">
                  <Brain size={20} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    {item.subject}
                  </h3>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Accuracy: {item.accuracy}% · Needs revision
                  </p>
                </div>

                <button
                  onClick={() =>
                    navigate(
                      `/practice?topic=${encodeURIComponent(item.subject)}`
                    )
                  }
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition"
                  aria-label={`Revise ${item.subject}`}
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* View More */}
          {weakSubjects.length > 2 && (
            <button
              onClick={() => navigate("/analytics")}
              className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 py-3 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition"
            >
              <Eye size={17} />
              View More
              <ArrowRight size={16} />
            </button>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <AlertCircle
            size={35}
            className="mx-auto mb-3 text-gray-400 dark:text-gray-500"
          />

          <p className="font-medium text-gray-700 dark:text-gray-300">
            No weak subjects found
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Complete mock tests to get personalized revision recommendations.
          </p>
        </div>
      )}

    </div>
  );
}
