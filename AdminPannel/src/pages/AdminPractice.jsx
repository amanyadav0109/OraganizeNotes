
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Layers3,
  FileText,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const API_BASE = `${import.meta.env.VITE_SERVER_URL}/api/admin`;

const emptyForm = {
  name: "",
  description: "",
  subjectId: "",
  topicId: "",
  question: "",
  correctAnswer: "",
  explanation: "",
  difficulty: "Medium",
};

export default function AdminPractice() {
  const [activeTab, setActiveTab] = useState("subjects");

  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const token = localStorage.getItem("getnotesAdminToken");

  const apiRequest = useCallback(async (endpoint, options = {}) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong.");
    }

    return data;
  }, [token]);

  const loadSubjects = useCallback(async () => {
    const data = await apiRequest("/practice/subjects");
    setSubjects(data.subjects || []);
  }, [apiRequest]);

  const loadTopics = useCallback(async () => {
    const params = new URLSearchParams();

    if (selectedSubject) {
      params.set("subjectId", selectedSubject);
    }

    const data = await apiRequest(
      `/practice/topics${params.toString() ? `?${params}` : ""}`
    );

    setTopics(data.topics || []);
  }, [apiRequest, selectedSubject]);

  const loadQuestions = useCallback(async () => {
    const params = new URLSearchParams({
      page: String(page),
      limit: "10",
    });

    if (selectedSubject) params.set("subjectId", selectedSubject);
    if (selectedTopic) params.set("topicId", selectedTopic);
    if (search.trim()) params.set("search", search.trim());
    if (difficulty !== "All") params.set("difficulty", difficulty);

    const data = await apiRequest(
      `/practice/questions?${params.toString()}`
    );

    setQuestions(data.questions || []);
    setPagination(
      data.pagination || {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      }
    );
  }, [
    apiRequest,
    page,
    selectedSubject,
    selectedTopic,
    search,
    difficulty,
  ]);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      await Promise.all([
        loadSubjects(),
        loadTopics(),
        loadQuestions(),
      ]);
    } catch (err) {
      setError(err.message || "Unable to load Practice data.");
    } finally {
      setLoading(false);
    }
  }, [loadSubjects, loadTopics, loadQuestions]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const stats = useMemo(() => {
    const totalTopics = topics.length;
    const totalQuestions = subjects.reduce(
      (sum, subject) => sum + Number(subject.questionCount || 0),
      0
    );

    return {
      subjects: subjects.length,
      topics: totalTopics,
      questions: totalQuestions,
    };
  }, [subjects, topics]);

  const openAddModal = (type) => {
    setModalType(type);
    setEditingItem(null);

    setForm({
      ...emptyForm,
      subjectId: selectedSubject || "",
      topicId: selectedTopic || "",
    });

    setModalOpen(true);
    setError("");
  };

  const openEditModal = (type, item) => {
    setModalType(type);
    setEditingItem(item);

    if (type === "subject") {
      setForm({
        ...emptyForm,
        name: item.name || "",
        description: item.description || "",
      });
    } else if (type === "topic") {
      setForm({
        ...emptyForm,
        name: item.name || "",
        description: item.description || "",
        subjectId: String(item.subject_id || item.subjectId || ""),
      });
    } else {
  setForm({
    ...emptyForm,
    subjectId: String(item.subjectId || item.subject_id || ""),
    topicId: String(item.topicId || item.topic_id || ""),
    question: item.question || "",
    correctAnswer: item.correctAnswer || item.correct_answer || "",
    explanation: item.explanation || "",
    difficulty: item.difficulty || "Medium",
  });
}
    setModalOpen(true);
    setError("");
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setEditingItem(null);
    setForm(emptyForm);
  };

  const updateForm = (key, value) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
      ...(key === "subjectId" && modalType === "question"
        ? { topicId: "" }
        : {}),
    }));
  };

  const modalEndpoint = () => {
    if (modalType === "subject") {
      return editingItem
        ? `/practice/subjects/${editingItem.id}`
        : "/practice/subjects";
    }

    if (modalType === "topic") {
      return editingItem
        ? `/practice/topics/${editingItem.id}`
        : "/practice/topics";
    }

    return editingItem
      ? `/practice/questions/${editingItem.id}`
      : "/practice/questions";
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      let payload;

      if (modalType === "subject") {
        payload = {
          name: form.name.trim(),
          description: form.description.trim(),
        };
      } else if (modalType === "topic") {
        payload = {
          name: form.name.trim(),
          description: form.description.trim(),
          subjectId: Number(form.subjectId),
        };
      } else {
  payload = {
    subjectId: Number(form.subjectId),
    topicId: Number(form.topicId),
    question: form.question.trim(),
    correctAnswer: form.correctAnswer.trim(),
    explanation: form.explanation.trim(),
    difficulty: form.difficulty,
  };
}

      await apiRequest(modalEndpoint(), {
        method: editingItem ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });

      setModalOpen(false);
      setEditingItem(null);
      setForm(emptyForm);
      setSuccess(
        `${modalType[0].toUpperCase()}${modalType.slice(1)} ${
          editingItem ? "updated" : "created"
        } successfully.`
      );

      await Promise.all([
        loadSubjects(),
        loadTopics(),
        loadQuestions(),
      ]);
    } catch (err) {
      setError(err.message || "Unable to save data.");
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (type, item) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.name || item.question}"?`
    );

    if (!confirmed) return;

    setError("");

    try {
      await apiRequest(`/practice/${type}s/${item.id}`, {
        method: "DELETE",
      });

      setSuccess(`${type} deleted successfully.`);

      if (type === "subject" && String(selectedSubject) === String(item.id)) {
        setSelectedSubject("");
        setSelectedTopic("");
      }

      if (type === "topic" && String(selectedTopic) === String(item.id)) {
        setSelectedTopic("");
      }

      await Promise.all([
        loadSubjects(),
        loadTopics(),
        loadQuestions(),
      ]);
    } catch (err) {
      setError(err.message || "Unable to delete item.");
    }
  };

  const filteredTopics = topics.filter(
    (topic) =>
      !form.subjectId ||
      String(topic.subject_id || topic.subjectId) === String(form.subjectId)
  );

  const tabs = [
    { id: "subjects", label: "Subjects", icon: BookOpen },
    { id: "topics", label: "Topics", icon: Layers3 },
    { id: "questions", label: "Questions", icon: FileText },
  ];

  const heading = {
    subjects: "Manage Subjects",
    topics: "Manage Topics",
    questions: "Manage Descriptive Questions",
  };

  const addLabel = {
    subjects: "Add Subject",
    topics: "Add Topic",
    questions: "Add Question",
  };

  return (
    <div className="min-h-screen bg-white p-4 text-slate-800 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* HEADER */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
              <BookOpen size={17} />
              Practice Management
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Practice Module
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage subjects, topics and descriptive practice questions.
            </p>
          </div>

          <button
            onClick={loadAllData}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* ALERTS */}
        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="ml-auto"
              aria-label="Close error"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            <CheckCircle2 size={18} />
            {success}
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            title="Total Subjects"
            value={stats.subjects}
            icon={BookOpen}
          />
          <StatCard
            title="Total Topics"
            value={stats.topics}
            icon={Layers3}
          />
          <StatCard
            title="Descriptive Questions"
            value={stats.questions}
            icon={FileText}
          />
        </div>

        {/* TABS */}
        <div className="flex gap-2 overflow-x-auto border-b border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setPage(1);
                }}
                className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon size={17} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* SECTION HEADER */}
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {heading[activeTab]}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {activeTab === "questions"
                ? "Create and manage descriptive questions for students."
                : `View and manage all ${activeTab}.`}
            </p>
          </div>

          <button
            onClick={() => openAddModal(
              activeTab === "subjects"
                ? "subject"
                : activeTab === "topics"
                ? "topic"
                : "question"
            )}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={17} />
            {addLabel[activeTab]}
          </button>
        </div>

        {/* FILTERS */}
        {activeTab !== "subjects" && (
          <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Filter by subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  setSelectedTopic("");
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">All subjects</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            {activeTab === "questions" && (
              <>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Filter by topic
                  </label>
                  <select
                    value={selectedTopic}
                    onChange={(e) => {
                      setSelectedTopic(e.target.value);
                      setPage(1);
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">All topics</option>
                    {topics
                      .filter(
                        (topic) =>
                          !selectedSubject ||
                          String(topic.subject_id || topic.subjectId) ===
                            String(selectedSubject)
                      )
                      .map((topic) => (
                        <option key={topic.id} value={topic.id}>
                          {topic.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => {
                      setDifficulty(e.target.value);
                      setPage(1);
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="All">All difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="relative sm:col-span-2 lg:col-span-3">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search questions..."
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* CONTENT */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex min-h-64 items-center justify-center gap-2 text-sm text-slate-500">
              <Loader2 className="animate-spin" size={20} />
              Loading Practice data...
            </div>
          ) : (
            <>
              {activeTab === "subjects" && (
                <div className="divide-y divide-slate-100">
                  {subjects.length === 0 ? (
                    <EmptyState message="No subjects added yet." />
                  ) : (
                    subjects.map((subject) => (
                      <div
                        key={subject.id}
                        className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                      >
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                            <BookOpen size={21} />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-slate-900">
                              {subject.name}
                            </h3>
                            <p className="mt-1 break-words text-sm text-slate-500">
                              {subject.description || "No description added."}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                              <span className="rounded-full bg-slate-100 px-2.5 py-1">
                                {subject.topicCount || 0} Topics
                              </span>
                              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">
                                {subject.questionCount || 0} Questions
                              </span>
                            </div>
                          </div>
                        </div>

                        <ActionButtons
                          onEdit={() => openEditModal("subject", subject)}
                          onDelete={() => deleteItem("subject", subject)}
                        />
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === "topics" && (
                <div className="divide-y divide-slate-100">
                  {topics.length === 0 ? (
                    <EmptyState message="No topics found. Add a topic to get started." />
                  ) : (
                    topics.map((topic) => (
                      <div
                        key={topic.id}
                        className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                      >
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                            <Layers3 size={21} />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-slate-900">
                              {topic.name}
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                              {topic.subjectName || topic.subject_name || "Subject"}
                            </p>
                            <p className="mt-1 break-words text-sm text-slate-500">
                              {topic.description || "No description added."}
                            </p>
                            <span className="mt-2 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-700">
                              {topic.questionCount || 0} Questions
                            </span>
                          </div>
                        </div>

                        <ActionButtons
                          onEdit={() => openEditModal("topic", topic)}
                          onDelete={() => deleteItem("topic", topic)}
                        />
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === "questions" && (
                <div className="divide-y divide-slate-100">
                  {questions.length === 0 ? (
                    <EmptyState message="No descriptive questions found." />
                  ) : (
                    questions.map((question, index) => (
                      <div
                        key={question.id}
                        className="flex flex-col gap-4 p-4 sm:p-5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 gap-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-700">
                              {(page - 1) * 10 + index + 1}
                            </span>
                            <div className="min-w-0">
                              <p className="whitespace-pre-wrap break-words text-sm font-medium leading-6 text-slate-800">
                                {question.question || question.title}
                              </p>
                              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
                                  {question.subjectName || question.subject_name || "Subject"}
                                </span>
                                <span className="rounded-full bg-violet-50 px-2.5 py-1 text-violet-700">
                                  {question.topicName || question.topic || "Topic"}
                                </span>
                                <span
                                  className={`rounded-full px-2.5 py-1 ${
                                    question.difficulty === "Easy"
                                      ? "bg-green-50 text-green-700"
                                      : question.difficulty === "Hard"
                                      ? "bg-red-50 text-red-700"
                                      : "bg-amber-50 text-amber-700"
                                  }`}
                                >
                                  {question.difficulty}
                                </span>
                                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">
                                  Descriptive
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <ActionButtons
                            onEdit={() => openEditModal("question", question)}
                            onDelete={() => deleteItem("question", question)}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}

          {/* PAGINATION */}
          {activeTab === "questions" && pagination.totalPages > 1 && (
            <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Showing page {pagination.page} of {pagination.totalPages}
                {" "}· {pagination.total} questions
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((current) => current - 1)}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((current) => current + 1)}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-3 sm:p-5">
          <div className="my-auto w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingItem ? "Edit" : "Add"}{" "}
                  {modalType === "subject"
                    ? "Subject"
                    : modalType === "topic"
                    ? "Topic"
                    : "Descriptive Question"}
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Fill in the details below.
                </p>
              </div>

              <button
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={submitForm} className="space-y-4 p-5">
              {(modalType === "subject" || modalType === "topic") && (
                <>
                  {modalType === "topic" && (
                    <FormField label="Select Subject">
                      <select
                        required
                        value={form.subjectId}
                        onChange={(e) =>
                          updateForm("subjectId", e.target.value)
                        }
                        className="form-control"
                      >
                        <option value="">Choose subject</option>
                        {subjects.map((subject) => (
                          <option key={subject.id} value={subject.id}>
                            {subject.name}
                          </option>
                        ))}
                      </select>
                    </FormField>
                  )}

                  <FormField label={modalType === "subject" ? "Subject Name" : "Topic Name"}>
                    <input
                      required
                      maxLength={150}
                      value={form.name}
                      onChange={(e) => updateForm("name", e.target.value)}
                      placeholder={
                        modalType === "subject"
                          ? "e.g. Physics"
                          : "e.g. Laws of Motion"
                      }
                      className="form-control"
                    />
                  </FormField>

                  <FormField label="Description (Optional)">
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) =>
                        updateForm("description", e.target.value)
                      }
                      placeholder="Write a short description..."
                      className="form-control resize-none"
                    />
                  </FormField>
                </>
              )}

            
{modalType === "question" && (
  <>
    <FormField label="Select Subject">
      <select
        required
        value={form.subjectId}
        onChange={(e) =>
          updateForm("subjectId", e.target.value)
        }
        className="form-control"
      >
        <option value="">Choose subject</option>

        {subjects.map((subject) => (
          <option key={subject.id} value={subject.id}>
            {subject.name}
          </option>
        ))}
      </select>
    </FormField>

    <FormField label="Select Topic">
      <select
        required
        value={form.topicId}
        onChange={(e) =>
          updateForm("topicId", e.target.value)
        }
        className="form-control"
      >
        <option value="">Choose topic</option>

        {filteredTopics.map((topic) => (
          <option key={topic.id} value={topic.id}>
            {topic.name}
          </option>
        ))}
      </select>
    </FormField>

    <FormField label="Question">
      <textarea
        required
        rows={5}
        value={form.question}
        onChange={(e) =>
          updateForm("question", e.target.value)
        }
        placeholder="Enter your descriptive question..."
        className="form-control resize-y"
      />
    </FormField>

    <FormField label="Correct Answer">
      <textarea
        required
        rows={4}
        value={form.correctAnswer}
        onChange={(e) =>
          updateForm("correctAnswer", e.target.value)
        }
        placeholder="Enter the correct/model answer..."
        className="form-control resize-y"
      />
    </FormField>

    <FormField label="Explanation">
      <textarea
        required
        rows={4}
        value={form.explanation}
        onChange={(e) =>
          updateForm("explanation", e.target.value)
        }
        placeholder="Explain the answer in detail..."
        className="form-control resize-y"
      />
    </FormField>

    <FormField label="Difficulty">
      <select
        value={form.difficulty}
        onChange={(e) =>
          updateForm("difficulty", e.target.value)
        }
        className="form-control"
      >
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>
    </FormField>
  </>
)}


              {error && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {saving
                    ? "Saving..."
                    : editingItem
                    ? "Save Changes"
                    : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shared form styles */}
      <style>{`
        .form-control {
          width: 100%;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          background: white;
          padding: 0.7rem 0.85rem;
          font-size: 0.875rem;
          color: #1e293b;
          outline: none;
        }
        .form-control:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px #dbeafe;
        }
      `}</style>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
          <Icon size={19} />
        </div>
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function ActionButtons({ onEdit, onDelete }) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <button
        onClick={onEdit}
        title="Edit"
        className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
      >
        <Pencil size={16} />
      </button>
      <button
        onClick={onDelete}
        title="Delete"
        className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center px-4 text-center">
      <div className="rounded-2xl bg-slate-100 p-4 text-slate-400">
        <FileText size={26} />
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-700">{message}</p>
      <p className="mt-1 text-xs text-slate-400">
        Your data will appear here once added.
      </p>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      {children}
    </div>
  );
}
