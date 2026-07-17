import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  console.log("ProtectedRoute");
  console.log("User:", user);
  console.log("Loading:", loading);
  console.log("Path:", window.location.pathname);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!user) {
    console.log("Redirecting to login...");
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;