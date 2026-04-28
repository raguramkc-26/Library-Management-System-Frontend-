import { useEffect, useState } from "react";
import instance from "../../instances/instance";
import { toast } from "react-toastify";

import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";

const UserDashboard = () => {
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({
    active: 0,
    overdue: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await instance.get("/borrow/me");
      const data = res?.data?.data || [];

      setBooks(data);

      const now = new Date();

      setStats({
        active: data.filter((b) => b.status === "borrowed").length,
        overdue: data.filter(
          (b) =>
            b.status === "borrowed" &&
            new Date(b.dueDate) < now
        ).length,
        total: data.length,
      });

    } catch (err) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">Welcome 👋</h1>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-4">
        <StatCard title="Active" value={stats.active} />
        <StatCard title="Overdue" value={stats.overdue} />
        <StatCard title="Total" value={stats.total} />
      </div>

      {/* BOOKS */}
      <Card>
        <h2 className="font-semibold mb-4">My Books</h2>

        {books.length === 0 ? (
          <p className="text-gray-400 text-center">No books borrowed</p>
        ) : (
          books.map((b) => (
            <div key={b._id} className="flex gap-4 border-b py-3">
              <img
                src={b.book?.image || "https://via.placeholder.com/40"}
                className="w-10 h-14 rounded"
              />

              <div className="flex-1">
                <p className="font-medium">{b.book?.title}</p>
                <p className="text-sm text-gray-500">
                  Due: {new Date(b.dueDate).toLocaleDateString()}
                </p>
              </div>

              <span className="text-sm">
                {b.status}
              </span>
            </div>
          ))
        )}
      </Card>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <Card>
    <p className="text-gray-500">{title}</p>
    <h2 className="text-xl font-bold">{value}</h2>
  </Card>
);

export default UserDashboard;