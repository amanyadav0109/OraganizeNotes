
import { useState } from "react";
import {
  FaBook,
  FaStickyNote,
  FaStar,
  
  FaTimes,
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
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all
    ${
      isActive
        ? "bg-blue-600 text-white"
        : "hover:bg-slate-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300"
    }`;

  return (
    <>
    
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      

      <aside
        className={`
    fixed
    left-0
    top-16.5
        h-[calc(100vh-4rem)]
    w-56
    bg-white dark:bg-slate-900
    border-r border-gray-200 dark:border-slate-700
    shadow-lg
    z-40
    transform transition-transform duration-300
    ${open ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
  `}
      >
      

        

        <div className=" hidden lg:block h-6"></div>

       

        <nav className="px-4 space-y-2 mt-5">

          <NavLink
            to="/dashboard"
            className={menuClass}
            onClick={() => setOpen(false)}
          >
            <FaBook />
            Dashboard
          </NavLink>

          <NavLink
            to="/subject"
            className={menuClass}
            onClick={() => setOpen(false)}
          >
            <FaBook />
            Subjects
          </NavLink>

          <NavLink
            to="/notes"
            className={menuClass}
            onClick={() => setOpen(false)}
          >
            <FaStickyNote />
            All Notes
          </NavLink>

          <NavLink
            to="/pinned"
            className={menuClass}
            onClick={() => setOpen(false)}
          >
            <FaStar />
            Pinned Notes
          </NavLink>

        </nav>

      </aside>
    </>
  );
}

export default Sidebar;

