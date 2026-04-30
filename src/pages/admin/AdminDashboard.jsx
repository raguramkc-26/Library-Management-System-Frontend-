import { useEffect, useState } from "react";
import { getAdminStats, getMonthlyStats } from "../../services/adminService";
import Loader from "../../components/ui/Loader";
import Card from "../../components/ui/Card";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [monthly, setMonthly] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsRes, monthlyRes] = await Promise.all([
          getAdminStats(),
          getMonthlyStats(),
        ]);

        setStats(statsRes.data || {});
        setMonthly(monthlyRes || []);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <Card>Books: {stats.books}</Card>
    </div>
  );
};

export default AdminDashboard;