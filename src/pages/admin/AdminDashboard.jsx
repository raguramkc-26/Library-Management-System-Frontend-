import { useEffect, useState } from "react";
import { getBooks } from "../../services/bookService"; 
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import { toast } from "react-toastify";
import AdminChart from "../../components/charts/AdminChart";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [recent, setRecent] = useState([]);
  const [topBooks, setTopBooks] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [loading, setLoading] = useState(true);
  const res = await getBooks();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const [statsRes, recentRes, topRes, monthlyRes] =
        await Promise.all([
          instance.get("/admin/stats"),
          instance.get("/admin/recent"),
          instance.get("/admin/top-books"),
          instance.get("/admin/stats/monthly"),
        ]);

      setStats(statsRes?.data?.data || {});
      setRecent(recentRes?.data?.data || []);
      setTopBooks(topRes?.data?.data || []);
      setMonthly(monthlyRes?.data?.data || []);

    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if  (loading) return <Loader />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500">Library analytics & insights</p>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-5 gap-6">
        <Stat title="Books" value={stats.books || 0} color="bg-indigo-500" />
        <Stat title="Users" value={stats.users || 0} color="bg-blue-500" />
        <Stat title="Borrowed" value={stats.borrowed || 0} color="bg-yellow-500" />
        <Stat title="Overdue" value={stats.overdue || 0} color="bg-red-500" />
        <Stat title="Revenue" value={`₹${stats.revenue || 0}`} color="bg-green-500" />
      </div>

      {/* CHART */}
      <Card className="p-6 rounded-2xl shadow-lg">
        <AdminChart data={monthly} />
      </Card>

      {/* GRID */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* RECENT */}
        <Card className="p-5 rounded-2xl shadow-lg">
          <h2 className="font-semibold mb-4">Recent Activity</h2>

          {recent.length === 0 ? (
            <p className="text-gray-400">No activity</p>
          ) : (
            recent.map((r) => (
              <div key={r._id} className="flex justify-between border-b py-2">
                <p className="text-sm">{r.book?.title}</p>
                <span className="text-xs text-gray-400">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </Card>

        {/* TOP BOOKS */}
        <Card className="p-5 rounded-2xl shadow-lg">
          <h2 className="font-semibold mb-4">Top Books</h2>

          {topBooks.length === 0 ? (
            <p className="text-gray-400">No data</p>
          ) : (
            topBooks.map((b) => (
              <div key={b._id} className="flex justify-between border-b py-2">
                <p>{b.title}</p>
                <span className="text-sm text-gray-400">
                  {b.borrowCount || 0} borrows
                </span>
              </div>
            ))
          )}
        </Card>

      </div>

    </div>
  );
};

const Stat = ({ title, value, color }) => (
  <div className={`p-5 rounded-2xl text-white shadow-lg ${color}`}>
    <p className="text-sm opacity-80">{title}</p>
    <h2 className="text-2xl font-bold">{value}</h2>
  </div>
);

export default AdminDashboard;