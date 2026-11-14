
import { useEffect, useState } from "react";
import {
  ShoppingBag,
  FileText,
  IndianRupee,
  Wallet,
  RefreshCw,
  Search,
  X,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Store,
  CreditCard,
  AlertCircle,
} from "lucide-react";

const API_URL = import.meta.env.VITE_SERVER_URL;

const currency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  const colors = {
    violet: "bg-violet-100 text-violet-600",
    blue: "bg-blue-100 text-blue-600",
    green: "bg-emerald-100 text-emerald-600",
    orange: "bg-orange-100 text-orange-600",
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

function SectionHeader({ title, description, children }) {
  return (
    <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      {children}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      <ShoppingBag className="mb-3 text-slate-300" size={36} />
      <p className="text-sm font-medium text-slate-600">{message}</p>
    </div>
  );
}

function AdminMarketplace() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");

  const [payoutForm, setPayoutForm] = useState({
    amount: "",
    transferReference: "",
    notes: "",
  });

  const fetchMarketplace = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("getnotesAdminToken");

      if (!token) {
        throw new Error("Admin token not found. Please login again.");
      }

      const response = await fetch(
        `${API_URL}/api/admin/marketplace`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to load marketplace data");
      }

      setData(result);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketplace();
  }, []);

  const openPayoutModal = (seller) => {
    setSelectedSeller(seller);
    setPayoutForm({
      amount: seller.pendingBalance || "",
      transferReference: "",
      notes: "",
    });
    setFormError("");
    setShowPayoutModal(true);
  };

  const closePayoutModal = () => {
    if (submitting) return;

    setShowPayoutModal(false);
    setSelectedSeller(null);
    setFormError("");
  };

  const handlePayoutSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSeller) return;

    const amount = Number(payoutForm.amount);
    const pending = Number(selectedSeller.pendingBalance || 0);

    if (!amount || amount <= 0) {
      setFormError("Please enter a valid payout amount.");
      return;
    }

    if (amount > pending) {
      setFormError("Payout amount cannot exceed pending balance.");
      return;
    }

    if (!payoutForm.transferReference.trim()) {
      setFormError("Please enter UPI or bank transaction reference.");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");

      const token = localStorage.getItem("getnotesAdminToken");

      const response = await fetch(
        `${API_URL}/api/admin/marketplace/payouts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            sellerId: selectedSeller.sellerId,
            amount,
            transferReference: payoutForm.transferReference.trim(),
            notes: payoutForm.notes.trim(),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to record payout");
      }

      setShowPayoutModal(false);
      setSelectedSeller(null);
      setSuccessMessage("Payout record saved successfully.");

      await fetchMarketplace();
    } catch (err) {
      setFormError(err.message || "Payout failed");
    } finally {
      setSubmitting(false);
    }
  };

  const summary = data?.summary || {};

  const filteredNotes = (data?.notesDetails || []).filter((note) => {
    const term = search.toLowerCase();

    return (
      note.title?.toLowerCase().includes(term) ||
      note.sellerName?.toLowerCase().includes(term) ||
      note.subject?.toLowerCase().includes(term)
    );
  });

  const filteredSales = (data?.salesDetails || []).filter((sale) => {
    const term = search.toLowerCase();

    return (
      sale.title?.toLowerCase().includes(term) ||
      sale.sellerName?.toLowerCase().includes(term)
    );
  });

  if (loading && !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto animate-spin text-violet-600" size={32} />
          <p className="mt-3 text-sm text-slate-500">
            Loading marketplace...
          </p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-6 text-center">
        <AlertCircle className="mx-auto text-red-500" size={35} />
        <h2 className="mt-3 font-bold text-slate-900">
          Unable to load marketplace
        </h2>
        <p className="mt-2 break-words text-sm text-red-600">{error}</p>
        <button
          onClick={fetchMarketplace}
          className="mt-5 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-7">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-violet-100 p-2.5 text-violet-600">
              <Store size={23} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Marketplace
            </h1>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Manage marketplace sales, notes and seller payouts.
          </p>
        </div>

        <button
          onClick={fetchMarketplace}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh Data
        </button>
      </div>

      {successMessage && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={18} />
            {successMessage}
          </span>
          <button onClick={() => setSuccessMessage("")}>
            <X size={17} />
          </button>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Sales"
          value={summary.totalSales ?? 0}
          subtitle="Successful marketplace purchases"
          icon={ShoppingBag}
          color="violet"
        />

        <StatCard
          title="Total Notes"
          value={summary.totalNotes ?? 0}
          subtitle="Notes listed in marketplace"
          icon={FileText}
          color="blue"
        />

        <StatCard
          title="Total Revenue"
          value={currency(summary.totalRevenue)}
          subtitle="Revenue from eligible sales"
          icon={IndianRupee}
          color="green"
        />

        <StatCard
          title="Platform Earnings"
          value={currency(summary.totalPlatformEarnings)}
          subtitle="GetNotes share (40%)"
          icon={Wallet}
          color="orange"
        />
      </div>

      {/* Revenue Distribution */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-slate-900">
            Revenue Distribution
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Marketplace revenue split between sellers and GetNotes.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-violet-50 p-5">
            <p className="text-sm font-medium text-violet-700">
              Seller Earnings (60%)
            </p>
            <h3 className="mt-2 text-2xl font-bold text-violet-900">
              {currency(summary.totalSellerEarnings)}
            </h3>
          </div>

          <div className="rounded-xl bg-emerald-50 p-5">
            <p className="text-sm font-medium text-emerald-700">
              Platform Earnings (40%)
            </p>
            <h3 className="mt-2 text-2xl font-bold text-emerald-900">
              {currency(summary.totalPlatformEarnings)}
            </h3>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full sm:max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Search notes or sellers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
        />
      </div>

      {/* Sales Details */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <SectionHeader
          title="Sales Details"
          description="Successful purchases and revenue generated by each note."
        />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-4 font-semibold">Note</th>
                <th className="px-4 py-4 font-semibold">Seller</th>
                <th className="px-4 py-4 font-semibold">Units Sold</th>
                <th className="px-4 py-4 font-semibold">Total Revenue</th>
                <th className="px-4 py-4 font-semibold">Seller Share</th>
                <th className="px-4 py-4 font-semibold">Platform Share</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredSales.map((sale) => (
                <tr key={sale.noteId} className="hover:bg-slate-50">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-800">
                      {sale.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Note ID: #{sale.noteId}
                    </p>
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-600">
                    {sale.sellerName}
                  </td>

                  <td className="px-4 py-4 text-sm font-semibold text-slate-700">
                    {sale.totalSold}
                  </td>

                  <td className="px-4 py-4 text-sm font-semibold text-slate-900">
                    {currency(sale.totalRevenue)}
                  </td>

                  <td className="px-4 py-4 text-sm font-medium text-violet-700">
                    {currency(sale.sellerEarnings)}
                  </td>

                  <td className="px-4 py-4 text-sm font-medium text-emerald-700">
                    {currency(sale.platformEarnings)}
                  </td>
                </tr>
              ))}

              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan="6">
                    <EmptyState message="No sales found." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Notes Details */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <SectionHeader
          title="Marketplace Notes"
          description="All notes uploaded by marketplace sellers."
        />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-4 font-semibold">Note Details</th>
                <th className="px-4 py-4 font-semibold">Seller</th>
                <th className="px-4 py-4 font-semibold">Subject</th>
                <th className="px-4 py-4 font-semibold">Price</th>
                <th className="px-4 py-4 font-semibold">Sold</th>
                <th className="px-4 py-4 font-semibold">Uploaded</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredNotes.map((note) => (
                <tr key={note.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-800">
                      {note.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      #{note.id} · {note.unit}
                    </p>
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-600">
                    {note.sellerName}
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-600">
                    {note.subject}
                  </td>

                  <td className="px-4 py-4 text-sm font-semibold text-slate-900">
                    {currency(note.price)}
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-700">
                    {note.totalSold}
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-500">
                    {formatDate(note.createdAt)}
                  </td>
                </tr>
              ))}

              {filteredNotes.length === 0 && (
                <tr>
                  <td colSpan="6">
                    <EmptyState message="No marketplace notes found." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Seller Payouts */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <SectionHeader
          title="Seller Payouts"
          description="Track seller earnings and pending payout balances."
        />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-4 font-semibold">Seller</th>
                <th className="px-4 py-4 font-semibold">Total Sales</th>
                <th className="px-4 py-4 font-semibold">Total Revenue</th>
                <th className="px-4 py-4 font-semibold">Seller Earnings</th>
                <th className="px-4 py-4 font-semibold">Paid</th>
                <th className="px-4 py-4 font-semibold">Pending</th>
                <th className="px-4 py-4 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {(data?.sellerPayouts || []).map((seller) => (
                <tr key={seller.sellerId} className="hover:bg-slate-50">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-800">
                      {seller.sellerName}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Seller ID: #{seller.sellerId}
                    </p>
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-600">
                    {seller.totalSales}
                  </td>

                  <td className="px-4 py-4 text-sm font-medium text-slate-800">
                    {currency(seller.totalSalesRevenue)}
                  </td>

                  <td className="px-4 py-4 text-sm font-semibold text-violet-700">
                    {currency(seller.totalEarnings)}
                  </td>

                  <td className="px-4 py-4 text-sm font-medium text-emerald-700">
                    {currency(seller.totalPaid)}
                  </td>

                  <td className="px-4 py-4">
                    <span className="rounded-lg bg-orange-50 px-2.5 py-1.5 text-sm font-semibold text-orange-700">
                      {currency(seller.pendingBalance)}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    {Number(seller.pendingBalance) > 0 ? (
                      <button
                        onClick={() => openPayoutModal(seller)}
                        className="whitespace-nowrap rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-700"
                      >
                        Record Payout
                      </button>
                    ) : (
                      <span className="text-xs font-medium text-emerald-600">
                        No Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {(data?.sellerPayouts || []).length === 0 && (
                <tr>
                  <td colSpan="7">
                    <EmptyState message="No seller payout records available." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Payout History */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <SectionHeader
          title="Payout History"
          description="Previously recorded seller payments."
        />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-4 font-semibold">Seller</th>
                <th className="px-4 py-4 font-semibold">Amount</th>
                <th className="px-4 py-4 font-semibold">Transaction Reference</th>
                <th className="px-4 py-4 font-semibold">Date</th>
                <th className="px-4 py-4 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {(data?.payoutHistory || []).map((payout) => (
                <tr key={payout.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4 text-sm font-semibold text-slate-800">
                    {payout.sellerName || payout.seller_name || "Seller"}
                  </td>

                  <td className="px-4 py-4 text-sm font-semibold text-slate-900">
                    {currency(payout.amount)}
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-600">
                    {payout.transfer_reference || payout.transferReference || "—"}
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-500">
                    {formatDate(payout.paid_at || payout.paidAt)}
                  </td>

                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 size={13} />
                      Paid
                    </span>
                  </td>
                </tr>
              ))}

              {(data?.payoutHistory || []).length === 0 && (
                <tr>
                  <td colSpan="5">
                    <EmptyState message="No payouts recorded yet." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Record Payout Modal */}
      {showPayoutModal && selectedSeller && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={closePayoutModal}
        >
          <div
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="mb-3 inline-flex rounded-xl bg-violet-100 p-3 text-violet-600">
                  <CreditCard size={22} />
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                  Record Seller Payout
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Record a payment already transferred to the seller.
                </p>
              </div>

              <button
                onClick={closePayoutModal}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-5 rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500">Seller</p>
              <p className="mt-1 font-bold text-slate-900">
                {selectedSeller.sellerName}
              </p>

              <div className="mt-3 flex justify-between gap-3 border-t border-slate-200 pt-3 text-sm">
                <span className="text-slate-500">Pending balance</span>
                <span className="font-bold text-orange-600">
                  {currency(selectedSeller.pendingBalance)}
                </span>
              </div>
            </div>

            <form onSubmit={handlePayoutSubmit} className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Payout Amount (₹)
                </label>
                <input
                  type="number"
                  min="0.01"
                  max={selectedSeller.pendingBalance}
                  step="0.01"
                  required
                  value={payoutForm.amount}
                  onChange={(e) =>
                    setPayoutForm({
                      ...payoutForm,
                      amount: e.target.value,
                    })
                  }
                  placeholder="Enter amount"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  UPI / Bank Transaction Reference
                </label>
                <input
                  type="text"
                  required
                  value={payoutForm.transferReference}
                  onChange={(e) =>
                    setPayoutForm({
                      ...payoutForm,
                      transferReference: e.target.value,
                    })
                  }
                  placeholder="Enter transaction ID / UTR"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Notes (Optional)
                </label>
                <textarea
                  rows="3"
                  value={payoutForm.notes}
                  onChange={(e) =>
                    setPayoutForm({
                      ...payoutForm,
                      notes: e.target.value,
                    })
                  }
                  placeholder="Additional payment details..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              {formError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                  {formError}
                </div>
              )}

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                Only record this payout after the actual UPI or bank transfer
                has been completed. This form does not transfer money.
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
                <button
                  type="button"
                  onClick={closePayoutModal}
                  disabled={submitting}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Saving..." : "Save Payout Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminMarketplace;