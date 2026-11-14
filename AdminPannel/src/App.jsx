
import { Navigate, Route, Routes } from "react-router-dom";

import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import AdminSections from "./pages/AdminSections";
import AdminUsers from "./pages/AdminUsers";
import AdminLayout from "./layouts/AdminLayout";
import AdminNotes from "./pages/AdminNotes";
import AdminMockTests from "./pages/AdminMockTests";
import AdminMarketplace from "./pages/AdminMarketplace";
import AdminSubscriptions from "./pages/AdminSubscriptions";
import AdminAIUsage from "./pages/AdminAIUsage";
import AdminPractice from "./pages/AdminPractice";

function App() {
  return (
    <Routes>
      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route
          index
          element={<Navigate to="/admin/dashboard" replace />}
        />

        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="notes" element={<AdminNotes />} />
        <Route path="mock-tests" element={<AdminMockTests />} />
        <Route path="marketplace" element={<AdminMarketplace />} />
        <Route path="subscriptions" element={<AdminSubscriptions />} />
        <Route path="ai-usage" element={<AdminAIUsage />} />

        {/* Practice Page */}
        <Route path="practice" element={<AdminPractice />} />
      </Route>

      {/* Default Redirect */}
      <Route
        path="/"
        element={<Navigate to="/admin/login" replace />}
      />

      {/* Unknown Routes */}
      <Route
        path="*"
        element={<Navigate to="/admin/login" replace />}
      />
    </Routes>
  );
}

export default App;
