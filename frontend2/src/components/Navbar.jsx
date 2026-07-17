
import { useState, useEffect, useRef } from "react";
import {
  FaMoon,
  FaSun,
  FaSearch,
  
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";

function Navbar({ openSidebar, publicPage = false, }) {
  const navigate = useNavigate();
  const { user,  logout} = useAuth();
const currentUser = publicPage ? null : user;
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const dropdownRef = useRef(null);

  const email = localStorage.getItem("email");

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

const handleLogout = () => {
   
  logout();    
     console.log("Current URL before redirect:", window.location.pathname);         
    setTimeout(() => {
    navigate("/", { replace: true });
  }, 0);
};

  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/search/${search}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 shadow-sm">

      <div className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">

      

        <div className="flex items-center gap-3">

         

        
        
         <h1
  onClick={() => navigate(publicPage ? "/" : "/dashboard")}
  className="text-2xl font-extrabold text-blue-600 cursor-pointer select-none"
>
  OrganizeNotes
</h1>

        </div>

     
        <div className="flex items-center gap-2 sm:gap-4">

      

          {!publicPage&&(
            <div className="hidden md:flex items-center bg-gray-100 dark:bg-slate-800 rounded-xl px-4 py-2 w-72">

            <FaSearch className="text-gray-500" />

            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              className="ml-3 w-full bg-transparent outline-none text-gray-700 dark:text-white placeholder-gray-500"
            />

          </div>
          )}

  

          <button
            onClick={() => setDark(!dark)}
            className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 transition"
          >
            {dark ? (
              <FaSun className="text-yellow-400 text-xl" />
            ) : (
              <FaMoon className="text-slate-700 text-xl" />
            )}
          </button>

         

          {!publicPage && user && (
  <div
    className="relative"
    ref={dropdownRef}
  >
    <button
      onClick={() => setProfileOpen(!profileOpen)}
    >
      <Avatar
        name={user.name}
        email={user.email}
      />
    </button>

    {profileOpen && (
      <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-gray-200 dark:border-slate-700 p-5">

        <div className="border-b border-gray-200 dark:border-slate-700 pb-3">

          <h3 className="font-bold dark:text-white">
            {user.name}
          </h3>

          <p className="text-sm text-gray-500 break-all">
            {user.email}
          </p>

        </div>

        <button
          onClick={() => {
            setProfileOpen(false);
            navigate("/profile");
          }}
          className="w-full text-left py-3 hover:text-blue-600 dark:text-white"
        >
          👤 My Profile
        </button>

        <button
          onClick={handleLogout}
          className="w-full text-left py-3 text-red-500"
        >
          🚪 Logout
        </button>

      </div>
    )}
  </div>
)}

        </div>

      </div>

    </header>
  );
}

export default Navbar;

