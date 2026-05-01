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

    } catch (err) {
      console.error(err);

      setBooks([]);
      setStats({
        active: 0,
        overdue: 0,
        returned: 0,
      });

      toast.error(
        err?.response?.data?.message || "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  // LOADING STATE
  if (loading) return <Loader />;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">My Dashboard</h1>
        <p className="text-gray-500">
          Your reading overview
        </p>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard title="Active Books" value={stats.active} color="bg-indigo-500" />
        <StatCard title="Overdue Books" value={stats.overdue} color="bg-red-500" />
        <StatCard title="Returned Books" value={stats.returned} color="bg-green-500" />
      </div>

      {/* BOOK LIST */}
      <Card className="p-5 rounded-2xl shadow-lg">

        <h2 className="text-lg font-semibold mb-4">
          My Books
        </h2>

        {books.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            No books found
          </div>
        ) : (
          <div className="space-y-3">
            {books.map((b) => (
              <div
                key={b._id}
                className="flex justify-between items-center border rounded-lg p-3 hover:bg-gray-50 transition"
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={b.book?.image || "https://via.placeholder.com/50"}
                    alt="book"
                    className="w-12 h-16 object-cover rounded"
                  />

                  <div>
                    <p className="font-medium">
                      {b.book?.title || "No title"}
                    </p>
                    <p className="text-sm text-gray-400">
                      Due: {b.dueDate
                        ? new Date(b.dueDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <StatusBadge status={b.status} />
              </div>
            ))}
          </div>
        )}

      </Card>

    </div>
  );
};


// STAT CARD 
const StatCard = ({ title, value, color }) => (
  <div className={`p-5 rounded-2xl text-white shadow-lg ${color}`}>
    <p className="text-sm opacity-80">{title}</p>
    <h2 className="text-3xl font-bold">{value}</h2>
  </div>
);


// STATUS BADGE (
const StatusBadge = ({ status }) => {
  const styles =
    status === "borrowed"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-green-100 text-green-700";

  return (
    <span className={`text-xs px-3 py-1 rounded-full ${styles}`}>
      {status}
    </span>
  );
};

export default UserDashboard;