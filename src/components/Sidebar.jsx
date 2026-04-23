import { NavLink } from "react-router-dom";
import { Home, Book, LayoutDashboard, User, Bell, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  const userLinks = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Books", path: "/dashboard/books", icon: Book },
    { name: "Profile", path: "/dashboard/profile", icon: User },
    { name: "Notifications", path: "/dashboard/notifications", icon: Bell },
  ];

  const adminLinks = [
    { name: "Admin Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Reviews", path: "/admin/reviews", icon: Book },
  ];

  const links = user?.role === "admin" ? adminLinks : userLinks;

  return (
    <div className="w-64 bg-gradient-to-b from-indigo-700 to-indigo-900 text-white min-h-screen p-5 shadow-xl">
      <h1 className="text-2xl font-bold mb-8">📚 LMS</h1>

      <div className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-white text-indigo-700 font-semibold shadow"
                    : "hover:bg-indigo-600"
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
  );
};

export default Sidebar;