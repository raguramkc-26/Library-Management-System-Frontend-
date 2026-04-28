import { useEffect, useState } from "react";
import instance from "../../instances/instance";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";

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
      console.error("Dashboard error", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm">
          Overview of system performance
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">

        <Card className="p-4">
          <p className="text-sm text-gray-500">Books</p>
          <h2 className="text-2xl font-bold">{data.books}</h2>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-gray-500">Users</p>
          <h2 className="text-2xl font-bold">{data.users}</h2>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-gray-500">Borrowed</p>
          <h2 className="text-2xl font-bold">{data.borrowed}</h2>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-gray-500">Overdue</p>
          <h2 className="text-2xl font-bold">{data.overdue}</h2>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-gray-500">Revenue</p>
          <h2 className="text-2xl font-bold">₹{data.revenue}</h2>
        </Card>

      </div>

      <Card className="p-6 text-center text-gray-400">
        Chart feature coming soon
      </Card>

    </div>
  );
};

export default AdminDashboard;