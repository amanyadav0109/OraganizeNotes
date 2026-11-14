

import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  Bot,
  Crown,
  Users,
  RefreshCw,
  Search,
  AlertCircle,
  CheckCircle2,
  Zap,
  Sparkles,
} from "lucide-react";

const API_URL = import.meta.env.VITE_SERVER_URL;

const formatDate = (date) => {
  if (!date) return "No usage yet";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
    green: "bg-green-50 text-green-600",
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">{title}</p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {value}
          </h2>
        </div>

        <div className={`shrink-0 rounded-xl p-3 ${colors[color]}`}>
          <Icon size={22} />
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-gray-500 sm:text-sm">
        {subtitle}
      </p>
    </div>
  );
}

export default function AdminAIUsage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchAIUsage = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("getnotesAdminToken");

      if (!token) {
        throw new Error("Admin token not found. Please login again.");
      }

      const response = await fetch(`${API_URL}/api/admin/ai-usage`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to fetch AI usage");
      }

      setData(result);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAIUsage();
  }, [fetchAIUsage]);

  const summary = data?.summary;

  const users = (data?.users || []).filter((user) => {
    const searchMatch =
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase());

    const filterMatch =
      filter === "all" || user.effectivePlan === filter;

    return searchMatch && filterMatch;
  });

  if (loading && !data) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center bg-white">
        <div className="text-center">
          <RefreshCw
            className="mx-auto animate-spin text-blue-600"
            size={32}
          />
          <p className="mt-3 text-sm font-medium text-gray-500">
            Loading AI usage...
          </p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-red-50 p-3 text-red-600">
            <AlertCircle size={24} />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">
              Unable to load AI usage
            </h2>

            <p className="mt-1 text-sm text-gray-500">{error}</p>

            <button
              onClick={fetchAIUsage}
              className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full space-y-5 bg-gray-50/50 pb-6 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              AI Usage
            </h1>

            <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
              AI Analytics
            </span>
          </div>

          <p className="mt-1.5 text-sm text-gray-500">
            Monitor AI requests, free plan limits and student activity.
          </p>
        </div>

        <button
          onClick={fetchAIUsage}
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-60 sm:w-auto"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh Data
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Free AI Requests Today"
          value={summary?.freeRequestsToday ?? 0}
          subtitle="Successful Free plan AI generations"
          icon={Activity}
          color="blue"
        />

        <StatCard
          title="Active Free Users"
          value={summary?.freeUsersUsedToday ?? 0}
          subtitle="Free users who used AI today"
          icon={Users}
          color="purple"
        />

        <StatCard
          title="Users At Daily Limit"
          value={summary?.freeUsersAtLimit ?? 0}
          subtitle={`Reached ${summary?.dailyFreeLimit ?? 10} requests today`}
          icon={Zap}
          color="orange"
        />

        <StatCard
          title="Premium Users"
          value={summary?.premiumUsers ?? 0}
          subtitle="Users identified as Premium"
          icon={Crown}
          color="green"
        />
      </div>

      {/* Daily Limit Information */}
      <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Sparkles size={24} />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-gray-900">
              Daily Free AI Limit
            </h3>

            <p className="mt-1 text-sm leading-relaxed text-gray-500">
              Each Free user can generate AI content up to{" "}
              <span className="font-semibold text-gray-900">
                {summary?.dailyFreeLimit ?? 10} requests per day.
              </span>{" "}
              The counter resets according to UTC date.
            </p>
          </div>

          <div className="shrink-0 rounded-xl bg-blue-50 px-4 py-3 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {summary?.dailyFreeLimit ?? 10}
            </p>
            <p className="text-xs font-medium text-blue-600">
              Requests / Day
            </p>
          </div>
        </div>

        <div className="mt-4 border-t border-gray-100 pt-3">
          <p className="text-xs leading-relaxed text-gray-400">
            Only successful Free plan generations are currently tracked.
            Premium AI requests are not individually recorded.
          </p>
        </div>
      </div>

      {/* Users Section */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Table Header */}
        <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              User-wise AI Usage
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Track individual student AI consumption.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <div className="relative w-full sm:flex-1 lg:w-64">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or email..."
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 sm:w-36"
            >
              <option value="all">All Plans</option>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-gray-50">
              <tr className="text-xs uppercase tracking-wide text-gray-500">
                <th className="px-5 py-4 font-semibold">Student</th>
                <th className="px-5 py-4 font-semibold">Plan</th>
                <th className="px-5 py-4 font-semibold">Requests Today</th>
                <th className="px-5 py-4 font-semibold">Daily Usage</th>
                <th className="px-5 py-4 font-semibold">Usage Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {users.map((user) => {
                const used = Number(user.usedToday || 0);
                const limit = Number(summary?.dailyFreeLimit || 10);
                const isPremium = user.effectivePlan === "premium";
                const percentage = Math.min((used / limit) * 100, 100);

                return (
                  <tr
                    key={user.userId}
                    className="transition hover:bg-gray-50/80"
                  >
                    <td className="px-5 py-4">
                      <p className="whitespace-nowrap text-sm font-semibold text-gray-900">
                        {user.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {user.email}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                          isPremium
                            ? "bg-amber-50 text-amber-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {isPremium && <Crown size={13} />}
                        {isPremium ? "Premium" : "Free"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {isPremium ? (
                        <span className="text-xs font-medium text-gray-400">
                          Not tracked
                        </span>
                      ) : (
                        <span className="text-sm font-bold text-gray-900">
                          {used}
                          <span className="font-normal text-gray-400">
                            {" "}/ {limit}
                          </span>
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {isPremium ? (
                        <span className="text-xs text-gray-400">
                          Not available
                        </span>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className={`h-full rounded-full transition-all ${
                                used >= limit
                                  ? "bg-orange-500"
                                  : "bg-blue-500"
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>

                          <span className="text-xs font-medium text-gray-500">
                            {Math.round(percentage)}%
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                      {formatDate(user.usageDate)}
                    </td>
                  </tr>
                );
              })}

              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                      <Search size={22} />
                    </div>

                    <p className="mt-3 text-sm font-semibold text-gray-700">
                      No users found
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Try changing your search or filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="flex flex-col gap-2 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-xs text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {users.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">
              {data?.users?.length || 0}
            </span>{" "}
            users
          </p>

          <p className="text-xs text-gray-400">
            Updated when you refresh the page
          </p>
        </div>
      </div>
    </div>
  );
}
