import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { ArrowLeft, ClipboardList, Sparkles } from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";

import CategoryCard from "../components/mocktests/CategoryCard";
import SubjectCard from "../components/mocktests/SubjectCard";
import TestSetCard from "../components/mocktests/TestSetCard";
import TestInstructions from "../components/mocktests/TestInstructions";
import {
  categories,
  subjects,
  testSets,
} from "../data/mockTestData";
import ExamScreen from "../components/mocktests/ExamScreen";
import ResultScreen from "../components/mocktests/ResultScreen";
import mockTestQuestions from "../data/mockTestQuestions";
import AnswerReview from "../components/mocktests/AnswerReview";

import { BarChart3 } from "lucide-react";
function MockTests() {
  const [screen, setScreen] = useState("categories");
  
const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedStream, setSelectedStream] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
const [examResult, setExamResult] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("");
const [attempts, setAttempts] = useState(() => {
  try {
    return JSON.parse(
      localStorage.getItem("mockTestAttempts") || "[]"
    );
  } catch {
    return [];
  }
});
  const streams = ["Science", "Commerce", "Arts"];

  const getSubjects = () => {
    let subjectList = subjects[selectedCategory?.id] || [];

    if (selectedCategory?.id === "class-11" ||
        selectedCategory?.id === "class-12") {

      const streamSubjects = {
        Science: [
          "physics",
          "chemistry",
          "maths",
          "biology",
        ],
        Commerce: [
          "accountancy",
          "economics",
          "business-studies",
        ],
        Arts: [
          "history",
          "political-science",
          "english",
        ],
      };

      subjectList = subjectList.filter((subject) =>
        streamSubjects[selectedStream]?.includes(subject.id)
      );
    }

    return subjectList;
  };

  const openCategory = (category) => {
    setSelectedCategory(category);
    setSelectedSubject(null);
    setSelectedStream(null);
    setSelectedExam(null);
    setScreen("subjects");
  };

  const openSubject = (subject) => {
    setSelectedSubject(subject);
    setScreen("sets");
  };

  const openTest = (test, language) => {
  setSelectedTest(test);
  setSelectedLanguage(language);
  setScreen("instructions");
};
const goBack = () => {
  if (screen === "subjects") {
    setScreen("categories");
    setSelectedCategory(null);
    setSelectedStream(null);
    setSelectedExam(null);
  } else if (screen === "sets") {
    setScreen("subjects");
    setSelectedSubject(null);
  } else if (screen === "instructions") {
    setScreen("sets");
    setSelectedTest(null);
    setSelectedLanguage("");
  } else if (screen === "result") {
    setScreen("categories");
    setSelectedCategory(null);
    setSelectedSubject(null);
    setSelectedTest(null);
    setSelectedLanguage("");
    setExamResult(null);
  }else if (screen === "review") {
     setScreen("result");
  }else if (screen === "analytics") {
  setScreen("categories");
  }
};

const pageTitle = () => {
  if (screen === "categories") return "Mock Tests";
  if (screen === "subjects") return selectedCategory?.name;
  if (screen === "sets") return selectedSubject?.name;
  if (screen === "instructions") return "Test Instructions";
  if (screen === "exam") return "Online Examination";
  if (screen === "result") return "Test Result";
  if (screen === "review") return "Answer Review";
  if (screen === "analytics") return "My Analytics";
};

  const availableSets = selectedSubject
    ? testSets[selectedSubject.id] || []
    : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Navbar />
      <Sidebar />

      <main className="p-4 pb-28 sm:p-6 lg:ml-56 lg:p-8">

        {/* Hero Section */}
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

        {/* Categories */}
{screen === "categories" && (
  <section className="mt-9">

    <div className="mb-5">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        Choose Your Category
      </h2>

      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Select your class or exam to explore available mock tests.
      </p>
    </div>

    {/* View My Analytics Button */}
    <div className="mb-6 flex justify-end">
      <button
        onClick={() => navigate("/analytics")}
        className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        <BarChart3 size={18} />
        View My Analytics
      </button>
    </div>

    {/* Category Cards */}
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onClick={() => openCategory(category)}
        />
      ))}
    </div>

  </section>
)}

        {/* Subjects */}
        {screen === "subjects" && (
          <section className="mt-8">
            <button
              onClick={goBack}
              className="mb-5 flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400"
            >
              <ArrowLeft size={17} />
              Back to Categories
            </button>

            {/* Class 11 and 12 stream selection */}
            {(selectedCategory?.id === "class-11" ||
              selectedCategory?.id === "class-12") && (
              <div className="mb-7">
                <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                  Select Your Stream
                </h2>

                <div className="flex flex-wrap gap-3">
                  {streams.map((stream) => (
                    <button
                      key={stream}
                      onClick={() => setSelectedStream(stream)}
                      className={`rounded-xl border px-6 py-3 text-sm font-semibold transition ${
                        selectedStream === stream
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-gray-200 bg-white text-gray-700 hover:border-indigo-400 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300"
                      }`}
                    >
                      {stream}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* JEE Main / Advanced selection */}
            {selectedCategory?.id === "jee" && (
              <div className="mb-7">
                <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                  Select JEE Exam
                </h2>

                <div className="flex flex-wrap gap-3">
                  {["JEE Main", "JEE Advanced"].map((exam) => (
                    <button
                      key={exam}
                      onClick={() => setSelectedExam(exam)}
                      className={`rounded-xl border px-6 py-3 text-sm font-semibold transition ${
                        selectedExam === exam
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-gray-200 bg-white text-gray-700 hover:border-indigo-400 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300"
                      }`}
                    >
                      {exam}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-5">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Choose Your Subject
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Select a subject to view available test sets.
              </p>
            </div>

            {(
              selectedCategory?.id === "class-11" ||
              selectedCategory?.id === "class-12"
            ) && !selectedStream ? (
              <p className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-slate-700">
                Please select your stream first.
              </p>
            ) : selectedCategory?.id === "jee" && !selectedExam ? (
              <p className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-slate-700">
                Please select JEE Main or JEE Advanced first.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {getSubjects().map((subject) => (
                  <SubjectCard
                    key={subject.id}
                    subject={subject}
                    onClick={() => openSubject(subject)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Test Sets */}
        {screen === "sets" && (
          <section className="mt-8">
            <button
              onClick={goBack}
              className="mb-5 flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400"
            >
              <ArrowLeft size={17} />
              Back to Subjects
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Available Test Sets
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {selectedCategory?.name} / {selectedSubject?.name}
                {selectedStream ? ` / ${selectedStream}` : ""}
                {selectedExam ? ` / ${selectedExam}` : ""}
              </p>
            </div>

            {availableSets.length > 0 ? (
              <div className="grid gap-5 xl:grid-cols-2">
                {availableSets.map((test) => (
                  <TestSetCard
                    key={test.id}
                    test={test}
                    onSelectLanguage={openTest}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
                <ClipboardList
                  className="mx-auto text-gray-400"
                  size={38}
                />

                <h3 className="mt-4 font-bold text-gray-900 dark:text-white">
                  No Test Sets Available
                </h3>

                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  New tests will appear here once the admin publishes them.
                </p>
              </div>
            )}
          </section>
        )}
 {/* Test Instructions */}
{screen === "instructions" && (
  <TestInstructions
    test={selectedTest}
    category={selectedCategory}
    subject={selectedSubject}
    language={selectedLanguage}
    stream={selectedStream}
    exam={selectedExam}
    onBack={goBack}
    onStart={() => {
  setScreen("exam");
}}
  />
)}
{/* Exam Screen */}
{screen === "exam" && (
  <ExamScreen
    test={selectedTest}
    questions={mockTestQuestions[selectedSubject?.id] || []}
    language={selectedLanguage}
   onSubmit={(result) => {
  const newAttempt = {
    id: Date.now(),
    testTitle: selectedTest?.title || "Mock Test",
    category: selectedCategory?.name || "General",
    subject: selectedSubject?.name || "General",
    date: new Date().toISOString(),
    correct: result.correct,
    incorrect: result.incorrect,
    unanswered: result.unanswered,
    total: result.total,
    percentage: result.total > 0
      ? Math.round((result.correct / result.total) * 100)
      : 0
  };

  const updatedAttempts = [newAttempt, ...attempts];

  setAttempts(updatedAttempts);

  localStorage.setItem(
    "mockTestAttempts",
    JSON.stringify(updatedAttempts)
  );

  setExamResult(result);
  setScreen("result");
}}
  />
)}

{/* Result Screen */}

{screen === "result" && examResult && (
  <ResultScreen
    result={examResult}
    test={selectedTest}
    onBack={goBack}
    onReview={() => setScreen("review")}
  />
)}

{/* Answer Review Screen */}
{screen === "review" && examResult && (
  <AnswerReview
    result={examResult}
    onBack={goBack}
  />
)}
{/* Analytics Dashboard */}
{screen === "analytics" && (
  <AnalyticsScreen attempts={attempts} />
)}
      </main>

      <BottomNav />
    </div>
  );
}

export default MockTests;