
import { useState } from "react";
import {
  Crown,
  Check,
  Sparkles,
  Zap,
  Brain,
  BookOpen,
  ClipboardCheck,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  Star,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SubscriptionModal from "../components/SubscriptionModal";

const features = [
  {
    icon: Brain,
    title: "AI Study Assistant",
    description:
      "Get AI-powered summaries, MCQs and interview questions.",
  },
  {
    icon: BookOpen,
    title: "Smart Notes",
    description:
      "Organize and access your study notes easily.",
  },
  {
    icon: ClipboardCheck,
    title: "Practice & Mock Tests",
    description:
      "Practice questions and improve your exam performance.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description:
      "Track your progress and identify weak topics.",
  },
];

const freeFeatures = [
  "Basic Notes Management",
  "Limited AI Usage",
  "Limited Practice Attempts",
  "Basic Mock Test Access",
  "Basic Dashboard",
];

const premiumFeatures = [
  "Enhanced AI Study Assistant",
  "Premium AI Features",
  "Unlimited Practice Access",
  "Unlimited Mock Test Attempts",
  "Advanced Performance Analytics",
  "Priority Learning Experience",
];

export default function Upgrade() {
  const [showSubscription, setShowSubscription] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  const handleUpgrade = () => {
    if (isPremium) return;

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first to upgrade your plan.");
      return;
    }

    setShowSubscription(true);
  };

  const handlePaymentSuccess = () => {
    setIsPremium(true);
    setShowSubscription(false);
  };

  return (
    <div className="min-h-screen min-w-0 bg-gray-50 text-slate-900 transition-colors duration-200 dark:bg-[#080d18] dark:text-white">
      <Navbar />
      <Sidebar />

      {/* Main Content */}
      <main className="min-w-0 px-4 pb-10 pt-20 sm:px-6 lg:ml-64 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">

          {/* Hero Section */}
          <section className="relative overflow-hidden rounded-3xl border border-purple-200 bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 px-5 py-12 text-center dark:border-purple-500/20 dark:from-[#171638] dark:via-[#11152C] dark:to-[#101D35] sm:px-10 sm:py-16">

            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-400/20 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />

            <div className="relative z-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-xl shadow-purple-500/30">
                <Crown size={34} />
              </div>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-purple-300 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-wider text-purple-700 dark:border-purple-400/30 dark:bg-purple-500/10 dark:text-purple-300">
                <Sparkles size={15} />
                GetNotes Premium
              </div>

              <h1 className="mx-auto mt-5 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Unlock Your Full
                <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-blue-400">
                  Learning Potential
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                Study smarter, practice better and achieve more with
                powerful AI tools and premium learning features.
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-2">
                  <ShieldCheck
                    size={17}
                    className="text-green-600 dark:text-green-400"
                  />
                  Secure Payment
                </span>

                <span className="flex items-center gap-2">
                  <Zap size={17} className="text-amber-500" />
                  Instant Access
                </span>
              </div>
            </div>
          </section>

          {/* Plan Heading */}
          <section className="mt-12 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Choose Your Plan
            </h2>

            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
              Choose the plan that works best for your learning journey.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 dark:border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-300">
              <Sparkles size={16} />
              Simple monthly pricing
            </div>
          </section>

          {/* Plans */}
          <section className="mx-auto mt-9 grid w-full max-w-4xl gap-6 md:grid-cols-2">

            {/* Free Plan */}
            <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#111827] sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold">
                    Free Plan
                  </h3>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    For getting started
                  </p>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <BookOpen size={23} />
                </div>
              </div>

              <div className="mt-7 flex items-end gap-1">
                <span className="text-4xl font-extrabold">
                  ₹0
                </span>

                <span className="mb-1 text-sm text-slate-500 dark:text-slate-400">
                  / forever
                </span>
              </div>

              <div className="my-7 h-px bg-slate-200 dark:bg-slate-700" />

              <p className="text-sm font-semibold">
                What's included
              </p>

              <ul className="mt-5 flex-1 space-y-4">
                {freeFeatures.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300"
                  >
                    <Check
                      size={18}
                      className="shrink-0 text-green-500"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                disabled
                className="mt-9 w-full cursor-not-allowed rounded-xl border border-slate-300 bg-slate-100 px-5 py-3.5 text-sm font-bold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
              >
                Free Plan
              </button>
            </div>

            {/* Premium Plan */}
            <div className="relative flex flex-col rounded-3xl border-2 border-purple-500 bg-white p-6 shadow-xl shadow-purple-500/10 dark:bg-[#111827] sm:p-8">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2 text-xs font-bold text-white shadow-lg">
                <span className="flex items-center gap-2">
                  <Star size={13} fill="currentColor" />
                  RECOMMENDED
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300">
                    Premium Plan
                  </h3>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    For serious learners
                  </p>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-300">
                  <Crown size={25} />
                </div>
              </div>

              <div className="mt-7">
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-extrabold">
                    ₹199
                  </span>

                  <span className="mb-1 text-sm text-slate-500 dark:text-slate-400">
                    / month
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Billed every 30 days
                </p>
              </div>

              <div className="my-7 h-px bg-slate-200 dark:bg-slate-700" />

              <p className="text-sm font-semibold">
                Everything in Free, plus
              </p>

              <ul className="mt-5 flex-1 space-y-4">
                {premiumFeatures.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300">
                      <Check size={13} />
                    </span>

                    {item}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={handleUpgrade}
                disabled={isPremium}
                className="mt-9 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isPremium ? (
                  <>
                    <Check size={18} />
                    Premium Activated
                  </>
                ) : (
                  <>
                    Upgrade to Premium
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
                Secure payment powered by Razorpay
              </p>
            </div>
          </section>

          {/* Features */}
          <section className="mt-16">
            <div className="text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">
                Why Choose Premium?
              </h2>

              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                Everything you need to make your learning more productive.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-[#111827]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-300">
                      <Icon size={22} />
                    </div>

                    <h3 className="mt-4 font-bold">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-14 border-t border-slate-200 py-7 text-center dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Made for students. Built for better learning.
            </p>

            <p className="mt-2 text-xs text-slate-400">
              © {new Date().getFullYear()} OrganizeNotes. All rights reserved.
            </p>
          </footer>
        </div>
      </main>

      {/* Razorpay Subscription Modal */}
      {showSubscription && (
        <SubscriptionModal
          closeModal={() => setShowSubscription(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
