
import { useCallback, useEffect, useState } from "react";
import {
  BookOpen,
  Layers3,
  FolderOpen,
  Plus,
  Trash2,
  ChevronRight,
  Loader2,
  ClipboardList,
  CheckCircle2,
  CircleHelp,
  Clock3,
  X,
  RefreshCw,
  Search,
  AlertCircle,
} from "lucide-react";

const API_URL = (
  import.meta.env.VITE_SERVER_URL || "http://localhost:5000"
).replace(/\/$/, "");

const EMPTY_QUESTION = {
  question: "",
  option_a: "",
  option_b: "",
  option_c: "",
  option_d: "",
  correct_answer: "A",
  explanation: "",
  marks: 1,
};

export default function AdminMockTest() {
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [testSets, setTestSets] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedTestSet, setSelectedTestSet] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
  });

  const [subjectName, setSubjectName] = useState("");
  const [topicName, setTopicName] = useState("");
  const [questionForm, setQuestionForm] = useState(EMPTY_QUESTION);

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  const [testSettings, setTestSettings] = useState({
    duration: 30,
    negative_marks: 0,
    difficulty: "Medium",
  });

  const getHeaders = () => {
    const token = localStorage.getItem("getnotesAdminToken");

    if (!token) {
      throw new Error("Admin token not found. Please login again.");
    }

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const apiRequest = async (endpoint, options = {}) => {
    const response = await fetch(`${API_URL}/api/mock-tests${endpoint}`, {
      ...options,
      headers: {
        ...getHeaders(),
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error("Admin session expired. Please login again.");
      }

      throw new Error(data.message || "Something went wrong.");
    }

    return data;
  };

  const showMessage = (message) => {
    setSuccess(message);
    setError("");

    window.setTimeout(() => {
      setSuccess("");
    }, 3000);
  };

  const handleError = (err) => {
    setError(err.message || "Something went wrong.");
    setSuccess("");
  };

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/categories");
      setCategories(data.categories || []);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSubjects = async (categoryId) => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest(
        `/subjects?category_id=${categoryId}`
      );

      setSubjects(data.subjects || []);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const loadTopics = async (subjectId) => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest(
        `/topics?subject_id=${subjectId}`
      );

      setTopics(data.topics || []);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const loadTestSets = async (topicId) => {
    const data = await apiRequest(
      `/test-sets?topic_id=${topicId}`
    );

    let sets = data.testSets || [];

    if (sets.length === 0) {
      const createData = await apiRequest("/test-sets", {
        method: "POST",
        body: JSON.stringify({
          topic_id: topicId,
          title: `${selectedTopic?.name || "Topic"} Test`,
          duration: Number(testSettings.duration),
          total_marks: 10,
          negative_marks: Number(testSettings.negative_marks),
          difficulty: testSettings.difficulty,
          status: "Published",
        }),
      });

      const newId =
        createData.testSetId ||
        createData.testSet?.id ||
        createData.id;

      if (newId) {
        sets = [
          {
            id: newId,
            topic_id: topicId,
            title: `${selectedTopic?.name || "Topic"} Test`,
            duration: Number(testSettings.duration),
            total_marks: 10,
            negative_marks: Number(testSettings.negative_marks),
            difficulty: testSettings.difficulty,
            status: "Published",
          },
        ];
      } else {
        const refreshed = await apiRequest(
          `/test-sets?topic_id=${topicId}`
        );

        sets = refreshed.testSets || [];
      }
    }

    setTestSets(sets);
    return sets;
  };

  const loadQuestions = async (testSetId) => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest(
        `/questions?test_set_id=${testSetId}`
      );

      setQuestions(data.questions || []);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const openCategory = async (category) => {
    setSelectedCategory(category);
    setSelectedSubject(null);
    setSelectedTopic(null);
    setSelectedTestSet(null);

    setSubjects([]);
    setTopics([]);
    setQuestions([]);
    setTestSets([]);

    setShowSubjectForm(false);
    setShowTopicForm(false);
    setShowQuestionForm(false);

    await loadSubjects(category.id);
  };

  const openSubject = async (subject) => {
    setSelectedSubject(subject);
    setSelectedTopic(null);
    setSelectedTestSet(null);

    setTopics([]);
    setQuestions([]);
    setTestSets([]);

    setShowTopicForm(false);
    setShowQuestionForm(false);

    await loadTopics(subject.id);
  };

  const openTopic = async (topic) => {
    setSelectedTopic(topic);
    setSelectedTestSet(null);
    setQuestions([]);
    setShowQuestionForm(false);

    try {
      setLoading(true);
      setError("");

      const sets = await loadTestSets(topic.id);

      if (sets.length > 0) {
        setSelectedTestSet(sets[0]);
        await loadQuestions(sets[0].id);
      } else {
        setQuestions([]);
        setError(
          "Test set could not be created. Please check your backend test-set controller."
        );
      }
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const goToCategories = () => {
    setSelectedCategory(null);
    setSelectedSubject(null);
    setSelectedTopic(null);
    setSelectedTestSet(null);
    setSubjects([]);
    setTopics([]);
    setTestSets([]);
    setQuestions([]);
    setError("");
  };

  const goToSubjects = () => {
    setSelectedSubject(null);
    setSelectedTopic(null);
    setSelectedTestSet(null);
    setTopics([]);
    setQuestions([]);
    setError("");
  };

  const goToTopics = () => {
    setSelectedTopic(null);
    setSelectedTestSet(null);
    setQuestions([]);
    setError("");
  };

  const createCategory = async (e) => {
    e.preventDefault();

    if (!categoryForm.name.trim()) {
      return setError("Please enter category name.");
    }

    try {
      setSaving(true);

      await apiRequest("/categories", {
        method: "POST",
        body: JSON.stringify({
          name: categoryForm.name.trim(),
          description: categoryForm.description.trim(),
        }),
      });

      setCategoryForm({ name: "", description: "" });
      setShowCategoryForm(false);
      showMessage("Category added successfully.");
      await loadCategories();
    } catch (err) {
      handleError(err);
    } finally {
      setSaving(false);
    }
  };

  const createSubject = async (e) => {
    e.preventDefault();

    if (!subjectName.trim()) {
      return setError("Please enter subject name.");
    }

    try {
      setSaving(true);

      await apiRequest("/subjects", {
        method: "POST",
        body: JSON.stringify({
          category_id: selectedCategory.id,
          name: subjectName.trim(),
        }),
      });

      setSubjectName("");
      setShowSubjectForm(false);
      showMessage("Subject added successfully.");
      await loadSubjects(selectedCategory.id);
    } catch (err) {
      handleError(err);
    } finally {
      setSaving(false);
    }
  };

  const createTopic = async (e) => {
    e.preventDefault();

    if (!topicName.trim()) {
      return setError("Please enter topic name.");
    }

    try {
      setSaving(true);

      await apiRequest("/topics", {
        method: "POST",
        body: JSON.stringify({
          subject_id: selectedSubject.id,
          name: topicName.trim(),
        }),
      });

      setTopicName("");
      setShowTopicForm(false);
      showMessage("Topic added successfully.");
      await loadTopics(selectedSubject.id);
    } catch (err) {
      handleError(err);
    } finally {
      setSaving(false);
    }
  };

  const createQuestion = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "question",
      "option_a",
      "option_b",
      "option_c",
      "option_d",
    ];

    const missingField = requiredFields.some(
      (field) => !questionForm[field].trim()
    );

    if (missingField) {
      return setError(
        "Please fill the question and all four options."
      );
    }

    if (!selectedTestSet?.id) {
      return setError("Test set not found for this topic.");
    }

    try {
      setSaving(true);

      await apiRequest("/questions", {
        method: "POST",
        body: JSON.stringify({
          ...questionForm,
          test_set_id: selectedTestSet.id,
          marks: Number(questionForm.marks),
        }),
      });

      setQuestionForm(EMPTY_QUESTION);
      setShowQuestionForm(false);
      showMessage("MCQ question added successfully.");
      await loadQuestions(selectedTestSet.id);
    } catch (err) {
      handleError(err);
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (endpoint, itemName, reload) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this ${itemName}?`
    );

    if (!confirmed) return;

    try {
      setSaving(true);

      await apiRequest(endpoint, {
        method: "DELETE",
      });

      showMessage(`${itemName} deleted successfully.`);
      await reload();
    } catch (err) {
      handleError(err);
    } finally {
      setSaving(false);
    }
  };

  const filteredQuestions = questions.filter((question) =>
    question.question?.toLowerCase().includes(search.toLowerCase())
  );

  const currentStep = selectedTopic
    ? "questions"
    : selectedSubject
    ? "topics"
    : selectedCategory
    ? "subjects"
    : "categories";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
              <ClipboardList size={17} />
              GetNotes Admin Panel
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Mock Test Management
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage categories, subjects, topics and MCQ questions.
            </p>
          </div>

          <button
            onClick={() => {
              if (selectedTopic) openTopic(selectedTopic);
              else if (selectedSubject) openSubject(selectedSubject);
              else if (selectedCategory) openCategory(selectedCategory);
              else loadCategories();
            }}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            <span>{error}</span>

            <button
              onClick={() => setError("")}
              className="ml-auto"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
            <CheckCircle2 size={18} />
            {success}
          </div>
        )}

        {/* Breadcrumbs */}
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
          <button
            onClick={goToCategories}
            className={
              !selectedCategory
                ? "font-bold text-blue-600"
                : "text-slate-500 hover:text-blue-600"
            }
          >
            Categories
          </button>

          {selectedCategory && (
            <>
              <ChevronRight size={15} className="text-slate-400" />

              <button
                onClick={goToSubjects}
                className={
                  !selectedSubject
                    ? "font-bold text-blue-600"
                    : "text-slate-500 hover:text-blue-600"
                }
              >
                {selectedCategory.name}
              </button>
            </>
          )}

          {selectedSubject && (
            <>
              <ChevronRight size={15} className="text-slate-400" />

              <button
                onClick={goToTopics}
                className={
                  !selectedTopic
                    ? "font-bold text-blue-600"
                    : "text-slate-500 hover:text-blue-600"
                }
              >
                {selectedSubject.name}
              </button>
            </>
          )}

          {selectedTopic && (
            <>
              <ChevronRight size={15} className="text-slate-400" />

              <span className="font-bold text-blue-600">
                {selectedTopic.name}
              </span>
            </>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="mb-5 flex items-center gap-2 text-sm text-blue-600">
            <Loader2 size={17} className="animate-spin" />
            Loading data...
          </div>
        )}

        {/* Categories */}
        {currentStep === "categories" && (
          <section>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Exam Categories
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Create and manage classes and competitive exams.
                </p>
              </div>

              <button
                onClick={() =>
                  setShowCategoryForm(!showCategoryForm)
                }
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                <Plus size={17} />
                Add Category
              </button>
            </div>

            {showCategoryForm && (
              <form
                onSubmit={createCategory}
                className="mb-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2"
              >
                <input
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      name: e.target.value,
                    })
                  }
                  placeholder="Category name (e.g. Class 10)"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <input
                  value={categoryForm.description}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Description (optional)"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <div className="flex gap-2 sm:col-span-2">
                  <button
                    disabled={saving}
                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Category"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCategoryForm(false)}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
                >
                  <button
                    onClick={() => openCategory(category)}
                    className="w-full text-left"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Layers3 size={23} />
                    </div>

                    <h3 className="mt-4 pr-8 text-lg font-bold text-slate-900">
                      {category.name}
                    </h3>

                    <p className="mt-1 min-h-10 line-clamp-2 text-sm text-slate-500">
                      {category.description ||
                        "Manage subjects and topics"}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-semibold text-blue-600">
                      Manage Category
                      <ChevronRight size={18} />
                    </div>
                  </button>

                  <button
                    title="Delete category"
                    onClick={() =>
                      deleteItem(
                        `/categories/${category.id}`,
                        "category",
                        loadCategories
                      )
                    }
                    className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>

            {!loading && categories.length === 0 && (
              <EmptyState
                title="No categories found"
                description="Add your first exam category to get started."
              />
            )}
          </section>
        )}

        {/* Subjects */}
        {currentStep === "subjects" && (
          <section>
            <SectionHeader
              title={`${selectedCategory.name} Subjects`}
              description="Select a subject to manage its topics."
              buttonText="Add Subject"
              onAdd={() => setShowSubjectForm(!showSubjectForm)}
            />

            {showSubjectForm && (
              <form
                onSubmit={createSubject}
                className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row"
              >
                <input
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="Enter subject name (e.g. Mathematics)"
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Subject"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowSubjectForm(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              </form>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {subjects.map((subject) => (
                <div
                  key={subject.id}
                  className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-purple-300 hover:shadow-md"
                >
                  <button
                    onClick={() => openSubject(subject)}
                    className="w-full text-left"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                      <BookOpen size={23} />
                    </div>

                    <h3 className="mt-4 pr-8 text-lg font-bold text-slate-900">
                      {subject.name}
                    </h3>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-semibold text-purple-600">
                      Manage Topics
                      <ChevronRight size={18} />
                    </div>
                  </button>

                  <button
                    title="Delete subject"
                    onClick={() =>
                      deleteItem(
                        `/subjects/${subject.id}`,
                        "subject",
                        () => loadSubjects(selectedCategory.id)
                      )
                    }
                    className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>

            {!loading && subjects.length === 0 && (
              <EmptyState
                title="No subjects found"
                description="Add a subject to this category."
              />
            )}
          </section>
        )}

        {/* Topics */}
        {currentStep === "topics" && (
          <section>
            <SectionHeader
              title={`${selectedSubject.name} Topics`}
              description="Select a topic to add and manage MCQ questions."
              buttonText="Add Topic"
              onAdd={() => setShowTopicForm(!showTopicForm)}
            />

            {showTopicForm && (
              <form
                onSubmit={createTopic}
                className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row"
              >
                <input
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  placeholder="Enter topic name (e.g. Algebra)"
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Topic"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowTopicForm(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              </form>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topics.map((topic) => (
                <div
                  key={topic.id}
                  className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
                >
                  <button
                    onClick={() => openTopic(topic)}
                    className="w-full text-left"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <FolderOpen size={23} />
                    </div>

                    <h3 className="mt-4 pr-8 text-lg font-bold text-slate-900">
                      {topic.name}
                    </h3>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-semibold text-emerald-600">
                      Manage MCQs
                      <ChevronRight size={18} />
                    </div>
                  </button>

                  <button
                    title="Delete topic"
                    onClick={() =>
                      deleteItem(
                        `/topics/${topic.id}`,
                        "topic",
                        () => loadTopics(selectedSubject.id)
                      )
                    }
                    className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>

            {!loading && topics.length === 0 && (
              <EmptyState
                title="No topics found"
                description="Add a topic to start adding MCQ questions."
              />
            )}
          </section>
        )}

        {/* Questions */}
        {currentStep === "questions" && (
          <section>
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {selectedTopic.name} - MCQ Questions
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add questions that students will see in their mock test.
                </p>
              </div>

              <button
                onClick={() =>
                  setShowQuestionForm(!showQuestionForm)
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                <Plus size={17} />
                Add MCQ
              </button>
            </div>

            {/* Test Settings */}
            <div className="mb-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-3">
              <div className="flex items-center gap-3">
                <Clock3 className="text-blue-600" size={20} />

                <div>
                  <p className="text-xs text-slate-500">Duration</p>
                  <p className="font-semibold text-slate-900">
                    {selectedTestSet?.duration || 30} minutes
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500">Difficulty</p>
                <p className="font-semibold text-slate-900">
                  {selectedTestSet?.difficulty || "Medium"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Questions Added</p>
                <p className="font-semibold text-slate-900">
                  {questions.length}
                </p>
              </div>
            </div>

            {/* Question Form */}
            {showQuestionForm && (
              <form
                onSubmit={createQuestion}
                className="mb-7 space-y-5 rounded-2xl border border-blue-200 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Add New MCQ
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Fill in the question, options and correct answer.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowQuestionForm(false)}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100"
                  >
                    <X size={19} />
                  </button>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Question
                  </label>

                  <textarea
                    rows={3}
                    value={questionForm.question}
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        question: e.target.value,
                      })
                    }
                    placeholder="Enter your question..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {["a", "b", "c", "d"].map((letter) => (
                    <div key={letter}>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Option {letter.toUpperCase()}
                      </label>

                      <input
                        value={questionForm[`option_${letter}`]}
                        onChange={(e) =>
                          setQuestionForm({
                            ...questionForm,
                            [`option_${letter}`]: e.target.value,
                          })
                        }
                        placeholder={`Enter option ${letter.toUpperCase()}`}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Correct Answer
                    </label>

                    <select
                      value={questionForm.correct_answer}
                      onChange={(e) =>
                        setQuestionForm({
                          ...questionForm,
                          correct_answer: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="A">Option A</option>
                      <option value="B">Option B</option>
                      <option value="C">Option C</option>
                      <option value="D">Option D</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Marks
                    </label>

                    <input
                      type="number"
                      min="1"
                      value={questionForm.marks}
                      onChange={(e) =>
                        setQuestionForm({
                          ...questionForm,
                          marks: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Explanation
                  </label>

                  <textarea
                    rows={3}
                    value={questionForm.explanation}
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        explanation: e.target.value,
                      })
                    }
                    placeholder="Explain why this answer is correct..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 size={17} className="animate-spin" />
                    ) : (
                      <Plus size={17} />
                    )}

                    Save Question
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setQuestionForm(EMPTY_QUESTION);
                      setShowQuestionForm(false);
                    }}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Search */}
            <div className="relative mb-5 max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Question List */}
            <div className="space-y-4">
              {filteredQuestions.map((question, index) => (
                <div
                  key={question.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600">
                        {index + 1}
                      </span>

                      <div className="min-w-0">
                        <h3 className="font-semibold leading-6 text-slate-900">
                          {question.question}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          {question.marks || 1} mark
                        </p>
                      </div>
                    </div>

                    <button
                      title="Delete question"
                      onClick={() =>
                        deleteItem(
                          `/questions/${question.id}`,
                          "question",
                          () => loadQuestions(selectedTestSet.id)
                        )
                      }
                      className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {["a", "b", "c", "d"].map((letter) => {
                      const key = letter.toUpperCase();
                      const isCorrect =
                        question.correct_answer === key;

                      return (
                        <div
                          key={letter}
                          className={`flex items-center gap-3 rounded-xl border p-3 text-sm ${
                            isCorrect
                              ? "border-green-300 bg-green-50 text-green-800"
                              : "border-slate-200 bg-white text-slate-600"
                          }`}
                        >
                          <span className="font-bold">{key}.</span>

                          <span className="min-w-0 flex-1">
                            {question[`option_${letter}`]}
                          </span>

                          {isCorrect && (
                            <CheckCircle2
                              size={17}
                              className="shrink-0"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {question.explanation && (
                    <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
                      <p className="mb-1 font-bold">Explanation</p>
                      {question.explanation}
                    </div>
                  )}
                </div>
              ))}

              {!loading && filteredQuestions.length === 0 && (
                <EmptyState
                  title="No questions found"
                  description={
                    search
                      ? "Try another search term."
                      : "Add your first MCQ question for this topic."
                  }
                />
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  description,
  buttonText,
  onAdd,
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          {title}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>

      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
      >
        <Plus size={17} />
        {buttonText}
      </button>
    </div>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
      <CircleHelp
        size={35}
        className="mx-auto text-slate-400"
      />

      <h3 className="mt-3 font-bold text-slate-800">
        {title}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}
