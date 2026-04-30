import { useEffect, useState } from "react";
import { getMyBorrowings } from "../../services/bookService";
import { toast } from "react-toastify";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";

const UserDashboard = () => {
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({
    active: 0,
    overdue: 0,
    returned: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await getMyBorrowings();
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
        returned: data.filter((b) => b.status === "returned").length,
      });

    } catch {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <p className="text-gray-500">Your reading overview</p>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard title="Active" value={stats.active} color="bg-indigo-500" />
        <StatCard title="Overdue" value={stats.overdue} color="bg-red-500" />
        <StatCard title="Returned" value={stats.returned} color="bg-green-500" />
      </div>

      {/* BOOKS */}
      <Card className="p-5 rounded-2xl shadow-lg">
        <h2 className="text-lg font-semibold mb-4">My Books</h2>

        {books.length === 0 ? (
          <p className="text-gray-400 text-center">No books found</p>
        ) : (
          books.map((b) => (
            <div
              key={b._id}
              className="flex justify-between items-center border-b py-3 hover:bg-gray-50 rounded-lg px-2 transition"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={b.book?.image || "https://via.placeholder.com/50"}
                  className="w-12 h-16 object-cover rounded"
                />

                <div>
                  <p className="font-medium">{b.book?.title}</p>
                  <p className="text-sm text-gray-400">
                    Due: {new Date(b.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  b.status === "borrowed"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {b.status}
              </span>
            </div>
          ))
        )}
      </Card>

    </div>
  );
};

const StatCard = ({ title, value, color }) => (
  <div className={`p-5 rounded-2xl text-white shadow-lg ${color}`}>
    <p className="text-sm opacity-80">{title}</p>
    <h2 className="text-3xl font-bold">{value}</h2>
  </div>
);

export default UserDashboard;