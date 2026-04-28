import { useEffect, useState } from "react";
import instance from "../../instances/instance";
import { toast } from "react-toastify";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";

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
      console.error(err);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-4">

        <StatCard title="Active" value={stats.active} color="blue" />
        <StatCard title="Overdue" value={stats.overdue} color="red" />
        <StatCard title="Total Borrowed" value={stats.total} color="green" />

      </div>

      {/* BOOK LIST */}
      <Card>
        <h2 className="font-semibold mb-4">My Books</h2>

        {books.length === 0 ? (
          <EmptyState title="No books borrowed" />
        ) : (
          books.map((b) => {
            const isOverdue =
              b.status === "borrowed" &&
              new Date(b.dueDate) < new Date();

            return (
              <div
                key={b._id}
                className={`flex gap-4 border-b py-3 ${
                  isOverdue ? "bg-red-50" : ""
                }`}
              >
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

                <span
                  className={`text-sm font-semibold ${
                    isOverdue ? "text-red-600" : "text-gray-600"
                  }`}
                >
                  {isOverdue ? "Overdue" : b.status}
                </span>
              </div>
            );
          })
        )}
      </Card>

    </div>
  );
};

const StatCard = ({ title, value, color }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    red: "bg-red-100 text-red-700",
    green: "bg-green-100 text-green-700",
  };

  return (
    <Card className={`p-4 ${colors[color]}`}>
      <p className="text-sm">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </Card>
  );
};

export default UserDashboard;