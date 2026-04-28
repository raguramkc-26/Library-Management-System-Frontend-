import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center bg-white px-6 py-4 shadow-sm border-b">

      <div>
        <h1 className="text-lg font-semibold text-gray-800">
          Welcome, {user?.name || "User"}
        </h1>
        <p className="text-sm text-gray-500">
          Manage your library efficiently
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Topbar;