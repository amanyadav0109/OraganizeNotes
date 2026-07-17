import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import { useAuth } from "../context/AuthContext";
import { updateName } from "../services/userService";

function EditName() {
  const { user, login } = useAuth();

  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");

  const [loading, setLoading] = useState(false);

  const save = async () => {
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    try {
      setLoading(true);

      await updateName(name);

      login(localStorage.getItem("token"), {
        ...user,
        name,
      });

      alert("Display name updated successfully.");

      navigate("/profile");
    } catch (err) {
      console.log(err);
      alert("Unable to update name.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-10 pb-24 lg:pb-10">

          <div className="max-w-xl mx-auto">

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border dark:border-slate-700 p-6 sm:p-8">

              <h1 className="text-2xl sm:text-3xl font-bold dark:text-white">
                ✏️ Edit Display Name
              </h1>

              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Change the name shown on your profile.
              </p>

              <div className="mt-8">

                <label className="block mb-2 font-semibold dark:text-white">
                  Display Name
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-8">

                <button
                  onClick={() => navigate("/profile")}
                  className="flex-1 border rounded-xl py-3 hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-white transition"
                >
                  Cancel
                </button>

                <button
                  onClick={save}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 transition disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>

              </div>

            </div>

          </div>

        </main>

      </div>
    </div>
  );
}

export default EditName;