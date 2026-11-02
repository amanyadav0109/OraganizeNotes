

import { useState } from "react";
import {
  FaBook,
  FaStickyNote,
  FaStar,
  FaClipboardList,
  FaChartBar,
  FaCalendarCheck,
  FaBrain,
  FaSignOutAlt,
  FaShoppingCart,
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/login");
  };

  const menuClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
    ${
      isActive
        ? "bg-blue-600 text-white shadow-md"
        : "hover:bg-slate-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300"
    }`;

  const closeSidebar = () => setOpen(false);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`
          fixed left-0 top-16
          h-[calc(100vh-4rem)]
          w-56
          bg-white dark:bg-slate-900
          border-r border-gray-200 dark:border-slate-700
          shadow-lg z-40
          overflow-y-auto
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <nav className="px-4 space-y-2 mt-5 pb-6">

          {/* Main Navigation */}
          <p className="px-3 mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
            Main Menu
          </p>

          <NavLink
            to="/dashboard"
            end
            className={menuClass}
            onClick={closeSidebar}
          >
            <FaBook />
            Dashboard
          </NavLink>

          <NavLink
            to="/subject"
            className={menuClass}
            onClick={closeSidebar}
          >
            <FaBook />
            Subjects
          </NavLink>

          <NavLink
            to="/notes"
            className={menuClass}
            onClick={closeSidebar}
          >
            <FaStickyNote />
            My Notes
          </NavLink>

          <NavLink
            to="/pinned"
            className={menuClass}
            onClick={closeSidebar}
          >
            <FaStar />
            Pinned Notes
          </NavLink>

          {/* Study Section */}
          <div className="pt-5">
            <p className="px-3 mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
              Study & Practice
            </p>

            <NavLink
              to="/practice"
              className={menuClass}
              onClick={closeSidebar}
            >
              <FaBrain />
              Practice
            </NavLink>

            <NavLink
              to="/mock-tests"
              className={menuClass}
              onClick={closeSidebar}
            >
              <FaClipboardList />
              Mock Tests
            </NavLink>

            <NavLink
              to="/analytics"
              className={menuClass}
              onClick={closeSidebar}
            >
              <FaChartBar />
              Analytics
            </NavLink>

            <NavLink
              to="/revision-plan"
              className={menuClass}
              onClick={closeSidebar}
            >
              <FaCalendarCheck />
              Revision Plan
            </NavLink>
          </div>

          {/* Notes Marketplace */}
          <div className="pt-5">
            <p className="px-3 mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
              Marketplace
            </p>

            <NavLink
              to="/find-notes"
              className={menuClass}
              onClick={closeSidebar}
            >
              <FaBook />
              Find Your Notes
            </NavLink>

            <NavLink
              to="/sell-notes"
              className={menuClass}
              onClick={closeSidebar}
            >
              <FaShoppingCart />
              Sell Your Notes
            </NavLink>

            <NavLink
              to="/my-uploaded-notes"
              className={menuClass}
              onClick={closeSidebar}
            >
              <FaStickyNote />
              My Uploaded Notes
            </NavLink>
          </div>

          {/* Logout */}
          <div className="pt-5 border-t border-gray-200 dark:border-slate-700">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>

        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
