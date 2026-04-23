import { useEffect, useState } from "react";
import instance from "../instances/instance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({});
  const [recent, setRecent] = useState([]);
  const [topBooks, setTopBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
  try {
    const statsRes = await instance.get("/admin/stats");
    setStats(statsRes.data);

    const recentRes = await instance.get("/admin/recent");
    setRecent(recentRes.data);

    const topRes = await instance.get("/admin/top-books");
    setTopBooks(topRes.data);

  } catch (err) {
    console.error("Dashboard error:", err);
    toast.error(err.response?.data?.message || "Failed to load dashboard");
  } finally {
    setLoading(false);
  }
};
  const handleNotifyAll = async () => {
    const message = prompt("Enter notification message");

    if (!message) return;

    try {
      await instance.post("/admin/notify-all", { message });
      toast.success("Notification sent to all users");
    } catch (err) {
      toast.error("Failed to send notification");
    }
  };

  if (loading) return <p className="p-6">Loading dashboard...</p>;

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* STATS */}
      <div className="grid md:grid-cols-5 gap-4 mb-6">
        <Card title="Books" value={stats.totalBooks || 0} />
        <Card title="Users" value={stats.totalUsers || 0} />
        <Card title="Borrowed" value={stats.borrowed || 0} />
        <Card title="Overdue" value={stats.overdue || 0} />
        <Card title="Revenue" value={`₹${stats.revenue || 0}`} />
      </div>

      {/* ACTIONS */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => navigate("/admin/add-book")}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Add Book
        </button>

        <button
          onClick={handleNotifyAll}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Notify All
        </button>
      </div>

      {/* RECENT + TOP */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* RECENT */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="mb-4 font-semibold">Recent Activity</h2>

          {recent.length === 0 ? (
            <p>No activity</p>
          ) : (
            recent.map((r) => (
              <div key={r._id} className="flex justify-between py-2 border-b">
                <p>{r.book?.title || "Unknown"}</p>
                <span>{r.status}</span>
              </div>
            ))
          )}
        </div>

        {/* TOP BOOKS */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="mb-4 font-semibold">Top Books</h2>

          {topBooks.length === 0 ? (
            <p>No data</p>
          ) : (
            topBooks.map((b, i) => (
              <div key={i} className="flex justify-between py-2 border-b">
                <p>{b.book?.title || "Unknown Book"}</p>
                <span>{b.count} borrows</span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-white p-4 rounded-xl shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <h2 className="text-xl font-bold">{value}</h2>
  </div>
);

export default AdminDashboard;