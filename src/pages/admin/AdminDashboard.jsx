import { useEffect, useState } from "react";
import instance from "../../instances/instance";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [data, setData] = useState({
    books: 0,
    users: 0,
    borrowed: 0,
    overdue: 0,
    revenue: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await instance.get("/admin/dashboard");
      setData(res?.data?.data || res?.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* STATS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">

        <StatCard title="Books" value={data.books} color="blue" />
        <StatCard title="Users" value={data.users} color="green" />
        <StatCard title="Borrowed" value={data.borrowed} color="yellow" />
        <StatCard title="Overdue" value={data.overdue} color="red" />
        <StatCard title="Revenue" value={`₹${data.revenue}`} color="purple" />

      </div>

      {/* QUICK INSIGHT */}
      <Card className="p-4">
        <h2 className="font-semibold mb-2">System Insight</h2>

        <p className="text-sm text-gray-600">
          {data.overdue > 0
            ? `⚠️ ${data.overdue} overdue books need attention`
            : "All books are returned on time"}
        </p>
      </Card>

    </div>
  );
};

const StatCard = ({ title, value, color }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-700",
    purple: "bg-purple-100 text-purple-700",
  };

  return (
    <Card className={`p-4 ${colors[color]}`}>
      <p className="text-sm">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </Card>
  );
};

export default AdminDashboard;