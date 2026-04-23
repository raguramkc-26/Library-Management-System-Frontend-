import { useEffect, useState } from "react";
import instance from "../instances/instance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AdminChart from "../components/AdminChart";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({});
  const [recent, setRecent] = useState([]);
  const [topBooks, setTopBooks] = useState([]);
  const [chartData, setChartData] = useState([]);
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

      const chartRes = await instance.get("/admin/stats/monthly");
      setChartData(chartRes.data);

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Dashboard failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Skeleton />;

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* STATS */}
      <div className="grid md:grid-cols-5 gap-4">
        <Card title="Books" value={stats.totalBooks} color="bg-indigo-600" />
        <Card title="Users" value={stats.totalUsers} color="bg-green-600" />
        <Card title="Borrowed" value={stats.borrowed} color="bg-yellow-500" />
        <Card title="Overdue" value={stats.overdue} color="bg-red-500" />
        <Card title="Revenue" value={`₹${stats.revenue}`} color="bg-purple-600" />
      </div>

      {/* CHART */}
      <AdminChart data={chartData} />

      {/* ACTIONS */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/admin/add-book")}
          className="btn"
        >
          Add Book
        </button>

        <button
          onClick={() => alert("Add notification UI")}
          className="btn bg-green-600 hover:bg-green-700"
        >
          Notify All
        </button>
      </div>

      {/* CONTENT */}
      <div className="grid md:grid-cols-2 gap-6">

        <Section title="Recent Activity">
          {recent.length === 0 ? (
            <Empty />
          ) : (
            recent.map((r) => (
              <Item key={r._id} left={r.book?.title} right={r.status} />
            ))
          )}
        </Section>

        <Section title="Top Books">
          {topBooks.length === 0 ? (
            <Empty />
          ) : (
            topBooks.map((b, i) => (
              <Item key={i} left={b.book?.title} right={`${b.count} borrows`} />
            ))
          )}
        </Section>

      </div>
    </div>
  );
};

/* COMPONENTS */

const Card = ({ title, value, color }) => (
  <div className={`p-5 rounded-xl text-white shadow-lg ${color}`}>
    <p className="text-sm opacity-80">{title}</p>
    <h2 className="text-xl font-bold">{value || 0}</h2>
  </div>
);

const Section = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow">
    <h2 className="font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

const Item = ({ left, right }) => (
  <div className="flex justify-between border-b py-2">
    <p>{left || "Unknown"}</p>
    <span className="text-sm text-gray-500">{right}</span>
  </div>
);

const Empty = () => (
  <p className="text-gray-400 text-center py-4">No data</p>
);

const Skeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-6 bg-gray-300 w-1/3 rounded"></div>
    <div className="grid md:grid-cols-5 gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-20 bg-gray-300 rounded"></div>
      ))}
    </div>
  </div>
);

export default AdminDashboard;