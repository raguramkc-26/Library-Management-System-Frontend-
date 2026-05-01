import { useEffect, useState } from "react";
import StatCard from "../../components/ui/StatCard";
import Loader from "../../components/ui/Loader";
import AdminChart from "../../components/charts/AdminChart";
import TopBooksChart from "../../components/charts/TopBooksChart";

import {
  getAdminStats,
  getMonthlyStats,
  getTopBooks
} from "../../services/adminService";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    books: 0,
    users: 0,
    borrowed: 0,
    revenue: 0,
  });

  const [monthly, setMonthly] = useState([]);
  const [topBooks, setTopBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const [statsRes, monthlyRes, topBooksRes] = await Promise.all([
        getAdminStats(),
        getMonthlyStats(),
        getTopBooks(),
      ]);

      setStats(statsRes?.data?.data || {});
      setMonthly(monthlyRes?.data?.data || []);
      setTopBooks(topBooksRes?.data?.data || []);

    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500">
          Monitor library performance & analytics
        </p>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard title="Books" value={stats.books} color="from-indigo-500 to-indigo-700" />
        <StatCard title="Users" value={stats.users} color="from-blue-500 to-blue-700" />
        <StatCard title="Borrowed" value={stats.borrowed} color="from-yellow-500 to-yellow-700" />
        <StatCard title="Revenue" value={`₹${stats.revenue}`} color="from-green-500 to-green-700" />
      </div>

      {/* CHARTS */}
      <div className="grid lg:grid-cols-2 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">
            Monthly Borrow Trends
          </h2>
          <AdminChart data={monthly} />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">
            Top Borrowed Books
          </h2>
          <TopBooksChart data={topBooks} />
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;