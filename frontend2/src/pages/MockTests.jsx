
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FolderOpen,
  Loader2,
  RefreshCw,
  Sparkles,
  Trophy,
  AlertCircle,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import { toast } from "react-toastify";
import TestInstructions from "../components/mocktests/TestInstructions";
import ExamScreen from "../components/mocktests/ExamScreen";
import ResultScreen from "../components/mocktests/ResultScreen";
import AnswerReview from "../components/mocktests/AnswerReview";

const API_URL = (
  import.meta.env.VITE_SERVER_URL || "http://localhost:5000"
).replace(/\/$/, "");

function MockTests() {
  const navigate = useNavigate();

  // Current screen
  const [screen, setScreen] = useState("categories");

  // Database data
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [testSets, setTestSets] = useState([]);
  const [examQuestions, setExamQuestions] = useState([]);

  // Selected data
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  // Exam result
  const [examResult, setExamResult] = useState(null);
const [examSessionId, setExamSessionId] = useState("");
  // Loading and errors
  const [loading, setLoading] = useState(false);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [error, setError] = useState("");
  const [questionsError, setQuestionsError] = useState("");


  const [attempts, setAttempts] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("mockTestAttempts") || "[]"
      );
    } catch {
      return [];
    }
  });

 
  const apiRequest = async (endpoint) => {
    const response = await fetch(
      `${API_URL}/api/mock-tests${endpoint}`
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message || "Unable to load mock test data."
      );
    }

    return data;
  };

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/categories");

      setCategories(data.categories || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const openCategory = async (category) => {
    try {
      setSelectedCategory(category);
      setSelectedSubject(null);
      setSelectedTopic(null);
      setSelectedTest(null);

      setSubjects([]);
      setTopics([]);
      setTestSets([]);
      setExamQuestions([]);

      setError("");
      setLoading(true);

      const data = await apiRequest(
        `/subjects?category_id=${category.id}`
      );

      setSubjects(data.subjects || []);
      setScreen("subjects");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

 
  const openSubject = async (subject) => {
    try {
      setSelectedSubject(subject);
      setSelectedTopic(null);
      setSelectedTest(null);

      setTopics([]);
      setTestSets([]);
      setExamQuestions([]);

      setError("");
      setLoading(true);

      const data = await apiRequest(
        `/topics?subject_id=${subject.id}`
      );

      setTopics(data.topics || []);
      setScreen("topics");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

 
  const openTopic = async (topic) => {
    try {
      setSelectedTopic(topic);
      setSelectedTest(null);
      setExamQuestions([]);

      setTestSets([]);
      setError("");
      setLoading(true);

      const data = await apiRequest(
        `/test-sets?topic_id=${topic.id}`
      );

      const publishedSets = (data.testSets || []).filter(
        (test) =>
          !test.status ||
          test.status.toLowerCase() === "published"
      );

      setTestSets(publishedSets);
      setScreen("sets");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

 
  const openTest = async (test, language = "English") => {
    try {
      setSelectedTest(test);
      setSelectedLanguage(language);

      setExamQuestions([]);
      setQuestionsError("");
      setQuestionsLoading(true);

      const data = await apiRequest(
        `/questions?test_set_id=${test.id}`
      );

      const questions = data.questions || [];

      if (questions.length === 0) {
        setQuestionsError(
          "No questions have been added to this test yet."
        );
        return;
      }

      setExamQuestions(questions);
      setScreen("instructions");
    } catch (err) {
      setQuestionsError(err.message);
    } finally {
      setQuestionsLoading(false);
    }
  };

  const startExam = () => {
  if (examQuestions.length === 0) {
    setQuestionsError("No questions available.");
    return;
  }

  const newSessionId =
    globalThis.crypto?.randomUUID?.() ||
    `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  setExamSessionId(newSessionId);
  setScreen("exam");
};

 
  const handleExamSubmit = (result) => {
    const totalMarks =
      Number(result.totalMarks) ||
      Number(selectedTest?.total_marks) ||
      result.total;

    const obtainedMarks =
      Number(result.obtainedMarks) || 0;

    const percentage =
      totalMarks > 0
        ? Math.round((obtainedMarks / totalMarks) * 100)
        : result.total > 0
          ? Math.round((result.correct / result.total) * 100)
          : 0;

    const newAttempt = {
      id: Date.now(),
      testTitle: selectedTest?.title || "Mock Test",
      category: selectedCategory?.name || "General",
      subject: selectedSubject?.name || "General",
      topic: selectedTopic?.name || "General",
      date: new Date().toISOString(),
      correct: result.correct,
      incorrect: result.incorrect,
      unanswered: result.unanswered,
      total: result.total,
      percentage,
    };

    const updatedAttempts = [newAttempt, ...attempts];

    setAttempts(updatedAttempts);

    localStorage.setItem(
      "mockTestAttempts",
      JSON.stringify(updatedAttempts)
    );

    setExamResult(result);
    setScreen("result");
  };

 
  const goBack = () => {
    if (screen === "subjects") {
      setScreen("categories");
      setSelectedCategory(null);
      setSubjects([]);
    } else if (screen === "topics") {
      setScreen("subjects");
      setSelectedSubject(null);
      setTopics([]);
    } else if (screen === "sets") {
      setScreen("topics");
      setSelectedTopic(null);
      setTestSets([]);
    } else if (screen === "instructions") {
      setScreen("sets");
      setSelectedTest(null);
      setExamQuestions([]);
    } else if (screen === "exam") {
 
      setScreen("instructions");
    } else if (screen === "result") {
      resetToCategories();
    } else if (screen === "review") {
      setScreen("result");
    }
  };

  const resetToCategories = () => {
    setScreen("categories");

    setSelectedCategory(null);
    setSelectedSubject(null);
    setSelectedTopic(null);
    setSelectedTest(null);

    setSubjects([]);
    setTopics([]);
    setTestSets([]);
    setExamQuestions([]);

    setExamResult(null);
    setQuestionsError("");
  };


  const pageTitle = () => {
    switch (screen) {
      case "categories":
        return "Mock Tests";
      case "subjects":
        return selectedCategory?.name || "Subjects";
      case "topics":
        return selectedSubject?.name || "Topics";
      case "sets":
        return selectedTopic?.name || "Test Sets";
      case "instructions":
        return "Test Instructions";
      case "exam":
        return "Online Examination";
      case "result":
        return "Test Result";
      case "review":
        return "Answer Review";
      default:
        return "Mock Tests";
    }
  };


  const refreshCurrentScreen = () => {
    if (screen === "categories") {
      loadCategories();
    } else if (screen === "subjects" && selectedCategory) {
      openCategory(selectedCategory);
    } else if (screen === "topics" && selectedSubject) {
      openSubject(selectedSubject);
    } else if (screen === "sets" && selectedTopic) {
      openTopic(selectedTopic);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Navbar />
      <Sidebar />
      <main className="p-4 pb-28 sm:p-6 lg:ml-56 lg:p-8">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-purple-700 p-6 text-white shadow-xl sm:p-9">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

          <div className="relative z-10 flex items-center justify-between gap-4">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold">
                <Sparkles size={14} />
                YOUR LEARNING ARENA
              </div>

              <h1 className="text-3xl font-bold sm:text-4xl">
                {pageTitle()}
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
                Practice, attempt mock tests and improve your preparation.
              </p>
            </div>

            <div className="hidden h-24 w-24 items-center justify-center rounded-3xl border border-white/20 bg-white/10 md:flex">
              <ClipboardList size={55} strokeWidth={1.4} />
            </div>
          </div>
        </section>

        {/* Breadcrumbs */}
        {screen !== "categories" &&
          screen !== "exam" &&
          screen !== "result" &&
          screen !== "review" && (
          <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
            <button
              onClick={resetToCategories}
              className="text-indigo-600 hover:underline"
            >
              Categories
            </button>

            {selectedCategory && (
              <>
                <ChevronRight size={15} />
                <button
                  onClick={() => setScreen("subjects")}
                  className="text-indigo-600 hover:underline"
                >
                  {selectedCategory.name}
                </button>
              </>
            )}

            {selectedSubject && (
              <>
                <ChevronRight size={15} />
                <button
                  onClick={() => setScreen("topics")}
                  className="text-indigo-600 hover:underline"
                >
                  {selectedSubject.name}
                </button>
              </>
            )}

            {selectedTopic && (
              <>
                <ChevronRight size={15} />
                <button
                  onClick={() => setScreen("sets")}
                  className="text-indigo-600 hover:underline"
                >
                  {selectedTopic.name}
                </button>
              </>
            )}
          </div>
        )}

        {/* Back and Refresh */}
        {screen !== "categories" &&
          screen !== "exam" &&
          screen !== "result" &&
          screen !== "review" && (
          <div className="mt-5 flex items-center justify-between">
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400"
            >
              <ArrowLeft size={17} />
              Back
            </button>

            <button
              onClick={refreshCurrentScreen}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium dark:border-slate-700 dark:bg-slate-900"
            >
              <RefreshCw
                size={15}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="ml-auto font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center gap-3 py-14 text-sm font-medium text-indigo-600">
            <Loader2 size={22} className="animate-spin" />
            Loading data...
          </div>
        )}

        {/* Categories */}
        {!loading && screen === "categories" && (
          <section className="mt-9">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Choose Your Category
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Select a category to explore available mock tests.
                </p>
              </div>

              <button
                onClick={() => navigate("/analytics")}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <BarChart3 size={18} />
                View My Analytics
              </button>
            </div>

            {categories.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => openCategory(category)}
                    className="group rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                      <ClipboardList size={27} />
                    </div>

                    <h3 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
                      {category.name}
                    </h3>

                    <p className="mt-2 min-h-10 text-sm text-gray-500 dark:text-gray-400">
                      {category.description || "Explore available subjects and mock tests."}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 text-sm font-semibold text-indigo-600 dark:border-slate-700 dark:text-indigo-400">
                      Explore Category
                      <ChevronRight
                        size={19}
                        className="transition group-hover:translate-x-1"
                      />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No Categories Available"
                description="Mock test categories added by the admin will appear here."
              />
            )}
          </section>
        )}

        {/* Subjects */}
        {!loading && screen === "subjects" && (
          <section className="mt-8">
            <SectionHeading
              title="Choose Your Subject"
              description={`Subjects available in ${selectedCategory?.name || "this category"}.`}
            />

            {subjects.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {subjects.map((subject) => (
                  <button
                    key={subject.id}
                    onClick={() => openSubject(subject)}
                    className="group rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-purple-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                      <BookOpen size={24} />
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
                      {subject.name}
                    </h3>

                    <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 text-sm font-semibold text-purple-600 dark:border-slate-700 dark:text-purple-400">
                      View Topics
                      <ChevronRight size={18} />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No Subjects Available"
                description="The admin has not added subjects to this category yet."
              />
            )}
          </section>
        )}

        {/* Topics */}
        {!loading && screen === "topics" && (
          <section className="mt-8">
            <SectionHeading
              title="Choose Your Topic"
              description={`Topics available in ${selectedSubject?.name || "this subject"}.`}
            />

            {topics.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => openTopic(topic)}
                    className="group rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                      <FolderOpen size={24} />
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
                      {topic.name}
                    </h3>

                    <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 text-sm font-semibold text-emerald-600 dark:border-slate-700 dark:text-emerald-400">
                      View Tests
                      <ChevronRight size={18} />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No Topics Available"
                description="The admin has not added topics to this subject yet."
              />
            )}
          </section>
        )}

        {/* Test Sets */}
        {!loading && screen === "sets" && (
          <section className="mt-8">
            <SectionHeading
              title="Available Mock Tests"
              description={`Choose a test for ${selectedTopic?.name || "this topic"}.`}
            />

            {testSets.length > 0 ? (
              <div className="grid gap-5 xl:grid-cols-2">
                {testSets.map((test) => (
                  <div
                    key={test.id}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                        <ClipboardList size={24} />
                      </div>

                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/30 dark:text-green-400">
                        {test.difficulty || "Practice"}
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
                      {test.title}
                    </h3>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <InfoItem
                        label="Duration"
                        value={`${test.duration || 30} minutes`}
                      />
                      <InfoItem
                        label="Total Marks"
                        value={test.total_marks ?? "—"}
                      />
                      <InfoItem
                        label="Negative Marks"
                        value={test.negative_marks ?? 0}
                      />
                      <InfoItem
                        label="Difficulty"
                        value={test.difficulty || "Medium"}
                      />
                    </div>

                    <div className="mt-5 border-t border-gray-100 pt-4 dark:border-slate-700">
                      <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Select Language
                      </p>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => openTest(test, "English")}
                          disabled={questionsLoading}
                          className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                        >
                          English
                        </button>

                        <button
                          onClick={() => openTest(test, "Hindi")}
                          disabled={questionsLoading}
                          className="flex-1 rounded-xl border border-indigo-600 px-4 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/30 disabled:opacity-50"
                        >
                          हिंदी
                        </button>
                      </div>

                      {questionsLoading && selectedTest?.id === test.id && (
                        <p className="mt-3 flex items-center gap-2 text-xs text-indigo-600">
                          <Loader2 size={14} className="animate-spin" />
                          Loading questions...
                        </p>
                      )}

                      {questionsError && selectedTest?.id === test.id && (
                        <p className="mt-3 text-xs text-red-600">
                          {questionsError}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No Published Tests"
                description="Published tests added by the admin will appear here."
              />
            )}
          </section>
        )}

        {/* Instructions */}
        {screen === "instructions" && (
          <TestInstructions
            test={selectedTest}
            category={selectedCategory}
            subject={selectedSubject}
            language={selectedLanguage}
            onBack={goBack}
            onStart={startExam}
          />
        )}

        {/* Exam */}
        {screen === "exam" && (
          questionsLoading ? (
            <LoadingState />
          ) : questionsError ? (
            <ErrorState
              message={questionsError}
              onBack={goBack}
            />
          ) : examQuestions.length > 0 ? (
            <ExamScreen
             test={selectedTest}
  questions={examQuestions}
  language={selectedLanguage}
  sessionId={examSessionId}
  onSubmit={handleExamSubmit}
  onUpgrade={() => navigate("/upgrade")}
            />
          ) : (
            <EmptyState
              title="No Questions Available"
              description="There are no questions in this test."
            />
          )
        )}

        {/* Result */}
        {screen === "result" && examResult && (
          <ResultScreen
            result={examResult}
            test={selectedTest}
            onBack={resetToCategories}
            onReview={() => setScreen("review")}
          />
        )}

        {/* Answer Review */}
        {screen === "review" && examResult && (
          <AnswerReview
            result={examResult}
            onBack={goBack}
          />
        )}

      </main>

      <BottomNav />
    </div>
  );
}

function SectionHeading({ title, description }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        {title}
      </h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-xl bg-gray-50 p-3 dark:bg-slate-800">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-gray-800 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-12 text-center dark:border-slate-700 dark:bg-slate-900">
      <ClipboardList
        size={38}
        className="mx-auto text-gray-400"
      />
      <h3 className="mt-4 font-bold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="mt-8 flex flex-col items-center justify-center rounded-2xl bg-white p-12 dark:bg-slate-900">
      <Loader2 size={32} className="animate-spin text-indigo-600" />
      <p className="mt-3 text-sm text-gray-500">
        Loading questions...
      </p>
    </div>
  );
}

function ErrorState({ message, onBack }) {
  return (
    <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950/30">
      <AlertCircle size={32} className="mx-auto text-red-600" />
      <p className="mt-3 font-semibold text-red-700 dark:text-red-300">
        {message}
      </p>
      <button
        onClick={onBack}
        className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white"
      >
        Go Back
      </button>
    </div>
  );
}

export default MockTests;