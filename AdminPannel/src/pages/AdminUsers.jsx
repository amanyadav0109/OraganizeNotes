
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  Crown,
  UserCheck,
  RefreshCw,
  CalendarDays,
  Mail,
  X,
  Filter,
  GraduationCap,
  ChevronDown,
} from "lucide-react";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("getnotesAdminToken");

      if (!token) {
        window.location.href = "/admin/login";
        return;
      }

      const response = await fetch(`${SERVER_URL}/api/admin/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("getnotesAdminToken");
        localStorage.removeItem("getnotesAdmin");
        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to fetch students");
      }

      setUsers(data.users || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Search and filter
  const filteredUsers = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchText) ||
        user.email?.toLowerCase().includes(searchText);

      const matchesPlan =
        planFilter === "all" ||
        user.plan?.toLowerCase() === planFilter;

      return matchesSearch && matchesPlan;
    });
  }, [users, search, planFilter]);

  // Statistics
  const premiumCount = users.filter(
    (user) => user.plan?.toLowerCase() === "premium"
  ).length;

  const freeCount = users.length - premiumCount;

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const clearFilters = () => {
    setSearch("");
    setPlanFilter("all");
  };

  const getInitial = (name) => {
    return name?.trim()?.charAt(0)?.toUpperCase() || "S";
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-slate-500 sm:text-sm">
            {title}
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            {value}
          </h2>
        </div>

        <div className={`shrink-0 rounded-xl p-3 ${color}`}>
          <Icon size={21} />
        </div>
      </div>
    </div>
  );

  const PlanBadge = ({ plan }) => {
    const isPremium = plan?.toLowerCase() === "premium";

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
          isPremium
            ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
            : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
        }`}
      >
        {isPremium && <Crown size={12} />}
        {plan || "free"}
      </span>
    );
  };

  const StatusBadge = ({ status }) => (
    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      {status || "Active"}
    </span>
  );

  const UserAvatar = ({ user, size = "h-11 w-11" }) => (
    <div
      className={`${size} flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-sm font-bold text-blue-700`}
    >
      {user.profilePic ? (
        <img
          src={user.profilePic}
          alt={user.name || "Student"}
          className="h-full w-full object-cover"
        />
      ) : (
        getInitial(user.name)
      )}
    </div>
  );

  return (
    <div className="w-full min-w-0 space-y-5 pb-6 sm:space-y-6">

      {/* PAGE HEADER */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-blue-100 p-2 text-blue-700">
              <GraduationCap size={22} />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
                Students
              </h1>
              <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                Manage and view all registered students.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh Data
        </button>
      </section>

      {/* STATISTICS */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        <StatCard
          title="Total Students"
          value={users.length}
          icon={Users}
          color="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Free Students"
          value={freeCount}
          icon={UserCheck}
          color="bg-slate-100 text-slate-600"
        />

        <div className="col-span-2 sm:col-span-1">
          <StatCard
            title="Premium Students"
            value={premiumCount}
            icon={Crown}
            color="bg-amber-50 text-amber-600"
          />
        </div>
      </section>

      {/* SEARCH AND FILTER */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          <Filter size={17} className="text-blue-600" />
          <h2 className="text-sm font-bold text-slate-800 sm:text-base">
            Search and Filter Users
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_200px_auto]">
          {/* Search */}
          <div className="relative min-w-0">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student name or email..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                aria-label="Clear search"
              >
                <X size={17} />
              </button>
            )}
          </div>

          {/* Plan Filter */}
          <div className="relative">
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">All Plans</option>
              <option value="free">Free Students</option>
              <option value="premium">Premium Students</option>
            </select>

            <ChevronDown
              size={17}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>

          {/* Clear */}
          <button
            onClick={clearFilters}
            disabled={!search && planFilter === "all"}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <X size={16} />
            Clear Filters
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <p className="text-xs text-slate-500 sm:text-sm">
            Showing{" "}
            <span className="font-bold text-slate-800">
              {filteredUsers.length}
            </span>{" "}
            of{" "}
            <span className="font-bold text-slate-800">
              {users.length}
            </span>{" "}
            students
          </p>

          {planFilter !== "all" && (
            <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold capitalize text-blue-700">
              {planFilter} filter applied
            </span>
          )}
        </div>
      </section>

      {/* ERROR */}
      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="break-words text-sm text-red-700">{error}</p>

          <button
            onClick={fetchUsers}
            className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 sm:w-auto"
          >
            Try Again
          </button>
        </div>
      )}

      {/* USERS LIST */}
      <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* List Header */}
        <div className="flex flex-col gap-2 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="font-bold text-slate-900">
              All Students
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Registered student information
            </p>
          </div>

          <span className="w-fit rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
            {filteredUsers.length} Records
          </span>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-4">
            <RefreshCw
              size={28}
              className="animate-spin text-blue-600"
            />
            <p className="mt-3 text-sm font-medium text-slate-500">
              Loading students...
            </p>
          </div>
        ) : !error && filteredUsers.length === 0 ? (
          /* Empty State */
          <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center">
            <div className="rounded-2xl bg-slate-100 p-4">
              <Users size={30} className="text-slate-400" />
            </div>

            <h3 className="mt-4 font-bold text-slate-800">
              No students found
            </h3>

            <p className="mt-1 max-w-xs text-sm text-slate-500">
              Try another search or change the selected plan filter.
            </p>

            <button
              onClick={clearFilters}
              className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Clear all filters
            </button>
          </div>
        ) : !error ? (
          <>
            {/* DESKTOP AND TABLET TABLE */}
            <div className="hidden max-h-[65vh] overflow-auto md:block">
              <table className="w-full min-w-[760px] text-left">
                <thead className="sticky top-0 z-10 bg-slate-50 shadow-sm">
                  <tr>
                    {[
                      "Student",
                      "Email Address",
                      "Plan",
                      "Status",
                      "Registered",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="whitespace-nowrap px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 lg:px-6"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4 lg:px-6">
                        <div className="flex items-center gap-3">
                          <UserAvatar user={user} />

                          <div className="min-w-0">
                            <p className="max-w-[180px] truncate text-sm font-bold text-slate-800">
                              {user.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              ID: #{user.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 lg:px-6">
                        <span className="text-sm text-slate-600">
                          {user.email}
                        </span>
                      </td>

                      <td className="px-5 py-4 lg:px-6">
                        <PlanBadge plan={user.plan} />
                      </td>

                      <td className="px-5 py-4 lg:px-6">
                        <StatusBadge status={user.status} />
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500 lg:px-6">
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE STUDENT CARDS */}
            <div className="grid max-h-[65vh] grid-cols-1 gap-3 overflow-y-auto p-3 sm:grid-cols-2 md:hidden">
              {filteredUsers.map((user) => (
                <article
                  key={user.id}
                  className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-sm"
                >
                  {/* Student identity */}
                  <div className="flex min-w-0 items-center gap-3">
                    <UserAvatar user={user} size="h-12 w-12" />

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-bold text-slate-900">
                        {user.name}
                      </h3>

                      <p className="mt-0.5 text-xs text-slate-400">
                        Student ID: #{user.id}
                      </p>
                    </div>

                    <StatusBadge status={user.status} />
                  </div>

                  {/* Email */}
                  <div className="mt-4 flex min-w-0 items-start gap-2 border-t border-slate-100 pt-3">
                    <Mail
                      size={15}
                      className="mt-0.5 shrink-0 text-slate-400"
                    />

                    <p className="break-all text-xs text-slate-600">
                      {user.email}
                    </p>
                  </div>

                  {/* Plan and Date */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <PlanBadge plan={user.plan} />

                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <CalendarDays size={14} />
                      {formatDate(user.createdAt)}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : null}

        {/* Footer */}
        {!loading && !error && filteredUsers.length > 0 && (
          <div className="border-t border-slate-100 bg-slate-50 px-4 py-3">
            <p className="text-center text-xs text-slate-500 sm:text-left">
              Displaying {filteredUsers.length} student records
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminUsers;
