import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { signInWithPopup } from "firebase/auth";

import api from "../services/api";
import { auth, googleProvider } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
function Register() {

    const navigate = useNavigate();

        const { login } = useAuth();

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (
            !formData.name ||
            !formData.email ||
            !formData.password ||
            !formData.confirmPassword
        ) {
            alert("Please fill all fields");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {

            setLoading(true);

            const res = await api.post("/auth/register", {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            alert(res.data.message);

            navigate("/login");

        } catch (err) {

            alert(err.response?.data?.message || "Registration Failed");

        } finally {

            setLoading(false);

        }

    };
    const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    const idToken = await result.user.getIdToken();

    const response = await api.post("/auth/google", {
      idToken,
    });

    login(response.data.token, response.data.user);

    navigate("/dashboard", { replace: true });
  } catch (err) {
    console.log(err);
    alert("Google Login Failed");
  }
};

   return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 flex items-center justify-center px-4 py-10">
    <div className="grid lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden max-w-6xl w-full">

      {/* Left Side */}
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

        <div className="mt-10 space-y-4">

          <div className="flex items-center gap-3">
            📚 Organize Notes
          </div>

          <div className="flex items-center gap-3">
            🤖 AI Study Assistant
          </div>

          <div className="flex items-center gap-3">
            📌 Pin Important Notes
          </div>

          <div className="flex items-center gap-3">
            🔔 Reminder Notifications
          </div>

        </div>

      </div>

      {/* Right Side */}

      <div className="p-8 sm:p-10 lg:p-14">

        <div className="text-center">

          <h2 className="text-4xl font-bold text-gray-800">
            Create Account
          </h2>

          <p className="mt-3 text-gray-500">
            Join StudyHub today 🚀
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6"
        >

          <div>

            <label className="block mb-2 font-medium text-gray-700">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium text-gray-700">
              Password
            </label>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>

            </div>

          </div>

          <div>

            <label className="block mb-2 font-medium text-gray-700">
              Confirm Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />

          </div>

          <button
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold py-3 rounded-xl shadow-lg"
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        <div className="my-8 flex items-center">

          <div className="flex-1 border-t"></div>

          <span className="px-4 text-gray-500">
            OR
          </span>

          <div className="flex-1 border-t"></div>

        </div>

        <button
        onClick={handleGoogleLogin}
          className="w-full border border-gray-300 py-3 rounded-xl hover:bg-gray-50 transition flex justify-center items-center gap-3"
        >
          <FaGoogle className="text-red-500" />

          Continue with Google
        </button>

        <p className="text-center mt-8 text-gray-600">

          Already have an account?

          <Link
            to="/login"
            className="ml-2 text-indigo-600 font-semibold hover:underline"
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