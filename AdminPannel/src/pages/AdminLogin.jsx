import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  Users,
  BookOpen,
  BarChart3,
  BrainCircuit,
} from "lucide-react";

function AdminLogin() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Admin login failed");
      }

      localStorage.setItem("getnotesAdminToken", data.token);
      localStorage.setItem(
        "getnotesAdmin",
        JSON.stringify(data.admin)
      );

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.message || "Unable to connect to server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-8 sm:px-6">

      {/* Main Card */}
      <div className="w-full max-w-5xl min-h-[580px] overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-300/60 grid grid-cols-1 md:grid-cols-2">

        {/* LEFT SECTION */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-8 sm:p-10 lg:p-12 text-white flex flex-col justify-between">

          {/* Background decoration */}
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[35px] border-white/10" />
          <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full border-[35px] border-white/10" />

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
              <ShieldCheck size={27} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                OrganizeNotes
                <span className="ml-1 text-blue-200">Admin</span>
              </h1>
              <p className="text-[10px] font-semibold tracking-[3px] text-blue-100">
                CONTROL CENTER
              </p>
            </div>
          </div>

          {/* Brand Content */}
          <div className="relative z-10 my-12">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-green-300" />
              PLATFORM MANAGEMENT PORTAL
            </div>

            <h2 className="max-w-md text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Welcome to
              <span className="block text-blue-100">
                OrganizeNotes Admin
              </span>
            </h2>

            <p className="mt-6 max-w-md text-sm leading-7 text-blue-100 sm:text-base">
              Manage your learning platform, monitor students,
              organize educational content and track platform
              performance from one place.
            </p>

            {/* Features */}
            <div className="mt-9 space-y-5">

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                  <Users size={18} />
                </div>
                <span className="text-sm font-medium">
                  Student Management
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                  <BookOpen size={18} />
                </div>
                <span className="text-sm font-medium">
                  Notes & Content Management
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                  <BrainCircuit size={18} />
                </div>
                <span className="text-sm font-medium">
                  AI Usage Monitoring
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                  <BarChart3 size={18} />
                </div>
                <span className="text-sm font-medium">
                  Analytics & Reports
                </span>
              </div>

            </div>
          </div>

          <div className="relative z-10 flex flex-wrap justify-between gap-2 border-t border-white/20 pt-5 text-xs text-blue-100">
            <span>© {new Date().getFullYear()} OrganizeNotes</span>
            <span>Built for better learning.</span>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center justify-center bg-white px-6 py-12 sm:px-10 lg:px-12">

          <div className="w-full max-w-md">

            {/* Mobile logo */}
            <div className="mb-10 flex items-center gap-3 md:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                <ShieldCheck size={25} />
              </div>

              <h1 className="text-xl font-bold text-slate-900">
               OrganizeNotes
                <span className="ml-1 text-blue-600">Admin</span>
              </h1>
            </div>

            {/* Heading */}
            <div className="mb-9 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <ShieldCheck size={29} />
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Welcome Back
              </h2>

              <p className="mt-3 text-sm text-slate-500">
                Sign in to access your admin dashboard.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email Address
                </label>

                <div className="flex h-12 items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                  <Mail size={19} className="shrink-0 text-slate-400" />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your admin email"
                    autoComplete="username"
                    required
                    className="h-full w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <div className="flex h-12 items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                  <LockKeyhole size={19} className="shrink-0 text-slate-400" />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="h-full w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="shrink-0 text-slate-400 transition hover:text-blue-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-blue-600/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In to Dashboard
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Secure note */}
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck size={16} className="text-green-600" />
              Authorized administrators only
            </div>

            <div className="mt-10 border-t border-slate-200 pt-5 text-center text-xs text-slate-400">
              © {new Date().getFullYear()} OrganizeNotes. All rights reserved.
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminLogin;