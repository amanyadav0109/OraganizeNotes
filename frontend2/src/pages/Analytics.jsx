
import { useMemo } from "react";
import {
  ChartNoAxesCombined,
  Target,
  Brain,
  TrendingUp,
  Award,
  BarChart3,
  TrendingDown,
  BookOpen,
  ClipboardCheck
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";

function Analytics() {
  // Read Mock Test attempts from localStorage
  const attempts = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("mockTestAttempts") || "[]"
      );
    } catch {
      return [];
    }
  }, []);

  // Overall statistics
  const totalTests = attempts.length;

  const totalQuestions = attempts.reduce(
    (sum, item) => sum + (Number(item.total) || 0),
    0
  );

  const totalCorrect = attempts.reduce(
    (sum, item) => sum + (Number(item.correct) || 0),
    0
  );

  const averageAccuracy = totalQuestions
    ? Math.round((totalCorrect / totalQuestions) * 100)
    : 0;

  const bestScore = totalTests
    ? Math.max(
        ...attempts.map((item) => Number(item.percentage) || 0)
      )
    : 0;

  const stats = [
    {
      title: "Questions Solved",
      value: totalQuestions,
      icon: Brain,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/40"
    },
    {
      title: "Average Accuracy",
      value: `${averageAccuracy}%`,
      icon: Target,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-100 dark:bg-purple-900/40"
    },
    {
      title: "Tests Completed",
      value: totalTests,
      icon: TrendingUp,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-100 dark:bg-green-900/40"
    },
    {
      title: "Best Score",
      value: `${bestScore}%`,
      icon: Award,
      color: "text-yellow-600 dark:text-yellow-400",
      bg: "bg-yellow-100 dark:bg-yellow-900/40"
    }
  ];

  // Subject-wise performance
  const subjectMap = {};

  attempts.forEach((item) => {
    const subject = item.subject || "General";

    if (!subjectMap[subject]) {
      subjectMap[subject] = {
        total: 0,
        correct: 0,
        tests: 0
      };
    }

    subjectMap[subject].total += Number(item.total) || 0;
    subjectMap[subject].correct += Number(item.correct) || 0;
    subjectMap[subject].tests += 1;
  });

  const subjects = Object.entries(subjectMap)
    .map(([subject, data]) => ({
      subject,
      tests: data.tests,
      accuracy: data.total
        ? Math.round((data.correct / data.total) * 100)
        : 0
    }))
    .sort((a, b) => b.accuracy - a.accuracy);

  const weakSubject = subjects.length
    ? subjects[subjects.length - 1]
    : null;

  // Weekly performance: last 7 days
  const weeklyData = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));

    const dateKey = date.toDateString();

    const dayAttempts = attempts.filter(
      (item) =>
        item.date &&
        new Date(item.date).toDateString() === dateKey
    );

    const correct = dayAttempts.reduce(
      (sum, item) => sum + (Number(item.correct) || 0),
      0
    );

    const total = dayAttempts.reduce(
      (sum, item) => sum + (Number(item.total) || 0),
      0
    );

    return {
      day: date.toLocaleDateString("en-IN", {
        weekday: "short"
      }),
      accuracy: total ? Math.round((correct / total) * 100) : 0,
      tests: dayAttempts.length
    };
  });

  const maxWeeklyAccuracy = Math.max(
    10,
    ...weeklyData.map((item) => item.accuracy)
  );

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const cardClass =
    "rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900";

  const headingClass =
    "text-lg font-bold text-gray-900 dark:text-white";

  const mutedClass =
    "text-sm text-gray-500 dark:text-gray-400";

  return (
    <div className="min-h-screen bg-gray-50 transition-colors dark:bg-slate-950">

      <Navbar />
      <Sidebar />

      <main className="min-w-0 p-4 pb-24 sm:p-6 lg:ml-56 lg:p-8">

        <div className="mx-auto max-w-7xl space-y-7">

          {/* Header */}
          <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-xl sm:p-8">

            <div className="flex items-center gap-3">
              <ChartNoAxesCombined size={35} />

              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">
                  Performance Analytics
                </h1>

                <p className="mt-2 text-sm text-blue-100">
                  Understand your progress and improve your preparation.
                </p>
              </div>
            </div>

            <div className="mt-5 text-sm text-blue-100">
              You have completed {totalTests} mock test(s).
            </div>

          </div>

          {/* Statistics */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div key={stat.title} className={cardClass}>

                  <div className="flex items-center justify-between">
                    <p className={mutedClass}>
                      {stat.title}
                    </p>

                    <div className={`rounded-xl p-2.5 ${stat.bg}`}>
                      <Icon size={22} className={stat.color} />
                    </div>
                  </div>

                  <h2 className="mt-5 text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </h2>

                </div>
              );
            })}

          </section>

          {/* Weekly and Subject Performance */}
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">

            {/* Weekly Performance */}
            <div className={cardClass}>

              <div className="flex items-center gap-3">
                <BarChart3 className="text-blue-600 dark:text-blue-400" size={24} />

                <h2 className={headingClass}>
                  Weekly Performance
                </h2>
              </div>

              {totalTests > 0 ? (
                <div className="mt-8 flex h-52 items-end justify-around gap-3">

                  {weeklyData.map((item) => (
                    <div
                      key={item.day}
                      className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                    >

                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                        {item.tests > 0 ? `${item.accuracy}%` : ""}
                      </span>

                      <div className="flex h-36 w-full items-end justify-center rounded-t-lg bg-gray-100 dark:bg-slate-800">

                        <div
                          className="w-full max-w-10 rounded-t-lg bg-blue-600 transition-all"
                          style={{
                            height: item.tests
                              ? `${Math.max(
                                  8,
                                  (item.accuracy / maxWeeklyAccuracy) * 100
                                )}%`
                              : "3px"
                          }}
                        />

                      </div>

                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {item.day}
                      </span>

                    </div>
                  ))}

                </div>
              ) : (
                <div className="flex min-h-52 flex-col items-center justify-center text-center">
                  <ChartNoAxesCombined size={38} className="text-gray-400" />

                  <p className="mt-3 font-semibold text-gray-700 dark:text-gray-300">
                    No performance data yet
                  </p>

                  <p className={`mt-1 ${mutedClass}`}>
                    Complete a mock test to see your weekly progress.
                  </p>
                </div>
              )}

            </div>

            {/* Subject Performance */}
            <div className={cardClass}>

              <div className="flex items-center gap-3">
                <Target className="text-blue-600 dark:text-blue-400" size={24} />

                <h2 className={headingClass}>
                  Topic Performance
                </h2>
              </div>

              {subjects.length > 0 ? (
                <div className="mt-7 space-y-6">

                  {subjects.map((item) => (
                    <div key={item.subject}>

                      <div className="mb-2 flex justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            {item.subject}
                          </p>

                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {item.tests} test(s)
                          </p>
                        </div>

                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {item.accuracy}%
                        </span>
                      </div>

                      <div className="h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-800">
                        <div
                          className={`h-full rounded-full ${
                            item.accuracy >= 80
                              ? "bg-green-500"
                              : item.accuracy >= 50
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${item.accuracy}%` }}
                        />
                      </div>

                    </div>
                  ))}

                </div>
              ) : (
                <div className="flex min-h-52 flex-col items-center justify-center text-center">
                  <Target size={38} className="text-gray-400" />

                  <p className="mt-3 font-semibold text-gray-700 dark:text-gray-300">
                    Topic analysis not available
                  </p>

                  <p className={`mt-1 ${mutedClass}`}>
                    Complete tests to see your subject performance.
                  </p>
                </div>
              )}

            </div>

          </section>

          {/* Areas to Improve */}
          <section className={cardClass}>

            <div className="flex items-center gap-3">
              <TrendingDown className="text-orange-500" size={24} />

              <h2 className={headingClass}>
                Areas to Improve
              </h2>
            </div>

            {weakSubject ? (
              <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 p-5 dark:border-orange-500/20 dark:bg-orange-500/10">

                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Your lowest-performing subject
                </p>

                <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                  {weakSubject.subject}
                </h3>

                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Your current accuracy is {weakSubject.accuracy}%.
                  Focus on practicing more questions in this subject.
                </p>

              </div>
            ) : (
              <p className={`mt-5 rounded-xl bg-gray-50 p-5 text-center dark:bg-slate-800 ${mutedClass}`}>
                Complete some mock tests to identify your weak areas.
              </p>
            )}

          </section>

          {/* Recent Attempts */}
          <section className={cardClass}>

            <div className="mb-5 flex items-center justify-between">
              <h2 className={headingClass}>
                Recent Test Attempts
              </h2>

              <ClipboardCheck className="text-blue-600 dark:text-blue-400" />
            </div>

            {attempts.length > 0 ? (
              <div className="overflow-x-auto">

                <table className="w-full min-w-[600px] text-left text-sm">

                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 dark:border-slate-700 dark:text-gray-400">
                      <th className="px-3 py-3">Test</th>
                      <th className="px-3 py-3">Subject</th>
                      <th className="px-3 py-3">Date</th>
                      <th className="px-3 py-3">Score</th>
                      <th className="px-3 py-3">Accuracy</th>
                    </tr>
                  </thead>

                  <tbody>
                    {attempts.slice(0, 10).map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-100 last:border-0 dark:border-slate-800"
                      >
                        <td className="px-3 py-4 font-semibold text-gray-900 dark:text-white">
                          {item.testTitle || "Mock Test"}
                        </td>

                        <td className="px-3 py-4 text-gray-600 dark:text-gray-300">
                          {item.subject || "General"}
                        </td>

                        <td className="px-3 py-4 text-gray-600 dark:text-gray-300">
                          {formatDate(item.date)}
                        </td>

                        <td className="px-3 py-4 font-semibold text-gray-900 dark:text-white">
                          {item.correct}/{item.total}
                        </td>

                        <td className="px-3 py-4 font-semibold text-blue-600 dark:text-blue-400">
                          {item.percentage}%
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>

              </div>
            ) : (
              <p className={`py-10 text-center ${mutedClass}`}>
                No test attempts yet. Complete your first mock test.
              </p>
            )}

          </section>

        </div>
      </main>

      <BottomNav />

    </div>
  );
}

export default Analytics;
