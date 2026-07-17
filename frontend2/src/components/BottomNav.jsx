import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaStickyNote,
  FaStar,
} from "react-icons/fa";

const menu = [
  {
    title: "Home",
    icon: <FaHome />,
    path: "/dashboard",
  },
  {
    title: "Subjects",
    icon: <FaBook />,
    path: "/subject",
  },
  {
    title: "Notes",
    icon: <FaStickyNote />,
    path: "/notes",
  },
  {
    title: "Pinned",
    icon: <FaStar />,
    path: "/pinned",
  },
];

function BottomNav() {
  return (
    <div
      className="
      fixed
      bottom-0
      left-0
      right-0
      lg:hidden
      bg-white
      dark:bg-slate-900
      border-t
      dark:border-slate-700
      shadow-2xl
      z-50
    "
    >
      <div className="grid grid-cols-4">

        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center py-3 text-xs transition ${
                isActive
                  ? "text-blue-600"
                  : "text-gray-500 dark:text-gray-300"
              }`
            }
          >
            <span className="text-xl mb-1">
              {item.icon}
            </span>

            {item.title}
          </NavLink>
        ))}

      </div>
    </div>
  );
}

export default BottomNav;