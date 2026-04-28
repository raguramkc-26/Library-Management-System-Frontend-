import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"
import { getMe } from "../services/authServices";
import instance from "../instances/instance";
import { toast } from "react-toastify";
const Profile = () => {
  const { user } = useAuth();
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
    fetchProfile();
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getMe();
      setUser(res?.user);

      const borrows = await instance.get("/borrow/me");
      setBorrowings(borrows.data?.data || borrows.data?.borrowings || []);
    } catch (err) {
      console.log("PROFILE ERROR:", err);
      toast.error(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Profile</h1>

      {user && (
        <div className="bg-white p-4 rounded shadow mb-4">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
        </div>
      )}

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Borrow History</h2>

        {borrowings.length === 0 && <p>No history</p>}

        {borrowings.map((b) => (
          <div key={b._id} className="border-b py-2">
            <p>{b.book?.title}</p>
            <p className="text-sm text-gray-500">{b.status}</p>
            <p className="text-xs text-gray-400">
              Due: {new Date(b.dueDate).toLocaleDateString()}
            </p>
            {b.fineAmount > 0 && (
              <p className="text-red-500 text-xs">
                Fine: ₹{b.fineAmount} 
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;