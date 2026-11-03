
import { useEffect, useMemo, useState } from "react";

import {
  CalendarDays,
  BookOpen,
  Clock3,
  Brain,
  RefreshCw,
  Target,
  CheckCircle2,
  Trash2,
  Plus,
  AlertCircle,
  Trophy
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";

function RevisionPlan() {
  // Read mock test attempts
  const [attempts] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("mockTestAttempts") || "[]"
      );
    } catch {
      return [];
    }
  });

  // Read saved revision schedule
  const [sessions, setSessions] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("revisionSessions") || "[]"
      );
    } catch {
      return [];
    }
  });

  const [dailyGoal, setDailyGoal] = useState(() => {
    return Number(localStorage.getItem("revisionDailyGoal")) || 2;
  });

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    topic: "",
    date: new Date().toISOString().split("T")[0],
    time: "18:00"
  });

  // Save schedule automatically
  useEffect(() => {
  localStorage.setItem(
    "revisionSessions",
    JSON.stringify(sessions)
  );

  window.dispatchEvent(
    new Event("revisionSessionsUpdated")
  );
}, [sessions]);

  useEffect(() => {
    localStorage.setItem(
      "revisionDailyGoal",
      String(dailyGoal)
    );
  }, [dailyGoal]);

  // Calculate subject-wise performance
  const recommendations = useMemo(() => {
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

    return Object.entries(subjectMap)
      .map(([subject, data]) => ({
        subject,
        tests: data.tests,
        accuracy: data.total
          ? Math.round((data.correct / data.total) * 100)
          : 0
      }))
      .sort((a, b) => a.accuracy - b.accuracy);
  }, [attempts]);

  const weakSubjects = recommendations.filter(
    (item) => item.accuracy < 70
  );

  // If all subjects have good accuracy, show the lowest-scoring subjects
  const suggestedSubjects =
    weakSubjects.length > 0
      ? weakSubjects
      : recommendations.slice(0, 3);

  // Statistics
  const totalSessions = sessions.length;

  const completedSessions = sessions.filter(
    (item) => item.completed
  ).length;

  const pendingSessions = totalSessions - completedSessions;

  const today = new Date().toISOString().split("T")[0];

  const todaySessions = sessions.filter(
    (item) => item.date === today
  ).length;

  const todayCompleted = sessions.filter(
    (item) => item.date === today && item.completed
  ).length;

  const todayProgress = Math.min(
    100,
    Math.round((todayCompleted / dailyGoal) * 100)
  );

  // Add revision session
  const addSession = (topic) => {
    if (!topic.trim()) return;

    const newSession = {
      id: Date.now(),
      topic: topic.trim(),
      date: formData.date,
      time: formData.time,
      completed: false
    };

    setSessions((prev) => [...prev, newSession]);
    setFormData({
      topic: "",
      date: today,
      time: "18:00"
    });

    setShowForm(false);
  };

  // Add recommended subject
  const addRecommended = (subject) => {
    const alreadyAdded = sessions.some(
      (item) =>
        item.topic.toLowerCase() === subject.subject.toLowerCase() &&
        !item.completed
    );

    if (alreadyAdded) {
      alert("This subject is already in your revision schedule.");
      return;
    }

    addSession(subject.subject);
  };

  // Mark session complete
  const toggleComplete = (id) => {
    setSessions((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  };

  // Delete session
  const deleteSession = (id) => {
    setSessions((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const formatDate = (date) => {
    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric"
      }
    );
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
          <section className="rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white shadow-xl sm:p-8">

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

              <div className="flex items-center gap-3">
                <CalendarDays size={36} />

                <div>
                  <h1 className="text-2xl font-bold sm:text-3xl">
                    Revision Plan
                  </h1>

                  <p className="mt-2 text-sm text-purple-100">
                    Build a better revision routine and remember what you learn.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-purple-700 transition hover:bg-purple-50"
              >
                <Plus size={18} />
                Add Revision
              </button>

            </div>
          </section>

          {/* Statistics */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {[
              {
                title: "Topics to Revise",
                value: suggestedSubjects.length,
                icon: BookOpen,
                color: "text-blue-600 dark:text-blue-400",
                bg: "bg-blue-100 dark:bg-blue-900/40"
              },
              {
                title: "Revision Sessions",
                value: totalSessions,
                icon: RefreshCw,
                color: "text-purple-600 dark:text-purple-400",
                bg: "bg-purple-100 dark:bg-purple-900/40"
              },
              {
                title: "Completed Sessions",
                value: completedSessions,
                icon: CheckCircle2,
                color: "text-green-600 dark:text-green-400",
                bg: "bg-green-100 dark:bg-green-900/40"
              },
              {
                title: "Pending Sessions",
                value: pendingSessions,
                icon: Clock3,
                color: "text-orange-600 dark:text-orange-400",
                bg: "bg-orange-100 dark:bg-orange-900/40"
              }
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className={cardClass}>

                  <div className="flex items-center justify-between">
                    <p className={mutedClass}>
                      {item.title}
                    </p>

                    <div className={`rounded-xl p-2.5 ${item.bg}`}>
                      <Icon size={22} className={item.color} />
                    </div>
                  </div>

                  <h2 className="mt-5 text-3xl font-bold text-gray-900 dark:text-white">
                    {item.value}
                  </h2>

                </div>
              );
            })}

          </section>

          {/* Daily Goal */}
          <section className={cardClass}>

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <div>
                <div className="flex items-center gap-2">
                  <Target className="text-purple-600 dark:text-purple-400" />

                  <h2 className={headingClass}>
                    Daily Study Goal
                  </h2>
                </div>

                <p className={`mt-2 ${mutedClass}`}>
                  Complete your planned revision sessions every day.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className={mutedClass}>
                  Daily target:
                </label>

                <select
                  value={dailyGoal}
                  onChange={(e) =>
                    setDailyGoal(Number(e.target.value))
                  }
                  className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} sessions
                    </option>
                  ))}
                </select>
              </div>

            </div>

            <div className="mt-6">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">
                  Today's progress
                </span>

                <span className="font-bold text-purple-600 dark:text-purple-400">
                  {todayCompleted}/{dailyGoal}
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all"
                  style={{ width: `${todayProgress}%` }}
                />
              </div>

              <p className={`mt-2 ${mutedClass}`}>
                {todayProgress >= 100
                  ? "Great work! You completed today's revision goal."
                  : `${Math.max(0, dailyGoal - todayCompleted)} more session(s) to reach today's goal.`}
              </p>
            </div>

          </section>

          {/* Add Revision Form */}
          {showForm && (
            <section className={cardClass}>

              <h2 className={headingClass}>
                Create Revision Session
              </h2>

              <form
                className="mt-5 grid gap-4 sm:grid-cols-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  addSession(formData.topic);
                }}
              >

                <input
                  type="text"
                  required
                  placeholder="Enter subject or topic"
                  value={formData.topic}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      topic: e.target.value
                    })
                  }
                  className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-purple-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />

                <input
                  type="date"
                  required
                  min={today}
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      date: e.target.value
                    })
                  }
                  className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />

                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      time: e.target.value
                    })
                  }
                  className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />

                <div className="flex gap-3 sm:col-span-3">
                  <button
                    type="submit"
                    className="rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700"
                  >
                    Save Session
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 dark:border-slate-600 dark:text-gray-300"
                  >
                    Cancel
                  </button>
                </div>

              </form>
            </section>
          )}

          {/* Recommended Revision */}
          <section className={cardClass}>

            <div className="flex items-center gap-3">
              <Brain className="text-purple-600 dark:text-purple-400" size={26} />

              <div>
                <h2 className={headingClass}>
                  Recommended Revision
                </h2>

                <p className={`mt-1 ${mutedClass}`}>
                  Subjects are suggested using your mock test accuracy.
                </p>
              </div>
            </div>

            {suggestedSubjects.length > 0 ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2">

                {suggestedSubjects.map((item) => (
                  <div
                    key={item.subject}
                    className="rounded-2xl border border-gray-200 p-5 dark:border-slate-700"
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          {item.subject}
                        </h3>

                        <p className={`mt-1 ${mutedClass}`}>
                          {item.tests} test(s) attempted
                        </p>
                      </div>

                      <span
                        className={`rounded-lg px-3 py-1 text-xs font-bold ${
                          item.accuracy < 50
                            ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                            : item.accuracy < 70
                            ? "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300"
                            : "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                        }`}
                      >
                        {item.accuracy}% accuracy
                      </span>

                    </div>

                    <p className={`mt-4 ${mutedClass}`}>
                      {item.accuracy < 50
                        ? "Needs immediate attention. Revise fundamentals and practice more."
                        : item.accuracy < 70
                        ? "Needs improvement. Practice more questions."
                        : "Good performance. Revise regularly to maintain it."}
                    </p>

                    <button
                      onClick={() => addRecommended(item)}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
                    >
                      <Plus size={17} />
                      Add to Revision Schedule
                    </button>

                  </div>
                ))}

              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-gray-300 p-8 text-center dark:border-slate-700">

                <AlertCircle size={36} className="mx-auto text-gray-400" />

                <h3 className="mt-3 font-semibold text-gray-800 dark:text-gray-200">
                  No revision recommendations yet
                </h3>

                <p className={`mt-2 ${mutedClass}`}>
                  Complete a mock test first. Your subject-wise performance will appear here.
                </p>

              </div>
            )}

          </section>

          {/* Revision Schedule */}
          <section className={cardClass}>

            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

              <div className="flex items-center gap-3">
                <Clock3 className="text-purple-600 dark:text-purple-400" size={25} />

                <div>
                  <h2 className={headingClass}>
                    Your Revision Schedule
                  </h2>

                  <p className={`mt-1 ${mutedClass}`}>
                    Manage and track your revision sessions.
                  </p>
                </div>
              </div>

              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                {completedSessions}/{totalSessions} completed
              </span>

            </div>

            {sessions.length > 0 ? (
              <div className="mt-6 space-y-3">

                {[...sessions]
                  .sort((a, b) =>
                    `${a.date} ${a.time}`.localeCompare(
                      `${b.date} ${b.time}`
                    )
                  )
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 p-4 dark:border-slate-700 sm:flex-row sm:items-center"
                    >

                      <div className="flex items-start gap-3">

                        <div className={`rounded-xl p-3 ${
                          item.completed
                            ? "bg-green-100 dark:bg-green-900/30"
                            : "bg-purple-100 dark:bg-purple-900/30"
                        }`}>
                          {item.completed ? (
                            <CheckCircle2 className="text-green-600 dark:text-green-400" />
                          ) : (
                            <BookOpen className="text-purple-600 dark:text-purple-400" />
                          )}
                        </div>

                        <div>
                          <h3 className={`font-semibold ${
                            item.completed
                              ? "text-gray-400 line-through"
                              : "text-gray-900 dark:text-white"
                          }`}>
                            {item.topic}
                          </h3>

                          <p className={`mt-1 text-xs ${mutedClass}`}>
                            {formatDate(item.date)} · {item.time}
                          </p>

                          <span className={`mt-2 inline-block text-xs font-semibold ${
                            item.completed
                              ? "text-green-600 dark:text-green-400"
                              : "text-orange-600 dark:text-orange-400"
                          }`}>
                            {item.completed ? "Completed" : "Pending"}
                          </span>
                        </div>

                      </div>

                      <div className="flex items-center gap-2">

                        <button
                          onClick={() => toggleComplete(item.id)}
                          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold ${
                            item.completed
                              ? "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-300"
                              : "bg-green-600 text-white hover:bg-green-700"
                          }`}
                        >
                          <CheckCircle2 size={15} />
                          {item.completed ? "Undo" : "Complete"}
                        </button>

                        <button
                          onClick={() => deleteSession(item.id)}
                          className="rounded-lg bg-red-50 p-2.5 text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400"
                          title="Delete session"
                        >
                          <Trash2 size={17} />
                        </button>

                      </div>

                    </div>
                  ))}

              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-gray-300 p-10 text-center dark:border-slate-700">

                <CalendarDays size={40} className="mx-auto text-gray-400" />

                <h3 className="mt-3 font-semibold text-gray-800 dark:text-gray-200">
                  Your schedule is empty
                </h3>

                <p className={`mt-2 ${mutedClass}`}>
                  Add a revision session or choose a recommended subject.
                </p>

                <button
                  onClick={() => setShowForm(true)}
                  className="mt-5 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700"
                >
                  Create Your First Session
                </button>

              </div>
            )}

          </section>

          {/* Motivational Footer */}
          <div className="flex items-center gap-3 rounded-2xl border border-purple-200 bg-purple-50 p-5 dark:border-purple-500/20 dark:bg-purple-500/10">

            <Trophy className="shrink-0 text-purple-600 dark:text-purple-400" size={25} />

            <p className="text-sm text-purple-800 dark:text-purple-200">
              Consistency is the key to success. Revise a little every day and keep improving!
            </p>

          </div>

        </div>
      </main>

      <BottomNav />

    </div>
  );
}

export default RevisionPlan;
