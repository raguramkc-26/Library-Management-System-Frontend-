import { useAuth } from "../context/AuthContext";

const Topbar = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <div>
        <h2 className="text-lg font-semibold">
          Welcome, {user?.name}
        </h2>
        <p className="text-sm text-gray-500">
          Manage your library efficiently
        </p>
      </div>
    </div>
  );
};

export default Topbar;