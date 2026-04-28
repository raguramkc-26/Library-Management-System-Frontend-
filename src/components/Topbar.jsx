import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  }
  return (
    <div className="flex justify-between items-center bg-white px-6 py-4 shadow">
      <h1 className="text-lg font-semibold text-gray-700">
        Welcome, {user?.name || "User"}
      </h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Topbar;