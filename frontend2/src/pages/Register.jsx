
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";

import api from "../services/api";
import { auth, googleProvider } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // NORMAL REGISTRATION
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.error("Please fill all fields");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/register", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      toast.success(
        res.data.message || "Registration successful! Please login."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    }catch (err) {
  console.error("REGISTER ERROR:", err);

  const message = err.response?.data?.message;

  if (
    err.response?.status === 400 &&
    message?.toLowerCase().includes("already exists")
  ) {
    toast.error("This email is already registered. Please login!");
  } else {
    toast.error(message || "Registration failed. Please try again.");
  }
} finally {
  setLoading(false);
}
  };


 const handleGoogleLogin = async () => {
  try {
    setGoogleLoading(true);

    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();

    const response = await api.post("/auth/google", {
      idToken,
      mode: "register",
    });

    if (!response.data.token || !response.data.user) {
      throw new Error("Invalid response received from server");
    }

    login(response.data.token, response.data.user);

    toast.success("Google registration successful!");

    setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 700);

  } catch (err) {
    console.error("GOOGLE AUTH ERROR:", err);
    console.error("Firebase Error Code:", err.code);
    console.error("Backend Error:", err.response?.data);

    if (err.code === "auth/popup-closed-by-user") {
      toast.info("Google sign-in was cancelled.");
    } else if (err.code === "auth/popup-blocked") {
      toast.error("Popup blocked. Please allow popups for this website.");
    } else if (err.code === "auth/unauthorized-domain") {
      toast.error("This domain is not authorized in Firebase.");
    } else if (err.code === "auth/operation-not-allowed") {
      toast.error("Google sign-in is not enabled in Firebase.");
    } else if (err.code === "auth/network-request-failed") {
      toast.error("Network error. Please check your internet connection.");
    } else if (err.response) {
      toast.error(
        err.response.data?.message || "Google authentication failed on server."
      );
    } else {
      toast.error(
        err.message || "Google registration failed. Please try again."
      );
    }
  } finally {
    setGoogleLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center px-4 py-10">

      <div className="grid lg:grid-cols-2 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden max-w-6xl w-full">

        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-indigo-700 to-purple-700 text-white p-12">

          <h1 className="text-5xl font-extrabold leading-tight">
            Join
            <br />
            OrganizeNotes
          </h1>

          <p className="mt-6 text-lg text-indigo-100 leading-8">
            Create your account and organize your study life
            with smart notes, AI tools, reminders and subject
            management.
          </p>

          <div className="mt-10 space-y-5 text-indigo-100">

            <div>📚 Organize Your Notes</div>
            <div>🤖 AI Study Assistant</div>
            <div>📌 Pin Important Notes</div>
            <div>🔔 Smart Reminders</div>
            <div>📝 Practice Questions & Mock Tests</div>
            <div>🛒 Notes Marketplace</div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="p-7 sm:p-10 lg:p-14">

          <div className="text-center">

            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">
              Create Account
            </h2>

            <p className="mt-3 text-gray-500 dark:text-gray-400">
              Join OrganizeNotes today 🚀
            </p>

          </div>

          {/* REGISTRATION FORM */}
          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-5"
          >

            {/* NAME */}
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>

              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                Confirm Password
              </label>

              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* REGISTER BUTTON */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition text-white font-semibold py-3 rounded-xl shadow-lg"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          {/* DIVIDER */}
          <div className="my-8 flex items-center gap-4">

            <div className="flex-1 border-t border-gray-200 dark:border-slate-700" />

            <span className="text-gray-500 dark:text-gray-400 text-sm">
              OR CONTINUE WITH
            </span>

            <div className="flex-1 border-t border-gray-200 dark:border-slate-700" />

          </div>

          {/* GOOGLE BUTTON */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            disabled={googleLoading || loading}
            className="w-full border border-gray-300 dark:border-slate-700 dark:text-white py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed transition flex justify-center items-center gap-3"
          >

            <FaGoogle className="text-red-500" />

            {googleLoading
              ? "Connecting to Google..."
              : "Continue with Google"}

          </button>

          {/* LOGIN LINK */}
          <p className="text-center mt-8 text-gray-600 dark:text-gray-400">

            Already have an account?

            <Link
              to="/login"
              className="ml-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Login
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;
