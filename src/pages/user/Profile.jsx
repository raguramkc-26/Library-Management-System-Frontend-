import { useEffect, useState } from "react";
import { getMe } from "../../services/authService";
import { toast } from "react-toastify";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { logout } = useAuth();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const res = await getMe();
        setUser(res?.data?.user || null);

      } catch (err) {
        console.error("Profile Error:", err);

        toast.error(
          err?.response?.data?.message || "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // LOADING STATE
  if (loading) return <Loader />;

  // NO USER
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No user data found</p>
      </div>
    );
  }

  return (
    <div className="p-6 flex justify-center">

      <Card className="w-full max-w-md p-6 rounded-2xl shadow-xl">

        {/* HEADER */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto bg-indigo-500 text-white flex items-center justify-center rounded-full text-xl font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <h2 className="text-xl font-bold mt-3">{user.name}</h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>

        {/* DETAILS */}
        <div className="space-y-3 text-sm">

          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">User ID</span>
            <span className="font-medium">{user._id}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Role</span>
            <span className="font-medium capitalize">
              {user.role}
            </span>
          </div>

        </div>

        {/* ACTIONS */}
        <button
          onClick={logout}
          className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>

      </Card>

    </div>
  );
};

export default Profile;