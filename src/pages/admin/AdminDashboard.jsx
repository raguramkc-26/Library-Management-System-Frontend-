import { useEffect, useState } from "react";
import instance from "../../instances/instance";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import { toast } from "react-toastify";
import AdminChart from "./AdminChart";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [topBooks, setTopBooks] = useState([]);
  const [monthly, setMonthly] = useState([]);

  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("30d");

  useEffect(() => {
    fetchDashboard();
  }, [range]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const [statsRes, recentRes, topRes, monthlyRes] = await Promise.all([
        instance.get("/admin/stats"),
        instance.get("/admin/recent"),
        instance.get("/admin/top-books"),
        instance.get(`/admin/stats/monthly?range=${range}`),
      ]);

      setStats(statsRes?.data?.data || {});
      setRecent(recentRes?.data?.data || []);
      setTopBooks(topRes?.data?.data || []);
      setMonthly(monthlyRes?.data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Dashboard failed");
    } finally {
      setLoading(false);
    }
  };

  // INSIGHTS LOGIC
  const insights = [];

  if (stats?.overdue > 5)
    insights.push("⚠️ High overdue rate");

  if (stats?.borrowed > stats?.books * 0.8)
    insights.push("🔥 Library usage is high");

  if (stats?.revenue === 0)
    insights.push("💡 No revenue generated");

  if (loading) return <Loader />;

  return (
    <div className="p-6 space-y-6">

      {/* FILTER */}
      <div className="flex gap-2">
        {["7d", "30d", "12m"].map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1 rounded ${
              range === r
                ? "bg-indigo-600 text-white"
                : "bg-gray-100"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-5 gap-4">
        <Stat title="Books" value={stats?.books || 0} />
        <Stat title="Users" value={stats?.users || 0} />
        <Stat title="Borrowed" value={stats?.borrowed || 0} />
        <Stat title="Overdue" value={stats?.overdue || 0} />
        <Stat title="Revenue" value={`₹${stats?.revenue || 0}`} />
      </div>

      {/* CHART */}
      <AdminChart data={monthly} />

      {/* INSIGHTS */}
      <Card className="p-4">
        <h2 className="font-semibold mb-2">Insights</h2>
        {insights.length === 0 ? (
          <p className="text-gray-400">No alerts</p>
        ) : (
          insights.map((i, idx) => (
            <p key={idx} className="text-sm">{i}</p>
          ))
        )}
      </Card>

      {/* LOWER GRID */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* RECENT */}
        <Card className="p-4">
          <h2 className="font-semibold mb-4">Recent Activity</h2>

          {recent.length === 0 ? (
            <p className="text-gray-400">No activity</p>
          ) : (
            recent.map((r) => (
              <div key={r._id} className="border-b py-2">
                <p className="font-medium">
                  {r.book?.title}
                </p>
                <p className="text-sm text-gray-500">
                  {r.borrower?.name} • {r.status}
                </p>
              </div>
            ))
          )}
        </Card>

        {/* TOP BOOKS */}
        <Card className="p-4">
          <h2 className="font-semibold mb-4">Top Books</h2>

          {topBooks.length === 0 ? (
            <p className="text-gray-400">No data</p>
          ) : (
            topBooks.map((b) => (
              <div key={b._id} className="flex justify-between border-b py-2">
                <p>{b.title}</p>
                <span className="text-sm text-gray-500">
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

const Stat = ({ title, value }) => (
  <Card className="p-4 text-center">
    <p className="text-gray-500 text-sm">{title}</p>
    <h2 className="text-2xl font-bold">{value}</h2>
  </Card>
);

export default AdminDashboard;