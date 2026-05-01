import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  BookOpen,
  LayoutDashboard,
  User,
  Bell,
  Users,
  PlusCircle,
  LogOut,
  Bookmark,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userLinks = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Browse Books", path: "/dashboard/books", icon: Bookmark },
    { name: "My Books", path: "/dashboard/borrowed", icon: BookOpen },
    { name: "Profile", path: "/dashboard/profile", icon: User },
  ];

  const adminLinks = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Reviews", path: "/admin/reviews", icon: BookOpen },
    { name: "Add Book", path: "/admin/add-book", icon: PlusCircle },
  ];

  const links = user?.role === "admin" ? adminLinks : userLinks;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  <div className="w-64 bg-gray-900 text-gray-300 flex flex-col">

  {/* LOGO */}
  <div className="p-6 border-b border-gray-800">
    <h1 className="text-xl font-bold text-white">📚 LMS</h1>
    <p className="text-xs text-gray-400">
      {user?.role === "admin" ? "Admin Panel" : "User Panel"}
    </p>
  </div>

  {/* NAV */}
  <div className="flex-1 p-3 space-y-1">
    {links.map((link) => {
      const Icon = link.icon;

      return (
        <NavLink
          key={link.name}
          to={link.path}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                : "hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          <Icon size={18} />
          {link.name}
        </NavLink>
      );
    })}
  </div>
  </div>

      {/* LOGOUT */}
      <div className="p-3 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-900"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;