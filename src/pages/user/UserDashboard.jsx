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
  <div className="space-y-6">

    <h1 className="text-2xl font-bold">
      My Dashboard
    </h1>

    {/* STATS */}
    <div className="grid md:grid-cols-3 gap-6">
      <StatCard title="Active" value={stats.active} color="bg-indigo-500" />
      <StatCard title="Overdue" value={stats.overdue} color="bg-red-500" />
      <StatCard title="Returned" value={stats.returned} color="bg-green-500" />
    </div>

    {/* BOOKS */}
    <Card>
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
}
export default UserDashboard;