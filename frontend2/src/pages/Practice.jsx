import { useEffect, useState } from "react";
import {
  Search,
  ChevronDown,
  List,
  LayoutGrid,
  SlidersHorizontal,
  Bookmark,
  CheckCircle2,
  Circle,
  X,
  Code2,
  FileQuestion,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import api from "../services/api";

function Practice() {
  // =========================
  // SUBJECTS
  // =========================
  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState("");
  const [subjectName, setSubjectName] = useState("");

  // =========================
  // TOPICS
  // =========================
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [topicSearch, setTopicSearch] = useState("");
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);

  // =========================
  // QUESTIONS
  // =========================
  const [questions, setQuestions] = useState([]);

  // =========================
  // FILTERS
  // =========================
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [status, setStatus] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  // =========================
  // UI
  // =========================
  const [view, setView] = useState("list");
  const [bookmarked, setBookmarked] = useState([]);

  // =========================
  // LOADING / ERROR
  // =========================
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // PAGINATION
  // =========================
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 20,
  });

  // =====================================================
  // 1. GET SUBJECTS
  // =====================================================
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoadingSubjects(true);
        setError("");

        const response = await api.get("/practice/subjects");

        console.log("SUBJECTS RESPONSE:", response.data);

        const data = Array.isArray(response.data)
          ? response.data
          : response.data.subjects || [];

        setSubjects(data);

        // Select first subject automatically
        if (data.length > 0) {
          setSubjectId(String(data[0].id));
          setSubjectName(data[0].name);
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

  // =====================================================
  // 2. GET TOPICS WHEN SUBJECT CHANGES
  // =====================================================
  useEffect(() => {
    if (!subjectId) return;

    const fetchTopics = async () => {
      try {
        setLoadingTopics(true);
        setSelectedTopics([]);

        const response = await api.get(
          `/practice/topics/${subjectId}`
        );

        console.log("TOPICS RESPONSE:", response.data);

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

  // =====================================================
  // 3. GET QUESTIONS
  // =====================================================
  useEffect(() => {
    if (!subjectId) return;

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
          status:
            status === "All" ? "" : status,
          sort:
            sortBy === "Newest"
              ? "newest"
              : sortBy === "Difficulty"
              ? "difficulty"
              : "attempts",
        };

        // Add topic IDs only if topics are selected
        if (selectedTopics.length > 0) {
          params.topics = selectedTopics.join(",");
        }

        console.log("QUESTION PARAMS:", params);

        const response = await api.get(
          "/practice/questions",
          {
            params,
          }
        );

        console.log(
          "QUESTIONS RESPONSE:",
          response.data
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
            currentPage: 1,
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

  // =====================================================
  // SUBJECT CHANGE
  // =====================================================
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

  // =====================================================
  // TOPIC SEARCH
  // =====================================================
  const filteredTopics = topics.filter((topic) =>
    topic.name
      .toLowerCase()
      .includes(topicSearch.toLowerCase())
  );

  // =====================================================
  // TOPIC SELECT / DESELECT
  // =====================================================
  const toggleTopic = (topicId) => {
    setSelectedTopics((prev) =>
      prev.includes(Number(topicId))
        ? prev.filter(
            (id) => id !== Number(topicId)
          )
        : [...prev, Number(topicId)]
    );

    setPage(1);
  };

  // =====================================================
  // REMOVE TOPIC
  // =====================================================
  const removeTopic = (topicId) => {
    setSelectedTopics((prev) =>
      prev.filter((id) => id !== Number(topicId))
    );

    setPage(1);
  };

  // =====================================================
  // CLEAR FILTERS
  // =====================================================
  const clearFilters = () => {
    setSearch("");
    setSelectedTopics([]);
    setDifficulty("All");
    setStatus("All");
    setSortBy("Newest");
    setPage(1);
  };

  // =====================================================
  // BOOKMARK
  // =====================================================
  const toggleBookmark = (id) => {
    setBookmarked((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  // =====================================================
  // GET TOPIC NAME
  // =====================================================
  const getTopicName = (topicId) => {
    const topic = topics.find(
      (item) => Number(item.id) === Number(topicId)
    );

    return topic?.name || "";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Navbar />
      <Sidebar />

      <main className="p-4 pb-24 sm:p-6 lg:ml-56 lg:p-8">

        {/* ================= HEADER ================= */}

        <div className="mb-7">
          <div className="flex items-center gap-3">

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
                Explore problems and improve your skills topic by topic.
              </p>
            </div>

          </div>
        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {/* ================= FILTER PANEL ================= */}

        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

            <h2 className="font-bold text-gray-900 dark:text-white">
              All Problems
            </h2>

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

          {/* ================= FILTERS ================= */}

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
                placeholder="Search problems..."
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
                  <option>Loading...</option>
                ) : (
                  subjects.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.name}
                    </option>
                  ))
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
                className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-sm ${
                  showTopicDropdown
                    ? "border-blue-500 text-blue-600"
                    : "border-gray-200 text-gray-700 dark:border-slate-700 dark:text-gray-300"
                }`}
              >

                <span className="flex items-center gap-2">

                  <SlidersHorizontal size={16} />

                  Topic

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

                  {/* Topic Search */}

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

                  {/* Topics */}

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

                  {/* Topic Buttons */}

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

                <option value="All">
                  All Difficulties
                </option>

                <option value="Easy">
                  Easy
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="Hard">
                  Hard
                </option>

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

                <option value="All">
                  All Status
                </option>

                <option value="Solved">
                  Solved
                </option>

                <option value="Unsolved">
                  Unsolved
                </option>

              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              />

            </div>

          </div>

          {/* ================= CHIPS ================= */}

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

                <button
                  onClick={() =>
                    removeTopic(topicId)
                  }
                >
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

        {/* ================= QUESTION TABLE ================= */}

        <section className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

          {/* HEADER */}

          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 p-4 dark:border-slate-800 sm:p-5">

            <div>

              <h2 className="font-bold text-gray-900 dark:text-white">
                {subjectName || "Practice"} Problems
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                {selectedTopics.length > 0
                  ? selectedTopics
                      .map((id) =>
                        getTopicName(id)
                      )
                      .join(", ")
                  : "All topics"}
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

              <option value="Newest">
                Sort: Newest
              </option>

              <option value="Difficulty">
                Sort: Difficulty
              </option>

              <option value="Most Attempted">
                Most Attempted
              </option>

            </select>

          </div>

          {/* TABLE HEADER */}

          <div className="hidden grid-cols-12 gap-3 bg-gray-50 px-5 py-3 text-xs font-bold uppercase text-gray-500 dark:bg-slate-800/70 md:grid">

            <div className="col-span-1">
              Status
            </div>

            <div className="col-span-5">
              Problem
            </div>

            <div className="col-span-2">
              Topic
            </div>

            <div className="col-span-2">
              Difficulty
            </div>

            <div className="col-span-1">
              Attempts
            </div>

            <div className="col-span-1">
              Save
            </div>

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
                  className="grid grid-cols-1 gap-3 border-b border-gray-200 p-4 dark:border-slate-800 md:grid-cols-12 md:items-center md:px-5"
                >

                  {/* STATUS */}

                  <div className="md:col-span-1">

                    {question.isSolved ? (
                      <CheckCircle2
                        className="text-green-500"
                        size={19}
                      />
                    ) : (
                      <Circle
                        className="text-gray-400"
                        size={19}
                      />
                    )}

                  </div>

                  {/* QUESTION */}

                  <div className="md:col-span-5">

                    <p className="font-semibold text-gray-800 dark:text-white">
                      {question.title ||
                        question.question}
                    </p>

                    <span className="mt-1 inline-block rounded bg-gray-100 px-2 py-1 text-[10px] uppercase text-gray-500 dark:bg-slate-800">
                      {question.type}
                    </span>

                  </div>

                  {/* TOPIC */}

                  <div className="text-xs text-gray-500 md:col-span-2">
                    {question.topic}
                  </div>

                  {/* DIFFICULTY */}

                  <div className="md:col-span-2">

                    <span className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {question.difficulty}
                    </span>

                  </div>

                  {/* ATTEMPTS */}

                  <div className="text-xs text-gray-500 md:col-span-1">
                    {question.attemptCount ??
                      question.attempts ??
                      0}
                  </div>

                  {/* BOOKMARK */}

                  <div className="md:col-span-1">

                    <button
                      onClick={() =>
                        toggleBookmark(question.id)
                      }
                    >

                      <Bookmark
                        size={18}
                        className={
                          bookmarked.includes(
                            question.id
                          )
                            ? "fill-blue-500 text-blue-500"
                            : "text-gray-400"
                        }
                      />

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
                No questions were found for the selected filters.
              </p>

            </div>

          )}

          {/* ================= PAGINATION ================= */}

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
                Page {pagination.currentPage || page}{" "}
                of {pagination.totalPages}
              </span>

              <button
                disabled={
                  page >= pagination.totalPages
                }
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