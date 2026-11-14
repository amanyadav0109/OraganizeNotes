
import { useEffect, useState } from "react";
import {
  Search,
  ChevronDown,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Bookmark,
  CheckCircle2,
  Circle,
  X,
  Code2,
  FileQuestion,
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  BookOpen,
  Eye,
  EyeOff,
  Clock3,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import api from "../services/api";

function Practice() {
  // SUBJECTS
  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState("");
  const [subjectName, setSubjectName] = useState("");

  // TOPICS
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [topicSearch, setTopicSearch] = useState("");
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);

  // QUESTIONS
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // ANSWER SCREEN
  const [writtenAnswer, setWrittenAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [checkingAnswer, setCheckingAnswer] = useState(false);

  // FILTERS
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [status, setStatus] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  // UI
  const [view, setView] = useState("list");
  const [bookmarked, setBookmarked] = useState([]);

  // LOADING / ERROR
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [error, setError] = useState("");

  // PAGINATION
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    page: 1,
    limit: 20,
  });

  // ---------------------------------------------
  // GET SUBJECTS
  // ---------------------------------------------
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoadingSubjects(true);
        setError("");

        const response = await api.get("/practice/subjects");

        const data = Array.isArray(response.data)
          ? response.data
          : response.data.subjects || [];

        setSubjects(data);

        if (data.length > 0) {
          setSubjectId(String(data[0].id));
          setSubjectName(data[0].name);
        } else {
          setSubjectId("");
          setSubjectName("");
        }
      } catch (err) {
        console.error("SUBJECT ERROR:", err);
        setError(
          err.response?.data?.message ||
            "Unable to load practice subjects."
        );
      } finally {
        setLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, []);

  // ---------------------------------------------
  // GET TOPICS
  // ---------------------------------------------
  useEffect(() => {
    if (!subjectId) {
      setTopics([]);
      return;
    }

    const fetchTopics = async () => {
      try {
        setLoadingTopics(true);

        const response = await api.get(
          `/practice/topics/${subjectId}`
        );

        const data = Array.isArray(response.data)
          ? response.data
          : response.data.topics || [];

        setTopics(data);
      } catch (err) {
        console.error("TOPIC ERROR:", err);
        setTopics([]);
        setError(
          err.response?.data?.message ||
            "Unable to load topics."
        );
      } finally {
        setLoadingTopics(false);
      }
    };

    fetchTopics();
  }, [subjectId]);

  // ---------------------------------------------
  // GET QUESTIONS FROM DATABASE
  // ---------------------------------------------
  useEffect(() => {
    if (!subjectId) {
      setQuestions([]);
      setPagination({
        total: 0,
        totalPages: 1,
        page: 1,
        limit: 20,
      });
      return;
    }

    const fetchQuestions = async () => {
      try {
        setLoadingQuestions(true);
        setError("");

        const params = {
          subjectId,
          page,
          limit: 20,
          search: search.trim(),
          difficulty:
            difficulty === "All" ? "" : difficulty,
          status: status === "All" ? "" : status,
          sort: sortBy,
        };

        if (selectedTopics.length > 0) {
          params.topics = selectedTopics.join(",");
        }

        const response = await api.get(
          "/practice/questions",
          { params }
        );

        const data = Array.isArray(response.data)
          ? response.data
          : response.data.questions || [];

        setQuestions(data);

        if (response.data.pagination) {
          setPagination(response.data.pagination);
        } else {
          setPagination({
            total: data.length,
            totalPages: 1,
            page: 1,
            limit: 20,
          });
        }
      } catch (err) {
        console.error("QUESTION ERROR:", err);
        setQuestions([]);
        setError(
          err.response?.data?.message ||
            "Unable to load questions."
        );
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, [
    subjectId,
    selectedTopics,
    search,
    difficulty,
    status,
    sortBy,
    page,
  ]);

  // ---------------------------------------------
  // SUBJECT CHANGE
  // ---------------------------------------------
  const handleSubjectChange = (value) => {
    const selectedSubject = subjects.find(
      (item) => String(item.id) === String(value)
    );

    setSubjectId(String(value));
    setSubjectName(selectedSubject?.name || "");
    setSelectedTopics([]);
    setTopicSearch("");
    setShowTopicDropdown(false);
    setPage(1);
  };

  // ---------------------------------------------
  // TOPIC FILTER
  // ---------------------------------------------
  const filteredTopics = topics.filter((topic) =>
    topic.name
      ?.toLowerCase()
      .includes(topicSearch.toLowerCase())
  );

  const toggleTopic = (topicId) => {
    const id = Number(topicId);

    setSelectedTopics((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );

    setPage(1);
  };

  const removeTopic = (topicId) => {
    setSelectedTopics((prev) =>
      prev.filter((id) => id !== Number(topicId))
    );
    setPage(1);
  };

  const getTopicName = (topicId) => {
    const topic = topics.find(
      (item) => Number(item.id) === Number(topicId)
    );

    return topic?.name || "";
  };

  // ---------------------------------------------
  // CLEAR FILTERS
  // ---------------------------------------------
  const clearFilters = () => {
    setSearch("");
    setSelectedTopics([]);
    setDifficulty("All");
    setStatus("All");
    setSortBy("Newest");
    setPage(1);
  };

  // ---------------------------------------------
  // BOOKMARK
  // ---------------------------------------------
  const toggleBookmark = (id) => {
    setBookmarked((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  // ---------------------------------------------
  // OPEN QUESTION SCREEN
  // ---------------------------------------------
  const openQuestion = (question) => {
    setSelectedQuestion(question);
    setWrittenAnswer("");
    setShowAnswer(false);
    setCheckingAnswer(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ---------------------------------------------
  // CHECK / SHOW CORRECT ANSWER
  // ---------------------------------------------
const handleCheckAnswer = async () => {
  if (!selectedQuestion?.id) return;

  if (showAnswer) {
    setShowAnswer(false);
    return;
  }

  if (!writtenAnswer.trim()) {
    alert("Please write your answer first.");
    return;
  }

  try {
    setCheckingAnswer(true);
    setError("");

    const response = await api.get(
      `/practice/questions/${selectedQuestion.id}`
    );

  console.log(
  "PRACTICE ANSWER API:",
  JSON.stringify(response.data, null, 2)
);

console.log("API BASE URL:", api.defaults.baseURL);
console.log("QUESTION ID:", selectedQuestion.id);

    if (!response.data?.success || !response.data?.question) {
      throw new Error(
        response.data?.message || "Unable to fetch correct answer."
      );
    }

    const questionData = response.data.question;

    const correctAnswer =
      questionData.correctAnswer ??
      questionData.correct_answer ??
      "";

    const explanation =
      questionData.explanation ?? "";

    console.log("FETCHED CORRECT ANSWER:", correctAnswer);
    console.log("FETCHED EXPLANATION:", explanation);

    setSelectedQuestion((prev) => ({
      ...prev,
      ...questionData,
      correctAnswer,
      explanation,
    }));

    setShowAnswer(true);

  } catch (err) {
    console.error("CHECK ANSWER ERROR:", err);

    alert(
      err.response?.data?.message ||
        err.message ||
        "Unable to load correct answer."
    );

  } finally {
    setCheckingAnswer(false);
  }
};
 
  // ---------------------------------------------
  // CLOSE QUESTION SCREEN
  // ---------------------------------------------
  const closeQuestion = () => {
    setSelectedQuestion(null);
    setWrittenAnswer("");
    setShowAnswer(false);
    setCheckingAnswer(false);
  };

  // ---------------------------------------------
  // PREVIOUS / NEXT QUESTION
  // ---------------------------------------------
  const currentQuestionIndex = questions.findIndex(
    (item) =>
      Number(item.id) === Number(selectedQuestion?.id)
  );

  const goToQuestion = (direction) => {
    const nextIndex = currentQuestionIndex + direction;

    if (
      nextIndex < 0 ||
      nextIndex >= questions.length
    ) {
      return;
    }

    openQuestion(questions[nextIndex]);
  };

  // ---------------------------------------------
  // QUESTION SCREEN
  // ---------------------------------------------
  if (selectedQuestion) {
    const correctAnswer =
      selectedQuestion.correctAnswer ||
      selectedQuestion.correct_answer ||
      "";

    const explanation =
      selectedQuestion.explanation || "";

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
        <Navbar />
        <Sidebar />

        <main className="min-h-screen p-4 pb-24 sm:p-6 lg:ml-56 lg:p-8">
          <div className="mx-auto max-w-5xl">

            {/* TOP NAVIGATION */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={closeQuestion}
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-200 dark:hover:bg-slate-800"
              >
                <ArrowLeft size={17} />
                Back to Practice
              </button>

              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {subjectName || "Practice"}
              </span>
            </div>

            {/* QUESTION HEADER */}
            <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    {selectedQuestion.topicName ||
                      selectedQuestion.topic ||
                      getTopicName(selectedQuestion.topicId) ||
                      "General"}
                  </span>

                  <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:bg-slate-800 dark:text-gray-300">
                    {selectedQuestion.difficulty || "Medium"}
                  </span>

                  <span className="rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                    Descriptive
                  </span>
                </div>

                <button
                  onClick={() =>
                    toggleBookmark(selectedQuestion.id)
                  }
                  className="rounded-xl border border-gray-200 p-2.5 text-gray-500 transition hover:bg-gray-100 dark:border-slate-700 dark:hover:bg-slate-800"
                  title="Bookmark question"
                >
                  <Bookmark
                    size={19}
                    className={
                      bookmarked.includes(selectedQuestion.id)
                        ? "fill-blue-500 text-blue-500"
                        : ""
                    }
                  />
                </button>
              </div>

              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Practice Question
              </p>

              <h1 className="text-xl font-bold leading-relaxed text-gray-900 dark:text-white sm:text-2xl">
                {selectedQuestion.question ||
                  selectedQuestion.title}
              </h1>

              <div className="mt-6 flex items-center gap-2 border-t border-gray-100 pt-4 text-xs text-gray-500 dark:border-slate-800">
                <Clock3 size={15} />
                Take your time and write your answer carefully.
              </div>
            </div>

            {/* WRITE ANSWER */}
            <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
              <div className="mb-4 flex items-center gap-2">
                <div className="rounded-lg bg-green-50 p-2 dark:bg-green-900/20">
                  <BookOpen
                    size={19}
                    className="text-green-600 dark:text-green-400"
                  />
                </div>

                <div>
                  <h2 className="font-bold text-gray-900 dark:text-white">
                    Your Answer
                  </h2>
                  <p className="text-xs text-gray-500">
                    Write your answer in the space below.
                  </p>
                </div>
              </div>

              <textarea
                value={writtenAnswer}
                onChange={(e) => {
                  setWrittenAnswer(e.target.value);

                  // Hide the previous answer if student edits their response.
                  if (showAnswer) {
                    setShowAnswer(false);
                  }
                }}
                placeholder="Start writing your answer here..."
                rows={9}
                className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm leading-7 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900/30"
              />

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-gray-400">
                  {writtenAnswer.trim().length} characters
                </span>

                <button
                  onClick={handleCheckAnswer}
                  disabled={
                    !writtenAnswer.trim() || checkingAnswer
                  }
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {checkingAnswer ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Loading Answer...
                    </>
                  ) : showAnswer ? (
                    <>
                      <EyeOff size={17} />
                      Hide Answer
                    </>
                  ) : (
                    <>
                      <Eye size={17} />
                      Check Answer
                    </>
                  )}
                </button>
              </div>

              <p className="mt-3 text-xs text-gray-400">
                Self-practice mode: compare your response with
                the correct answer after writing it.
              </p>
            </div>

            {/* CORRECT ANSWER AND EXPLANATION */}
            {showAnswer && (
              <div className="mb-5 space-y-4">
                <div className="rounded-2xl border border-green-200 bg-white p-5 shadow-sm dark:border-green-900/50 dark:bg-slate-900 sm:p-7">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                      <CheckCircle2
                        size={20}
                        className="text-green-600 dark:text-green-400"
                      />
                    </div>

                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      Correct Answer
                    </h2>
                  </div>

                  {correctAnswer ? (
                    <div className="whitespace-pre-wrap text-sm leading-7 text-gray-700 dark:text-gray-300">
                      {correctAnswer}
                    </div>
                  ) : (
                    <p className="text-sm text-amber-600">
                      Correct answer is not available. Please
                      check the answer saved from the admin panel.
                    </p>
                  )}
                </div>

                <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm dark:border-blue-900/50 dark:bg-slate-900 sm:p-7">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                      <Lightbulb
                        size={20}
                        className="text-blue-600 dark:text-blue-400"
                      />
                    </div>

                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      Explanation
                    </h2>
                  </div>

                  {explanation ? (
                    <div className="whitespace-pre-wrap text-sm leading-7 text-gray-700 dark:text-gray-300">
                      {explanation}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No explanation is available for this question.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* QUESTION NAVIGATION */}
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => goToQuestion(-1)}
                disabled={currentQuestionIndex <= 0}
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-200 dark:hover:bg-slate-800"
              >
                <ArrowLeft size={17} />
                Previous
              </button>

              <span className="text-xs text-gray-500">
                {currentQuestionIndex >= 0
                  ? `${currentQuestionIndex + 1} / ${questions.length}`
                  : "Question"}
              </span>

              <button
                onClick={() => goToQuestion(1)}
                disabled={
                  currentQuestionIndex < 0 ||
                  currentQuestionIndex >= questions.length - 1
                }
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </main>

        <BottomNav />
      </div>
    );
  }

  // ---------------------------------------------
  // MAIN PRACTICE PAGE
  // ---------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Navbar />
      <Sidebar />

      <main className="p-4 pb-24 sm:p-6 lg:ml-56 lg:p-8">
        <div className="mb-7 flex items-center gap-3">
          <div className="rounded-2xl bg-blue-100 p-3 dark:bg-blue-900/30">
            <Code2
              size={28}
              className="text-blue-600 dark:text-blue-400"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Practice Zone
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Practice descriptive questions and improve your
              understanding topic by topic.
            </p>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-5 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400">
            {error}
            <button onClick={() => setError("")}>
              <X size={17} />
            </button>
          </div>
        )}

        {/* FILTER PANEL */}
        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white">
                Find Practice Questions
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Select a subject and filter questions by topic.
              </p>
            </div>

            <div className="flex items-center gap-1 rounded-lg border border-gray-200 p-1 dark:border-slate-700">
              <button
                onClick={() => setView("grid")}
                className={`rounded-md p-2 ${
                  view === "grid"
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40"
                    : "text-gray-500"
                }`}
              >
                <LayoutGrid size={17} />
              </button>

              <button
                onClick={() => setView("list")}
                className={`rounded-md p-2 ${
                  view === "list"
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40"
                    : "text-gray-500"
                }`}
              >
                <List size={17} />
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {/* SEARCH */}
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search questions..."
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-3 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* SUBJECT */}
            <div className="relative">
              <select
                value={subjectId}
                onChange={(e) =>
                  handleSubjectChange(e.target.value)
                }
                disabled={loadingSubjects}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 py-3 pr-9 text-sm text-gray-800 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {loadingSubjects ? (
                  <option value="">Loading subjects...</option>
                ) : subjects.length > 0 ? (
                  subjects.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))
                ) : (
                  <option value="">No subjects available</option>
                )}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
            </div>

            {/* TOPIC */}
            <div className="relative">
              <button
                onClick={() =>
                  setShowTopicDropdown((prev) => !prev)
                }
                className="flex w-full items-center justify-between rounded-xl border border-gray-200 px-3 py-3 text-sm text-gray-700 dark:border-slate-700 dark:text-gray-300"
              >
                <span className="flex items-center gap-2">
                  <SlidersHorizontal size={16} />
                  Topics
                  {selectedTopics.length > 0 && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                      {selectedTopics.length}
                    </span>
                  )}
                </span>
                <ChevronDown size={16} />
              </button>

              {showTopicDropdown && (
                <div className="absolute left-0 top-full z-30 mt-2 w-full min-w-[260px] rounded-xl border border-gray-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                  <div className="relative mb-3">
                    <Search
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      value={topicSearch}
                      onChange={(e) =>
                        setTopicSearch(e.target.value)
                      }
                      placeholder="Search topics..."
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div className="max-h-64 space-y-1 overflow-y-auto">
                    {loadingTopics ? (
                      <p className="py-5 text-center text-xs text-gray-500">
                        Loading topics...
                      </p>
                    ) : filteredTopics.length > 0 ? (
                      filteredTopics.map((topic) => (
                        <label
                          key={topic.id}
                          className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800"
                        >
                          <input
                            type="checkbox"
                            checked={selectedTopics.includes(
                              Number(topic.id)
                            )}
                            onChange={() =>
                              toggleTopic(topic.id)
                            }
                            className="h-4 w-4 accent-blue-600"
                          />
                          {topic.name}
                        </label>
                      ))
                    ) : (
                      <p className="py-4 text-center text-xs text-gray-500">
                        No topics found.
                      </p>
                    )}
                  </div>

                  <div className="mt-3 flex justify-between border-t border-gray-200 pt-3 dark:border-slate-700">
                    <button
                      onClick={() => {
                        setSelectedTopics([]);
                        setPage(1);
                      }}
                      className="text-xs text-gray-500 hover:text-red-500"
                    >
                      Clear
                    </button>

                    <button
                      onClick={() =>
                        setShowTopicDropdown(false)
                      }
                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* DIFFICULTY */}
            <div className="relative">
              <select
                value={difficulty}
                onChange={(e) => {
                  setDifficulty(e.target.value);
                  setPage(1);
                }}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 py-3 pr-9 text-sm text-gray-800 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
            </div>

            {/* STATUS */}
            <div className="relative">
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 py-3 pr-9 text-sm text-gray-800 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="All">All Status</option>
                <option value="Solved">Solved</option>
                <option value="Unsolved">Unsolved</option>
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
            </div>
          </div>

          {/* SELECTED FILTERS */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">
              Selected:
            </span>

            {subjectName && (
              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {subjectName}
              </span>
            )}

            {selectedTopics.map((topicId) => (
              <span
                key={topicId}
                className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-300"
              >
                {getTopicName(topicId)}
                <button onClick={() => removeTopic(topicId)}>
                  <X size={13} />
                </button>
              </span>
            ))}

            <button
              onClick={clearFilters}
              className="rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-800"
            >
              Clear all
            </button>
          </div>
        </section>

        {/* QUESTIONS SECTION */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 p-4 dark:border-slate-800 sm:p-5">
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white">
                {subjectName || "Practice"} Questions
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                {pagination.total || 0} questions available
              </p>
            </div>

            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="Newest">Sort: Newest</option>
              <option value="Difficulty">Sort: Difficulty</option>
              <option value="Most Attempted">
                Sort: Most Attempted
              </option>
            </select>
          </div>

          {/* LOADING */}
          {loadingQuestions ? (
            <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
              <p className="mt-4 text-sm text-gray-500">
                Loading questions...
              </p>
            </div>
          ) : questions.length > 0 ? (
            <div
              className={
                view === "grid"
                  ? "grid gap-3 p-4 sm:grid-cols-2"
                  : ""
              }
            >
              {questions.map((question) => (
                <div
                  key={question.id}
                  className={`group flex flex-col gap-4 border-b border-gray-100 p-4 transition hover:bg-blue-50/50 dark:border-slate-800 dark:hover:bg-slate-800/40 sm:flex-row sm:items-center sm:justify-between sm:px-5 ${
                    view === "grid"
                      ? "rounded-xl border border-gray-200 dark:border-slate-700"
                      : ""
                  }`}
                >
                  <button
                    onClick={() => openQuestion(question)}
                    className="flex min-w-0 flex-1 items-start gap-3 text-left"
                  >
                    <div className="mt-1 shrink-0">
                      {question.isSolved ? (
                        <CheckCircle2
                          className="text-green-500"
                          size={20}
                        />
                      ) : (
                        <Circle
                          className="text-gray-400"
                          size={20}
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold leading-6 text-gray-800 transition group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                        {question.question || question.title}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-purple-50 px-2 py-1 text-[10px] font-semibold uppercase text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                          Descriptive
                        </span>

                        <span className="text-xs text-gray-500">
                          {question.topicName ||
                            question.topic ||
                            getTopicName(question.topicId)}
                        </span>
                      </div>
                    </div>
                  </button>

                  <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        question.difficulty === "Easy"
                          ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                          : question.difficulty === "Hard"
                          ? "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                          : "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      }`}
                    >
                      {question.difficulty || "Medium"}
                    </span>

                    <span className="text-xs text-gray-500">
                      {question.attemptCount ??
                        question.attempts ??
                        0}{" "}
                      attempts
                    </span>

                    <button
                      onClick={() =>
                        toggleBookmark(question.id)
                      }
                      className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-slate-800"
                      title="Bookmark"
                    >
                      <Bookmark
                        size={18}
                        className={
                          bookmarked.includes(question.id)
                            ? "fill-blue-500 text-blue-500"
                            : ""
                        }
                      />
                    </button>

                    <button
                      onClick={() => openQuestion(question)}
                      className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                    >
                      Practice
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
              <div className="rounded-2xl bg-blue-50 p-5 dark:bg-blue-900/20">
                <FileQuestion
                  size={35}
                  className="text-blue-600 dark:text-blue-400"
                />
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900 dark:text-white">
                No Questions Available
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
                No descriptive questions were found for the
                selected filters. Try changing your filters or
                check back later.
              </p>
            </div>
          )}

          {/* PAGINATION */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 p-4 dark:border-slate-800">
              <button
                disabled={page <= 1}
                onClick={() =>
                  setPage((prev) => prev - 1)
                }
                className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700"
              >
                Previous
              </button>

              <span className="text-xs text-gray-500">
                Page {pagination.page || page} of{" "}
                {pagination.totalPages}
              </span>

              <button
                disabled={page >= pagination.totalPages}
                onClick={() =>
                  setPage((prev) => prev + 1)
                }
                className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

export default Practice;
