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
import instance from "../instances/instance";
import { toast } from "react-toastify";
import { useState } from "react";
import { sendNotification } from "../services/notificationService";
import Modal from "../components/ui/Modal";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showNotify, setShowNotify] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const userLinks = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Browse Books", path: "/dashboard/books", icon: Bookmark },
    { name: "My Borrowed Books", path: "/dashboard/borrowed", icon: BookOpen },
    { name: "Profile", path: "/dashboard/profile", icon: User },
    { name: "Notifications", path: "/dashboard/notifications", icon: Bell },
  ];

  const adminLinks = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Reviews", path: "/admin/reviews", icon: BookOpen },
    { name: "Add Book", path: "/admin/add-book", icon: PlusCircle },
    { name: "Notify All", action: "notify", icon: Bell },
  ];

  const links = user?.role === "admin" ? adminLinks : userLinks;

  const handleNotify = async () => {
    if (!message.trim()) return toast.error("Message required");

    try {
      setLoading(true);
      await instance.post("/admin/notify-all", { message });

      toast.success("Notification sent");
      setMessage("");
      setShowNotify(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r flex flex-col">

        {/* LOGO */}
        <div className="p-5 border-b">
          <h1 className="text-xl font-bold">📚 LMS</h1>
          <p className="text-xs text-gray-500 mt-1">
            {user?.role === "admin" ? "Admin Panel" : "User Panel"}
          </p>
        </div>

        {/* NAVIGATION */}
        <div className="flex-1 p-3 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;

            if (link.action === "notify") {
              return (
                <button
                  key={link.name}
                  onClick={() => setShowNotify(true)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-indigo-50 text-gray-700"
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
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                    isActive
                      ? "bg-indigo-100 text-indigo-600 font-semibold"
                      : "hover:bg-gray-100"
                  }`
                }
              >
                <Icon size={18} />
                {link.name}
              </NavLink>
            );
          })}
        </div>

        {/* LOGOUT */}
        <div className="p-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 text-red-500"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* MODAL */}
      {showNotify && (
        <Modal onClose={() => setShowNotify(false)}>
          <div className="space-y-4">

            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Send Notification
              </h2>
              <p className="text-sm text-gray-500">
                This will notify all users instantly
              </p>
            </div>

            <textarea
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
              rows={4}
            />

            <div className="flex justify-end gap-3 pt-2">

              <button
                onClick={() => setShowNotify(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleNotify}
                disabled={loading || !message.trim()}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Notification"}
              </button>

            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Sidebar;