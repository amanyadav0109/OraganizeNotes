
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Users,
  FileText,
  ClipboardList,
  IndianRupee,
  Crown,
  BrainCircuit,
  Activity,
  RefreshCw,
  ArrowUpRight,
  TrendingUp,
  CalendarDays,
} from "lucide-react";

import StatCard from "../components/StatCard";

// =====================================================
// MONTHLY REVENUE CANDLESTICK CHART
// =====================================================

function MonthlyRevenueChart({ data = [] }) {
  const chartWidth = 900;
  const chartHeight = 310;

  const maxValue = Math.max(
    1,
    ...data.map((item) => Number(item.high || 0))
  );

  const getY = (value) => {
    return 245 - (Number(value || 0) / maxValue) * 205;
  };

  const formatRupees = (value) => {
    return `₹${Number(value || 0).toLocaleString("en-IN")}`;
  };

  const getMonthLabel = (month) => {
    return new Date(`${month}-01T00:00:00`).toLocaleDateString(
      "en-IN",
      {
        month: "short",
      }
    );
  };

  if (!data.length) {
    return (
      <div className="flex min-h-60 items-center justify-center text-sm text-slate-500">
        No monthly revenue data available.
      </div>
    );
  }

  const hasRevenue = data.some(
    (item) => Number(item.totalRevenue || 0) > 0
  );

  return (
    <div className="mt-5 min-w-0">

      {/* CHART LEGEND */}

      <div className="mb-5 flex flex-wrap items-center gap-4 text-xs text-slate-500">

        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-green-500" />
          Revenue increased
        </span>

        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-red-500" />
          Revenue decreased
        </span>

        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-slate-400" />
          Revenue unchanged
        </span>

      </div>

      {!hasRevenue && (
        <p className="mb-3 text-center text-xs text-slate-400">
          No payments recorded for this year yet.
        </p>
      )}

      {/* SCROLLABLE CHART */}

      <div className="w-full overflow-x-auto">

        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="h-auto min-w-[650px] w-full"
          role="img"
          aria-label="Monthly revenue comparison candlestick chart"
        >

          {/* GRID LINES */}

          {[0, 1, 2, 3, 4].map((index) => {
            const y = 40 + index * 50;

            return (
              <line
                key={index}
                x1="40"
                y1={y}
                x2="875"
                y2={y}
                stroke="#e2e8f0"
                strokeDasharray="4 5"
              />
            );
          })}

          {/* CANDLES */}

          {data.map((item, index) => {

            const x = 70 + index * 68;

            const open = Number(item.open || 0);
            const close = Number(item.close || 0);
            const high = Number(item.high || 0);
            const low = Number(item.low || 0);

            // Colour based on previous month comparison

            const trend =
              item.trend ||
              (close > open
                ? "up"
                : close < open
                ? "down"
                : "same");

            const color =
              trend === "up"
                ? "#16a34a"
                : trend === "down"
                ? "#dc2626"
                : "#94a3b8";

            const openY = getY(open);
            const closeY = getY(close);
            const highY = getY(high);
            const lowY = getY(low);

            const bodyY = Math.min(openY, closeY);

            const bodyHeight = Math.max(
              4,
              Math.abs(closeY - openY)
            );

            const monthLabel = getMonthLabel(item.month);

            const change = Number(item.change || 0);

            return (
              <g key={item.month}>

                {/* HIGH TO LOW LINE */}

                <line
                  x1={x}
                  y1={highY}
                  x2={x}
                  y2={lowY}
                  stroke={color}
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* CANDLE BODY */}

                <rect
                  x={x - 13}
                  y={bodyY}
                  width="26"
                  height={bodyHeight}
                  rx="3"
                  fill={color}
                />

                {/* MONTH LABEL */}

                <text
                  x={x}
                  y="280"
                  textAnchor="middle"
                  fontSize="12"
                  fill="#64748b"
                >
                  {monthLabel}
                </text>

                {/* TOOLTIP */}

                <title>
                  {`${monthLabel}

Monthly Revenue: ${formatRupees(item.totalRevenue)}

Previous Month Revenue: ${formatRupees(open)}

Current Month Revenue: ${formatRupees(close)}

Revenue Change: ${change >= 0 ? "+" : ""}${formatRupees(change)}

Trend: ${trend.toUpperCase()}`}
                </title>

              </g>
            );
          })}

          {/* X AXIS */}

          <line
            x1="40"
            y1="250"
            x2="875"
            y2="250"
            stroke="#cbd5e1"
          />

        </svg>

      </div>

      <p className="mt-3 text-xs leading-5 text-slate-400">
        Each candle compares the selected month's total revenue
        with the previous month's total revenue. Hover over a
        candle to view revenue details.
      </p>

    </div>
  );
}

// =====================================================
// MAIN DASHBOARD
// =====================================================

function Dashboard() {
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();

  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [dashboardData, setDashboardData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("getnotesAdminToken");

      if (!token) {
        navigate("/admin/login", { replace: true });
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/admin/dashboard?year=${selectedYear}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("getnotesAdminToken");
        localStorage.removeItem("getnotesAdmin");

        navigate("/admin/login", { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load dashboard"
        );
      }

      setDashboardData(data);

    } catch (err) {
      console.error("Dashboard Error:", err);
      setError(err.message || "Something went wrong");

    } finally {
      setLoading(false);
    }
  }, [navigate, selectedYear]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // =====================================================
  // DASHBOARD VALUES
  // =====================================================

  const stats = dashboardData
    ? [
        {
          title: "Total Students",
          value: dashboardData.stats.totalStudents,
          change: "Registered student accounts",
          icon: Users,
          color: "bg-blue-100 text-blue-600",
        },
        {
          title: "Total Notes",
          value: dashboardData.stats.totalNotes,
          change: "Notes stored on platform",
          icon: FileText,
          color: "bg-purple-100 text-purple-600",
        },
        {
          title: "Practice Questions",
          value: dashboardData.stats.totalQuestions,
          change: "Available practice questions",
          icon: ClipboardList,
          color: "bg-orange-100 text-orange-600",
        },
        {
          title: "Premium Users",
          value: dashboardData.stats.premiumUsers,
          change: "Users with active subscriptions",
          icon: Crown,
          color: "bg-amber-100 text-amber-600",
        },
        {
          title: "Total Revenue",
          value: `₹${Number(
            dashboardData.stats.totalRevenue || 0
          ).toLocaleString("en-IN")}`,
          change: "Recorded successful payments",
          icon: IndianRupee,
          color: "bg-green-100 text-green-600",
        },
        {
          title: "AI Requests",
          value: dashboardData.stats.aiRequests,
          change: "Today's AI usage",
          icon: BrainCircuit,
          color: "bg-pink-100 text-pink-600",
        },
      ]
    : [];

  const recentUsers = dashboardData?.recentUsers || [];

  const monthlyRevenue = dashboardData?.monthlyRevenue || [];

  const totalStudents = Number(
    dashboardData?.stats?.totalStudents || 0
  );

  const premiumUsers = Number(
    dashboardData?.stats?.premiumUsers || 0
  );

  const totalNotes = Number(
    dashboardData?.stats?.totalNotes || 0
  );

  const practiceAttempts = Number(
    dashboardData?.stats?.practiceAttempts || 0
  );

  const totalRevenue = Number(
    dashboardData?.stats?.totalRevenue || 0
  );

  const premiumPercentage =
    totalStudents > 0
      ? Math.min(
          100,
          Math.round((premiumUsers / totalStudents) * 100)
        )
      : 0;

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-w-0 space-y-5 sm:space-y-7 lg:space-y-8">

      {/* PAGE HEADING */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Dashboard Overview
          </h1>

          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Here's what's happening with your platform.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">

          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-600 sm:px-4 sm:text-sm">
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>

          <button
            onClick={fetchDashboard}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 sm:px-4 sm:text-sm"
          >
            <RefreshCw
              size={15}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

        </div>
      </div>

      {/* LOADING */}

      {loading && (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Loading dashboard data...
        </div>
      )}

      {/* ERROR */}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 sm:p-6">

          <p className="font-semibold text-red-700">
            Failed to load dashboard
          </p>

          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>

          <button
            onClick={fetchDashboard}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Try Again
          </button>

        </div>
      )}

      {/* DASHBOARD CONTENT */}

      {!loading && !error && dashboardData && (
        <>

          {/* STATS CARDS */}

          <section className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3 xl:gap-5">

            {stats.map((stat) => (
              <StatCard
                key={stat.title}
                {...stat}
              />
            ))}

          </section>

          {/* MONTHLY REVENUE CHART */}

          <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">

            {/* CHART HEADER */}

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <div>

                <div className="flex items-center gap-2">

                  <TrendingUp
                    size={20}
                    className="text-green-600"
                  />

                  <h2 className="font-bold text-slate-900">
                    Monthly Revenue
                  </h2>

                </div>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Monthly revenue comparison and growth
                </p>

              </div>

              {/* YEAR SELECTOR */}

              <div className="flex items-center gap-2">

                <CalendarDays
                  size={17}
                  className="text-slate-500"
                />

                <select
                  value={selectedYear}
                  onChange={(e) =>
                    setSelectedYear(Number(e.target.value))
                  }
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-50 sm:w-auto"
                >

                  {Array.from(
                    { length: currentYear - 2019 },
                    (_, i) => currentYear - i
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}

                </select>

              </div>

            </div>

            {/* SELECTED YEAR SUMMARY */}

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-blue-50 p-3 sm:p-4">

              <div>
                <p className="text-xs text-blue-600">
                  Selected Year
                </p>

                <p className="mt-1 text-lg font-bold text-blue-800">
                  {selectedYear}
                </p>
              </div>

              <div>
                <p className="text-right text-xs text-blue-600">
                  Total Revenue (All Time)
                </p>

                <p className="mt-1 text-right text-lg font-bold text-blue-800">
                  ₹{totalRevenue.toLocaleString("en-IN")}
                </p>
              </div>

            </div>

            {/* CHART */}

            <MonthlyRevenueChart data={monthlyRevenue} />

            {/* REVENUE INFORMATION */}

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">

              <div className="rounded-xl bg-green-50 p-3 sm:p-4">

                <p className="text-xs text-slate-500">
                  Total Revenue (All Time)
                </p>

                <p className="mt-1 break-words text-lg font-bold text-green-700 sm:text-xl">
                  ₹{totalRevenue.toLocaleString("en-IN")}
                </p>

              </div>

              <div className="rounded-xl bg-orange-50 p-3 sm:p-4">

                <p className="text-xs text-slate-500">
                  Practice Attempts
                </p>

                <p className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
                  {practiceAttempts}
                </p>

              </div>

              <div className="col-span-2 rounded-xl bg-purple-50 p-3 sm:col-span-1 sm:p-4">

                <p className="text-xs text-slate-500">
                  Practice Questions
                </p>

                <p className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
                  {dashboardData.stats.totalQuestions}
                </p>

              </div>

            </div>

            <p className="mt-4 text-xs leading-5 text-slate-400">
              Revenue includes active subscription amounts and
              successful marketplace purchases. Monthly candles
              compare each month's revenue with the previous month.
            </p>

          </section>

          {/* PLATFORM OVERVIEW + QUICK SUMMARY */}

          <section className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-3">

            {/* PLATFORM OVERVIEW */}

            <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 xl:col-span-2">

              <h2 className="font-bold text-slate-900">
                Platform Overview
              </h2>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Live statistics from your database
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">

                {/* STUDENTS */}

                <div className="rounded-xl bg-blue-50 p-4 sm:p-5">

                  <div className="flex items-center gap-3 text-blue-700">
                    <Users size={21} />

                    <span className="text-sm font-medium">
                      Total Students
                    </span>
                  </div>

                  <p className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
                    {totalStudents}
                  </p>

                </div>

                {/* NOTES */}

                <div className="rounded-xl bg-purple-50 p-4 sm:p-5">

                  <div className="flex items-center gap-3 text-purple-700">
                    <FileText size={21} />

                    <span className="text-sm font-medium">
                      Total Notes
                    </span>
                  </div>

                  <p className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
                    {totalNotes}
                  </p>

                </div>

                {/* PRACTICE ATTEMPTS */}

                <div className="rounded-xl bg-orange-50 p-4 sm:p-5">

                  <div className="flex items-center gap-3 text-orange-700">
                    <Activity size={21} />

                    <span className="text-sm font-medium">
                      Practice Attempts
                    </span>
                  </div>

                  <p className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
                    {practiceAttempts}
                  </p>

                </div>

                {/* PREMIUM USERS */}

                <div className="rounded-xl bg-amber-50 p-4 sm:p-5">

                  <div className="flex items-center gap-3 text-amber-700">
                    <Crown size={21} />

                    <span className="text-sm font-medium">
                      Premium Students
                    </span>
                  </div>

                  <p className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
                    {premiumUsers}
                  </p>

                </div>

              </div>

              <p className="mt-5 text-xs text-slate-400">
                Statistics are fetched directly from your MySQL database.
              </p>

            </div>

            {/* QUICK SUMMARY */}

            <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">

              <h2 className="font-bold text-slate-900">
                Quick Summary
              </h2>

              <div className="mt-6 space-y-6">

                {/* STUDENTS */}

                <div>

                  <div className="mb-2 flex justify-between gap-2 text-xs sm:text-sm">

                    <span className="text-slate-500">
                      Student Accounts
                    </span>

                    <span className="font-semibold text-slate-800">
                      {totalStudents}
                    </span>

                  </div>

                  <div className="h-2 rounded-full bg-slate-100">

                    <div
                      className="h-2 rounded-full bg-blue-500"
                      style={{
                        width: totalStudents > 0 ? "100%" : "0%",
                      }}
                    />

                  </div>

                </div>

                {/* PREMIUM */}

                <div>

                  <div className="mb-2 flex justify-between gap-2 text-xs sm:text-sm">

                    <span className="text-slate-500">
                      Premium Accounts
                    </span>

                    <span className="font-semibold text-slate-800">
                      {premiumUsers} ({premiumPercentage}%)
                    </span>

                  </div>

                  <div className="h-2 rounded-full bg-slate-100">

                    <div
                      className="h-2 rounded-full bg-purple-500"
                      style={{
                        width: `${premiumPercentage}%`,
                      }}
                    />

                  </div>

                </div>

                {/* NOTES */}

                <div>

                  <div className="mb-2 flex justify-between gap-2 text-xs sm:text-sm">

                    <span className="text-slate-500">
                      Total Notes
                    </span>

                    <span className="font-semibold text-slate-800">
                      {totalNotes}
                    </span>

                  </div>

                  <div className="h-2 rounded-full bg-slate-100">

                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{
                        width: totalNotes > 0 ? "100%" : "0%",
                      }}
                    />

                  </div>

                </div>

              </div>

              {/* ADMIN TIP */}

              <div className="mt-8 rounded-xl bg-blue-50 p-4">

                <div className="flex items-center gap-2 text-blue-700">

                  <ArrowUpRight size={19} />

                  <span className="text-sm font-semibold">
                    Admin Tip
                  </span>

                </div>

                <p className="mt-2 text-xs leading-5 text-blue-700">
                  Monitor student activity, notes and subscriptions
                  to understand your platform's performance.
                </p>

              </div>

            </div>

          </section>

          {/* RECENT USERS */}

          <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white">

            <div className="border-b border-slate-100 p-4 sm:p-6">

              <h2 className="font-bold text-slate-900">
                Recent Users
              </h2>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Latest registered student accounts
              </p>

            </div>

            {/* SCROLLABLE TABLE */}

            <div className="max-h-[400px] w-full overflow-auto">

              <table className="w-full min-w-[650px] text-left">

                <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase text-slate-500">

                  <tr>
                    <th className="px-4 py-4 sm:px-6">
                      Student
                    </th>

                    <th className="px-4 py-4 sm:px-6">
                      Email
                    </th>

                    <th className="px-4 py-4 sm:px-6">
                      Plan
                    </th>

                    <th className="px-4 py-4 sm:px-6">
                      Status
                    </th>
                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {recentUsers.map((user) => (

                    <tr
                      key={user.id}
                      className="transition hover:bg-slate-50"
                    >

                      <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-800 sm:px-6">
                        {user.name}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-500 sm:px-6">
                        {user.email}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 sm:px-6">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            user.plan === "premium"
                              ? "bg-purple-50 text-purple-700"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {user.plan || "free"}
                        </span>

                      </td>

                      <td className="whitespace-nowrap px-4 py-4 sm:px-6">

                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                          Active
                        </span>

                      </td>

                    </tr>

                  ))}

                  {recentUsers.length === 0 && (

                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-8 text-center text-sm text-slate-500"
                      >
                        No users found.
                      </td>
                    </tr>

                  )}

                </tbody>

              </table>

            </div>

            <p className="border-t border-slate-100 px-4 py-3 text-xs text-slate-400 sm:px-6">
              Scroll vertically to view more users and horizontally
              to view all columns.
            </p>

          </section>

        </>
      )}

    </div>
  );
}

export default Dashboard;
