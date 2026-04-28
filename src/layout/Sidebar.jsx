import { NavLink } from "react-router-dom";
import {
  Home,
  Book,
  LayoutDashboard,
  User,
  Bell,
  Users,
  PlusCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import instance from "../instances/instance";
import { toast } from "react-toastify";

const Sidebar = () => {
  const { user } = useAuth();

  const userLinks = [
    { name: "Home", path: "/dashboard", icon: Home },
    { name: "Browse Books", path: "/dashboard/books", icon: Book },
    { name: "My Borrowed Books", path: "/dashboard/borrowed", icon: Book },
    { name: "Profile", path: "/dashboard/profile", icon: User },
    { name: "Notifications", path: "/dashboard/notifications", icon: Bell },
  ];

  const adminLinks = [
    { name: "Admin Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Reviews", path: "/admin/reviews", icon: Book },

    // NEW
    { name: "Add Book", path: "/admin/add-book", icon: PlusCircle },

    // ACTION BUTTON
    { name: "Notify All", action: "notify", icon: Bell },
  ];

  const links = user?.role === "admin" ? adminLinks : userLinks;

  const handleNotify = async () => {
    const message = prompt("Enter notification message");
    if (!message) return;

    try {
      await instance.post("/admin/notify-all", { message });
      toast.success("Notification sent");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to notify");
    }
  };

  return (
    <div className="w-64 bg-indigo-600 text-white min-h-screen p-5 flex flex-col">

      <h1 className="text-xl font-bold mb-6">📚 LMS</h1>

      <div className="space-y-2 flex-1">

        {links.map((link) => {
          const Icon = link.icon;

          if (link.action === "notify") {
            return (
              <button
                key={link.name}
                onClick={handleNotify}
                className="w-full flex items-center gap-3 p-3 rounded hover:bg-indigo-500"
              >
                <Icon size={18} />
                {link.name}
              </button>
            );
          }

          return (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded transition ${
                  isActive
                    ? "bg-white text-indigo-600 font-semibold"
                    : "hover:bg-indigo-500"
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