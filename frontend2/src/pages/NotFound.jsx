import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-950 px-6">
      <div className="text-center max-w-lg">
        <h1 className="text-8xl font-extrabold text-blue-600">
          404
        </h1>

        <h2 className="mt-4 text-3xl font-bold dark:text-white">
          Oops! Page Not Found
        </h2>

        <p className="mt-4 text-gray-600 dark:text-gray-400">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/dashboard"
          className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotFound;