import { useEffect, useState } from "react";
import { getAdminStats, getMonthlyStats } from "../../services/adminService";
import Loader from "../../components/ui/Loader";
import Card from "../../components/ui/Card";
import AdminChart from "../../components/charts/AdminChart";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    books: 0,
    users: 0,
    borrowed: 0,
    revenue: 0,
  });

  const [monthly, setMonthly] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const [statsRes, monthlyRes] = await Promise.all([
          getAdminStats(),
          getMonthlyStats(),
        ]);

        // correct data extraction
        setStats(statsRes?.data?.data || statsRes?.data || {});

        // ensure array
        setMonthly(monthlyRes?.data?.data || monthlyRes?.data || []);

      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500">Monitor library performance</p>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard title="Books" value={stats.books} color="bg-indigo-500" />
        <StatCard title="Users" value={stats.users} color="bg-blue-500" />
        <StatCard title="Borrowed" value={stats.borrowed} color="bg-yellow-500" />
        <StatCard title="Revenue" value={`₹${stats.revenue}`} color="bg-green-500" />
      </div>

      {/* CHART */}
      <div className="mt-6">
        <AdminChart data={Array.isArray(monthly) ? monthly : []} />
      </div>

    </div>
  );
};

// STAT CARD
const StatCard = ({ title, value, color }) => (
  <div className={`p-5 rounded-2xl text-white shadow-lg ${color}`}>
    <p className="text-sm opacity-80">{title}</p>
    <h2 className="text-3xl font-bold">{value || 0}</h2>
  </div>
);

export default AdminDashboard;