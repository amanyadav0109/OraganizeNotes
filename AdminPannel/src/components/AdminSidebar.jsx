import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardList,
  ShoppingBag,
  CreditCard,
  BrainCircuit,
  Settings,
  LogOut,
  ShieldCheck,
  X,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users", path: "/admin/users", icon: Users },
  { name: "Notes", path: "/admin/notes", icon: FileText },
  { name: "Mock Tests", path: "/admin/mock-tests", icon: ClipboardList },
  { name: "Marketplace", path: "/admin/marketplace", icon: ShoppingBag },
  { name: "Subscriptions", path: "/admin/subscriptions", icon: CreditCard },
  { name: "AI Usage", path: "/admin/ai-usage", icon: BrainCircuit },
  
  { name: "Practice", path: "/admin/practice", icon: FileText },
];

function AdminSidebar({ open, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Actual logout will be connected to backend authentication later.
    navigate("/admin/login");
  };

  return (
    <>
      {open && (
        <button
          aria-label="Close sidebar overlay"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-950 text-white transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-800 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <ShieldCheck size={23} />
            </div>
            <div>
              <h1 className="text-lg font-bold">OrganizeNotes</h1>
              <p className="text-xs text-slate-400">Admin Panel</p>
            </div>
          </div>

          <button onClick={onClose} className="lg:hidden">
            <X size={21} />
          </button>
        </div>

        <div className="px-4 pt-7">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
            Main Menu
          </p>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`
                  }
                >
                  <Icon size={19} />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-slate-800 p-4">
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-slate-900 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold">
              A
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Administrator</p>
              <p className="text-xs text-slate-400">Platform Admin</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;