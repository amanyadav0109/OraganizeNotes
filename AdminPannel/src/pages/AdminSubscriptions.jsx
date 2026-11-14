
import { useEffect, useMemo, useState } from "react";
import {
  Crown,
  Users,
  CheckCircle2,
  Clock,
  IndianRupee,
  Search,
  RefreshCw,
  CreditCard,
  CalendarDays,
  AlertCircle,
  XCircle,
} from "lucide-react";

const API_URL = import.meta.env.VITE_SERVER_URL;

const currency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const dateFormat = (value) => {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const statusStyle = {
  active: "bg-emerald-50 text-emerald-700",
  expired: "bg-red-50 text-red-700",
  created: "bg-amber-50 text-amber-700",
  failed: "bg-slate-100 text-slate-600",
};

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  const colors = {
    violet: "bg-violet-100 text-violet-600",
    green: "bg-emerald-100 text-emerald-600",
    red: "bg-red-100 text-red-600",
    blue: "bg-blue-100 text-blue-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-3 break-words text-2xl font-bold text-slate-900 sm:text-3xl">
            {value}
          </h3>
          <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
        </div>

        <div className={`rounded-xl p-3 ${colors[color]}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const currentStatus = status || "created";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
        statusStyle[currentStatus] || statusStyle.failed
      }`}
    >
      {currentStatus === "active" && <CheckCircle2 size={13} />}
      {currentStatus === "expired" && <Clock size={13} />}
      {currentStatus === "failed" && <XCircle size={13} />}
      {currentStatus}
    </span>
  );
}

function AdminSubscriptions() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("subscriptions");

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("getnotesAdminToken");

      if (!token) {
        throw new Error("Admin token not found. Please login again.");
      }

      const response = await fetch(
        `${API_URL}/api/admin/subscriptions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to load subscriptions"
        );
      }

      setData(result);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const subscriptions = data?.subscriptions || [];
  const payments = data?.payments || [];
  const summary = data?.summary || {};

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((item) => {
      const term = search.toLowerCase();

      const matchesSearch =
        item.studentName?.toLowerCase().includes(term) ||
        item.email?.toLowerCase().includes(term) ||
        String(item.userId).includes(term) ||
        item.razorpayPaymentId?.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [subscriptions, search, statusFilter]);

  const filteredPayments = useMemo(() => {
    return payments.filter((item) => {
      const term = search.toLowerCase();

      return (
        item.studentName?.toLowerCase().includes(term) ||
        item.email?.toLowerCase().includes(term) ||
        item.razorpayPaymentId?.toLowerCase().includes(term) ||
        item.razorpayOrderId?.toLowerCase().includes(term)
      );
    });
  }, [payments, search]);

  if (loading && !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <RefreshCw
            size={32}
            className="mx-auto animate-spin text-violet-600"
          />
          <p className="mt-3 text-sm text-slate-500">
            Loading subscriptions...
          </p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-6 text-center">
        <AlertCircle size={35} className="mx-auto text-red-500" />
        <h2 className="mt-3 font-bold text-slate-900">
          Unable to load subscriptions
        </h2>
        <p className="mt-2 text-sm text-red-600">{error}</p>

        <button
          onClick={fetchSubscriptions}
          className="mt-5 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-7">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-violet-100 p-2.5 text-violet-600">
              <Crown size={23} />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Subscription Management
            </h1>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Monitor premium students, subscription expiry and payments.
          </p>
        </div>

        <button
          onClick={fetchSubscriptions}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Premium Users"
          value={summary.totalPremiumUsers ?? 0}
          subtitle="Students with active subscriptions"
          icon={Users}
          color="violet"
        />

        <StatCard
          title="Active Subscriptions"
          value={summary.activeSubscriptions ?? 0}
          subtitle="Currently valid subscriptions"
          icon={CheckCircle2}
          color="green"
        />

        <StatCard
          title="Expired Subscriptions"
          value={summary.expiredSubscriptions ?? 0}
          subtitle="Subscriptions past expiry date"
          icon={Clock}
          color="red"
        />

        <StatCard
          title="Subscription Revenue"
          value={currency(summary.totalRevenue)}
          subtitle="Payments with recorded payment IDs"
          icon={IndianRupee}
          color="blue"
        />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("subscriptions")}
          className={`border-b-2 px-4 py-3 text-sm font-semibold transition ${
            activeTab === "subscriptions"
              ? "border-violet-600 text-violet-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span className="inline-flex items-center gap-2">
            <Crown size={16} />
            Premium Users
          </span>
        </button>

        <button
          onClick={() => setActiveTab("payments")}
          className={`border-b-2 px-4 py-3 text-sm font-semibold transition ${
            activeTab === "payments"
              ? "border-violet-600 text-violet-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span className="inline-flex items-center gap-2">
            <CreditCard size={16} />
            Payment History
          </span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative w-full sm:max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student, email or payment ID..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        {activeTab === "subscriptions" && (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="created">Created</option>
            <option value="failed">Failed</option>
          </select>
        )}
      </div>

      {/* Premium Users */}
      {activeTab === "subscriptions" && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Premium Subscription Records
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Student subscription details and expiry tracking.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-4 font-semibold">Student</th>
                  <th className="px-5 py-4 font-semibold">Plan</th>
                  <th className="px-5 py-4 font-semibold">Amount</th>
                  <th className="px-5 py-4 font-semibold">Start Date</th>
                  <th className="px-5 py-4 font-semibold">Expiry Date</th>
                  <th className="px-5 py-4 font-semibold">Remaining</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredSubscriptions.map((item) => (
                  <tr
                    key={item.subscriptionId}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">
                        {item.studentName}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.email}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Student ID: #{item.userId}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-semibold capitalize text-violet-700">
                        {item.planName}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                      {currency(item.amount)}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {dateFormat(item.startedAt)}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {dateFormat(item.expiresAt)}
                    </td>

                    <td className="px-5 py-4">
                      {item.status === "active" ? (
                        <span className="text-sm font-semibold text-emerald-700">
                          {item.expiresAt
                            ? `${item.remainingDays} days`
                            : "Not specified"}
                        </span>
                      ) : (
                        <span className="text-sm text-slate-400">—</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                ))}

                {filteredSubscriptions.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-12 text-center text-sm text-slate-500"
                    >
                      No subscription records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500">
            Showing {filteredSubscriptions.length} of {subscriptions.length} records
          </div>
        </section>
      )}

      {/* Payment History */}
      {activeTab === "payments" && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Subscription Payment History
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Review recorded Razorpay payment transactions.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-4 font-semibold">Student</th>
                  <th className="px-5 py-4 font-semibold">Amount</th>
                  <th className="px-5 py-4 font-semibold">Payment ID</th>
                  <th className="px-5 py-4 font-semibold">Order ID</th>
                  <th className="px-5 py-4 font-semibold">Payment Date</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((payment) => (
                  <tr
                    key={payment.subscriptionId}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">
                        {payment.studentName}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {payment.email}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm font-bold text-slate-900">
                      {currency(payment.amount)}
                    </td>

                    <td className="px-5 py-4 text-xs text-slate-600">
                      {payment.razorpayPaymentId}
                    </td>

                    <td className="px-5 py-4 text-xs text-slate-600">
                      {payment.razorpayOrderId}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {dateFormat(payment.paymentDate)}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={payment.status} />
                    </td>
                  </tr>
                ))}

                {filteredPayments.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-12 text-center text-sm text-slate-500"
                    >
                      No payment records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500">
            Showing {filteredPayments.length} of {payments.length} payment records
          </div>
        </section>
      )}

      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
        <CalendarDays className="mt-0.5 shrink-0 text-blue-600" size={19} />
        <p className="text-xs leading-5 text-blue-800">
          Subscription status and remaining days are calculated using the
          expiry date. Payment history displays records with a Razorpay
          payment ID; it does not independently verify payment capture with
          Razorpay.
        </p>
      </div>
    </div>
  );
}

export default AdminSubscriptions;
