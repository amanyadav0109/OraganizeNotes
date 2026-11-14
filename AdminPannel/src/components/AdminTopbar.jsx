
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Settings,
  LayoutDashboard,
  Users,
  FileText,
  ClipboardList,
  ShoppingBag,
  CreditCard,
  Sparkles,
  X,
  SearchX,
} from "lucide-react";

const adminPages = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    keywords: "overview home statistics",
    icon: LayoutDashboard,
  },
  {
    name: "Users",
    path: "/admin/users",
    keywords: "students customers",
    icon: Users,
  },
  {
    name: "Notes",
    path: "/admin/notes",
    keywords: "study material documents",
    icon: FileText,
  },
  {
    name: "Mock Tests",
    path: "/admin/mock-tests",
    keywords: "exams tests questions",
    icon: ClipboardList,
  },
  {
    name: "Marketplace",
    path: "/admin/marketplace",
    keywords: "sales purchases earnings",
    icon: ShoppingBag,
  },
  {
    name: "Subscriptions",
    path: "/admin/subscriptions",
    keywords: "premium payments revenue",
    icon: CreditCard,
  },
  {
    name: "AI Usage",
    path: "/admin/ai-usage",
    keywords: "artificial intelligence requests",
    icon: Sparkles,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    keywords: "configuration preferences",
    icon: Settings,
  },
];

function AdminTopbar({ onMenuClick }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  // Logged-in admin information
  const admin = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("getnotesAdmin") || "{}");
    } catch {
      return {};
    }
  }, []);

  const adminName = admin?.name || admin?.username || "Administrator";
  const adminEmail = admin?.email || "Admin Account";

  const initials = adminName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

  // Current page title
  const currentPage =
    adminPages.find((page) => page.path === location.pathname)?.name ||
    "Admin Overview";

  // Search pages
  const filteredPages = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return [];

    return adminPages.filter((page) => {
      return (
        page.name.toLowerCase().includes(query) ||
        page.keywords.toLowerCase().includes(query)
      );
    });
  }, [search]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowSearch(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfile(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowSearch(false);
        setShowProfile(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Navigate to selected page
  const handleSearchNavigate = (path) => {
    navigate(path);
    setSearch("");
    setShowSearch(false);
  };

  // Logout admin
  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) return;

    localStorage.removeItem("getnotesAdminToken");
    localStorage.removeItem("getnotesAdmin");

    navigate("/admin/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xl sm:px-6 lg:px-8">

      {/* LEFT SECTION */}
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">

        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div className="min-w-0">
          <h2 className="truncate text-base font-bold text-slate-900 sm:text-lg">
            {currentPage}
          </h2>

          <p className="hidden text-xs text-slate-500 sm:block">
            Manage and monitor your OrganizeNotes platform
          </p>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-1.5 sm:gap-3">


       

       

        {/* PROFILE */}
        <div ref={profileRef} className="relative">

          <button
            type="button"
            onClick={() => {
              setShowProfile((prev) => !prev);
              setShowNotifications(false);
              setShowSearch(false);
            }}
            className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-100"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
              {initials || "A"}
            </div>

            <div className="hidden text-left sm:block">
              <p className="max-w-28 truncate text-sm font-semibold text-slate-800">
                {adminName}
              </p>

              <p className="text-xs text-slate-400">
                Administrator
              </p>
            </div>

            <ChevronDown
              size={16}
              className={`hidden text-slate-500 transition sm:block ${
                showProfile ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* PROFILE DROPDOWN */}
          {showProfile && (
            <div className="absolute right-0 top-14 z-50 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

              <div className="border-b border-slate-100 px-4 py-4">
                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                    {initials || "A"}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-800">
                      {adminName}
                    </p>

                    <p className="truncate text-xs text-slate-400">
                      {adminEmail}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-2">

                <button
                  type="button"
                  onClick={() => {
                    setShowProfile(false);
                    navigate("/admin/settings");
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  <User size={17} />
                  Account Settings
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <LogOut size={17} />
                  Logout
                </button>

              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}

export default AdminTopbar;
