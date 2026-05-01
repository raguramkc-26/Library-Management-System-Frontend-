import { useEffect, useState } from "react";
import StatCard from "../../components/ui/StatCard";
import Loader from "../../components/ui/Loader";
import AdminChart from "../../components/charts/AdminChart";
import TopBooksChart from "../../components/charts/TopBooksChart";
import {
  BookOpen,
  Users,
  Bookmark,
  DollarSign
} from "lucide-react";

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
        <h1 className="text-2xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
        <p className="text-gray-500">
          Monitor system performance
        </p>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard title="Books" value={stats.books} icon={BookOpen} color="bg-indigo-500" />
        <StatCard title="Users" value={stats.users} icon={Users} color="bg-blue-500" />
        <StatCard title="Borrowed" value={stats.borrowed} icon={Bookmark} color="bg-yellow-500" />
        <StatCard title="Revenue" value={`₹${stats.revenue}`} icon={DollarSign} color="bg-green-500" />
      </div>

      {/* CHARTS */}
      <div className="grid lg:grid-cols-2 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="font-semibold mb-4">Monthly Trends</h2>
          <AdminChart data={monthly} />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="font-semibold mb-4">Top Books</h2>
          <TopBooksChart data={topBooks} />
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;