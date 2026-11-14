import { useEffect, useMemo, useState } from "react";

import {
  Search,
  RefreshCw,
  FileText,
  Pin,
  CheckCircle2,
  Clock3,
  Paperclip,
  Trash2,
  Eye,
  X,
  CalendarDays,
  UserRound,
  BookOpen,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

const SERVER_URL = (
  import.meta.env.VITE_SERVER_URL || "http://localhost:5000"
).replace(/\/$/, "");

const PAGE_SIZE = 10;

function formatDate(date) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",

    month: "short",

    year: "numeric",
  });
}

function StatCard({ title, value, icon: Icon, color, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <h3 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            {value ?? 0}
          </h3>

          <p className="mt-1 text-xs text-slate-400">{description}</p>
        </div>

        <div className={`rounded-xl p-3 ${color}`}>
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ completed }) {
  return completed ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
      <CheckCircle2 size={13} />
      Completed
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
      <Clock3 size={13} />
      Pending
    </span>
  );
}

function NoteDetails({ note, onClose }) {
  if (!note) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Note details
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900">View note</h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <div>
            <h3 className="break-words text-xl font-bold text-slate-900">
              {note.title}
            </h3>

            <div className="mt-3 flex flex-wrap gap-2">
              <StatusBadge completed={note.isCompleted} />

              {note.isPinned && (
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                  <Pin size={12} /> Pinned
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <UserRound className="shrink-0 text-slate-400" size={18} />

              <div className="min-w-0">
                <p className="text-xs text-slate-400">Student</p>

                <p className="break-all text-sm font-semibold text-slate-800">
                  {note.studentName}
                </p>

                <p className="break-all text-xs text-slate-500">
                  {note.studentEmail || "No email"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <BookOpen className="shrink-0 text-slate-400" size={18} />

              <div>
                <p className="text-xs text-slate-400">Subject</p>

                <p className="text-sm font-semibold text-slate-800">
                  {note.subjectName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CalendarDays className="shrink-0 text-slate-400" size={18} />

              <div>
                <p className="text-xs text-slate-400">Created</p>

                <p className="text-sm font-semibold text-slate-800">
                  {formatDate(note.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock3 className="shrink-0 text-slate-400" size={18} />

              <div>
                <p className="text-xs text-slate-400">Due date</p>

                <p className="text-sm font-semibold text-slate-800">
                  {formatDate(note.dueDate)}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-bold text-slate-800">
              Note content
            </h4>

            <div className="min-h-32 whitespace-pre-wrap break-words rounded-xl border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-600">
              {note.content || "No content available."}
            </div>
          </div>

          {note.filePath && (
            <div className="flex items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
              <Paperclip className="shrink-0 text-indigo-600" size={20} />

              <div className="min-w-0 flex-1">
                <p className="text-xs text-indigo-600">Attachment</p>

                <p className="break-all text-sm font-semibold text-slate-800">
                  {note.fileName || "Attached file"}
                </p>
              </div>
            </div>
          )}

          <p className="text-xs text-slate-400">
            Note ID: #{note.id} · Student ID: #{note.userId}
          </p>
        </div>
      </div>
    </div>
  );
}

function AdminNotes() {
  const [notes, setNotes] = useState([]);

  const [stats, setStats] = useState({});

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [subjectFilter, setSubjectFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);

  const [selectedNote, setSelectedNote] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [deletingId, setDeletingId] = useState(null);

  const [notice, setNotice] = useState("");

  const getToken = () => {
    return localStorage.getItem("getnotesAdminToken");
  };

  const fetchNotes = async () => {
    setLoading(true);

    setError("");

    try {
      const token = getToken();

      if (!token) {
        throw new Error("Admin token not found. Please login again.");
      }

      const response = await fetch(`${SERVER_URL}/api/admin/notes`, {
        method: "GET",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch notes");
      }

      setNotes(data.notes || []);

      setStats(data.stats || {});
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const subjects = useMemo(() => {
    return [
      ...new Set(notes.map((note) => note.subjectName).filter(Boolean)),
    ].sort();
  }, [notes]);

  const filteredNotes = useMemo(() => {
    const term = search.trim().toLowerCase();

    return notes.filter((note) => {
      const matchesSearch =
        !term ||
        [
          note.title,

          note.content,

          note.studentName,

          note.studentEmail,

          note.subjectName,

          String(note.id),
        ]

          .filter(Boolean)

          .some((value) => String(value).toLowerCase().includes(term));

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "completed" && note.isCompleted) ||
        (statusFilter === "pending" && !note.isCompleted) ||
        (statusFilter === "pinned" && note.isPinned) ||
        (statusFilter === "attachments" && note.filePath);

      const matchesSubject =
        subjectFilter === "all" || note.subjectName === subjectFilter;

      return matchesSearch && matchesStatus && matchesSubject;
    });
  }, [notes, search, statusFilter, subjectFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredNotes.length / PAGE_SIZE));

  const paginatedNotes = filteredNotes.slice(
    (currentPage - 1) * PAGE_SIZE,

    currentPage * PAGE_SIZE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, subjectFilter]);

  const handleDelete = async (note) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${note.title}"?`,
    );

    if (!confirmed) return;

    setDeletingId(note.id);

    setNotice("");

    try {
      const token = getToken();

      const response = await fetch(
        `${SERVER_URL}/api/admin/notes/${note.id}`,

        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to delete note");
      }

      setNotes((previous) => previous.filter((item) => item.id !== note.id));

      setStats((previous) => ({
        ...previous,

        totalNotes: Math.max(0, (previous.totalNotes || 0) - 1),

        pinnedNotes: Math.max(
          0,

          (previous.pinnedNotes || 0) - (note.isPinned ? 1 : 0),
        ),

        completedNotes: Math.max(
          0,

          (previous.completedNotes || 0) - (note.isCompleted ? 1 : 0),
        ),

        pendingNotes: Math.max(
          0,

          (previous.pendingNotes || 0) - (!note.isCompleted ? 1 : 0),
        ),

        attachmentNotes: Math.max(
          0,

          (previous.attachmentNotes || 0) - (note.filePath ? 1 : 0),
        ),
      }));

      if (selectedNote?.id === note.id) {
        setSelectedNote(null);
      }

      setNotice("Note deleted successfully.");
    } catch (err) {
      setError(err.message || "Unable to delete note");
    } finally {
      setDeletingId(null);
    }
  };

  const clearFilters = () => {
    setSearch("");

    setStatusFilter("all");

    setSubjectFilter("all");

    setCurrentPage(1);
  };

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* Header */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Admin</span>

            <span>/</span>

            <span className="font-semibold text-indigo-600">Notes</span>
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Notes Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage and monitor all student notes from one place.
          </p>
        </div>

        <button
          onClick={fetchNotes}
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60 sm:w-auto"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          title="Total Notes"
          value={stats.totalNotes}
          icon={FileText}
          color="bg-indigo-50 text-indigo-600"
          description="All student notes"
        />

        <StatCard
          title="Attachments"
          value={stats.attachmentNotes}
          icon={Paperclip}
          color="bg-sky-50 text-sky-600"
          description="Notes with files"
        />
      </div>

      {/* Notification */}

      {notice && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <span>{notice}</span>

          <button onClick={() => setNotice("")}>
            <X size={17} />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 shrink-0" size={18} />

          <div className="min-w-0 flex-1">
            <p className="font-semibold">Unable to load notes</p>

            <p className="mt-1 break-words">{error}</p>

            <button
              onClick={fetchNotes}
              className="mt-2 font-semibold underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Filters */}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          <Filter size={17} className="text-indigo-600" />

          <h2 className="font-bold text-slate-800">Search and filters</h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_190px_190px_auto]">
          <div className="relative min-w-0 sm:col-span-2 xl:col-span-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, student, email..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-indigo-400"
          >
            <option value="all">All notes</option>

            <option value="attachments">With attachments</option>
          </select>

          <button
            onClick={clearFilters}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Clear filters
          </button>
        </div>

        <p className="mt-3 text-xs text-slate-400">
          Showing {filteredNotes.length} of {notes.length} notes
        </p>
      </div>

      {/* Notes list */}

      <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-1 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="font-bold text-slate-900">All Notes</h2>

            <p className="text-xs text-slate-500">
              Student notes and their details
            </p>
          </div>

          <span className="text-xs font-medium text-slate-500">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        {loading ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-slate-500">
            <RefreshCw size={25} className="animate-spin text-indigo-600" />

            <p className="text-sm">Loading notes...</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
            <div className="rounded-2xl bg-slate-100 p-4">
              <FileText size={30} className="text-slate-400" />
            </div>

            <h3 className="mt-4 font-bold text-slate-800">No notes found</h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filters.
            </p>

            <button
              onClick={clearFilters}
              className="mt-4 text-sm font-semibold text-indigo-600 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            {/* Desktop table */}

            <div className="hidden max-h-[70vh] overflow-x-auto overflow-y-auto lg:block">
              <table className="w-full table-fixed text-left">
                <thead className="sticky top-0 z-10 bg-slate-50">
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="w-[42%] px-5 py-4 font-semibold">Note</th>

                    <th className="w-[30%] px-5 py-4 font-semibold">Student</th>

                    <th className="w-[18%] px-5 py-4 font-semibold">Created</th>

                    <th className="px-5 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {paginatedNotes.map((note) => (
                    <tr
                      key={note.id}
                      className="transition hover:bg-slate-50/80"
                    >
                      <td className="max-w-[260px] px-5 py-4">
                        <div className="flex items-start gap-3">
                          <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                            <FileText size={19} />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-800">
                              {note.title}
                            </p>

                            <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                              {note.content || "No description"}
                            </p>

                            <div className="mt-1 flex flex-wrap gap-2">
                              {note.isPinned && (
                                <span className="text-[11px] font-semibold text-indigo-600">
                                  <Pin size={11} className="mr-1 inline" />
                                  Pinned
                                </span>
                              )}

                              {note.filePath && (
                                <span className="text-[11px] text-sky-600">
                                  <Paperclip
                                    size={11}
                                    className="mr-1 inline"
                                  />
                                  Attachment
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-800">
                          {note.studentName}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {note.studentEmail || "—"}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                        {formatDate(note.createdAt)}
                      </td>

                      <td className="w-[10%] px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedNote(note)}
                            title="View note"
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            onClick={() => handleDelete(note)}
                            disabled={deletingId === note.id}
                            title="Delete note"
                            className="rounded-lg border border-slate-200 p-2 text-red-500 hover:border-red-200 hover:bg-red-50 disabled:opacity-50"
                          >
                            {deletingId === note.id ? (
                              <RefreshCw size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile and tablet cards */}

            <div className="grid max-h-[70vh] grid-cols-1 gap-3 overflow-y-auto bg-slate-50/60 p-3 sm:grid-cols-2 lg:hidden">
              {paginatedNotes.map((note) => (
                <div
                  key={note.id}
                  className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                        <FileText size={19} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="break-words text-sm font-bold text-slate-900">
                          {note.title}
                        </h3>

                        <p className="mt-1 text-xs text-slate-400">
                          Note #{note.id}
                        </p>
                      </div>
                    </div>

                    {note.isPinned && (
                      <Pin size={16} className="shrink-0 text-indigo-600" />
                    )}
                  </div>

                  <p className="mt-3 line-clamp-2 break-words text-xs leading-5 text-slate-500">
                    {note.content || "No content available."}
                  </p>

                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <UserRound
                        size={14}
                        className="shrink-0 text-slate-400"
                      />

                      <span className="break-all font-medium">
                        {note.studentName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <CalendarDays
                        size={14}
                        className="shrink-0 text-slate-400"
                      />

                      <span>{formatDate(note.createdAt)}</span>
                    </div>
                  </div>

                  {note.filePath && (
                    <div className="mt-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
                        <Paperclip size={13} /> Attachment
                      </span>
                    </div>
                  )}

                  <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                    <button
                      onClick={() => setSelectedNote(note)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-50 px-3 py-2.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
                    >
                      <Eye size={15} /> View details
                    </button>

                    <button
                      onClick={() => handleDelete(note)}
                      disabled={deletingId === note.id}
                      className="rounded-lg border border-red-100 px-3 py-2.5 text-red-500 hover:bg-red-50 disabled:opacity-50"
                    >
                      {deletingId === note.id ? (
                        <RefreshCw size={15} className="animate-spin" />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}

            <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-center text-xs text-slate-500 sm:text-left">
                Showing{" "}
                {filteredNotes.length === 0
                  ? 0
                  : (currentPage - 1) * PAGE_SIZE + 1}
                {" – "}
                {Math.min(
                  currentPage * PAGE_SIZE,
                  filteredNotes.length,
                )} of {filteredNotes.length} notes
              </p>

              <div className="flex items-center justify-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={17} />
                </button>

                <span className="min-w-20 text-center text-sm font-semibold text-slate-700">
                  {currentPage} / {totalPages}
                </span>

                <button
                  disabled={currentPage >= totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <NoteDetails note={selectedNote} onClose={() => setSelectedNote(null)} />
    </div>
  );
}

export default AdminNotes;
