import { useEffect, useState } from "react";
import instance from "../../instances/instance";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [topBooks, setTopBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const [statsRes, recentRes, topRes] = await Promise.all([
        instance.get("/admin/stats"),
        instance.get("/admin/recent"),
        instance.get("/admin/top-books"),
      ]);

      setStats(statsRes?.data || {});
      setRecent(recentRes?.data || []);
      setTopBooks(topRes?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (!stats) return <p className="p-6">No data</p>;

  return (
    <div className="p-6 space-y-6">

      {/* STATS */}
      <div className="grid md:grid-cols-5 gap-4">
        <Stat title="Books" value={stats.books} />
        <Stat title="Users" value={stats.users} />
        <Stat title="Borrowed" value={stats.borrowed} />
        <Stat title="Overdue" value={stats.overdue} />
        <Stat title="Revenue" value={`₹${stats.revenue}`} />
      </div>

      {/* RECENT ACTIVITY */}
      <Card className="p-4">
        <h2 className="font-semibold mb-3">Recent Activity</h2>
        {recent.length === 0 ? (
          <p className="text-gray-400">No activity</p>
        ) : (
          recent.map((r, i) => (
            <p key={i} className="text-sm border-b py-2">
              {r.message || JSON.stringify(r)}
            </p>
          ))
        )}
      </Card>

      {/* TOP BOOKS */}
      <Card className="p-4">
        <h2 className="font-semibold mb-3">Top Books</h2>
        {topBooks.length === 0 ? (
          <p className="text-gray-400">No data</p>
        ) : (
          topBooks.map((b) => (
            <p key={b._id} className="border-b py-2">
              {b.title}
            </p>
          ))
        )}
      </Card>

    </div>
  );
};

const Stat = ({ title, value }) => (
  <Card className="p-4 text-center">
    <p className="text-gray-500 text-sm">{title}</p>
    <h2 className="text-2xl font-bold">{value}</h2>
  </Card>
);

export default AdminDashboard;