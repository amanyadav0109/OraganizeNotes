import { Routes, Route } from "react-router-dom";
import Notes from "./pages/Notes";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SubjectNotes from "./pages/SubjectNotes";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Pinned from "./pages/Pinned";

import Search from "./pages/Search";
import EditName from "./pages/EditName";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import NoteDetails from "./pages/NoteDetails.jsx";
import Subject from "./pages/Subject";
import NotFound from "./pages/NotFound";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
   
      <Route path="/login" element={<Login />} />
      <Route path="/subject" element={<Subject />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/note/:id"
        element={
          <ProtectedRoute>
            <NoteDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/edit-name"
        element={
          <ProtectedRoute>
            <EditName />
          </ProtectedRoute>
        }
      />
      <Route path="/user/:id" element={<PublicProfile />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/subject/:id"
        element={
          <ProtectedRoute>
            <SubjectNotes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search/:query"
        element={
          <ProtectedRoute>
            <Search />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notes"
        element={
          <ProtectedRoute>
            <Notes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pinned"
        element={
          <ProtectedRoute>
            <Pinned />
          </ProtectedRoute>
        }
      />
       <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
