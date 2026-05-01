import { useAuth } from "../context/AuthContext";

const Topbar = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">

      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          Welcome back, {user?.name}
        </h2>
        <p className="text-sm text-gray-500">
          Manage your library efficiently
        </p>
      </div>

      <div className="flex items-center gap-4">

        {/* avatar */}
        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow">
          {user?.name?.charAt(0)}
        </div>

      </div>
    </div>
  );
};

export default Topbar;