import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMyBorrowings } from "../../services/bookService";
import { toast } from "react-toastify";
import Loader from "../../components/ui/Loader";
import StatCard from "../../components/ui/StatCard";
import {
  BookOpen,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

const UserDashboard = () => {
  const { user, loading: authLoading } = useAuth();

  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({
    active: 0,
    overdue: 0,
    returned: 0,
  });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      fetchData();
    }
  }, [authLoading, user]);

  const fetchData = async () => {
    try {
      setDataLoading(true);

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
      toast.error("Failed to load dashboard");
    } finally {
      setDataLoading(false);
    }
  };

  if (authLoading || dataLoading) return <Loader />;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          My Dashboard
        </h1>
        <p className="text-gray-500">
          Your reading overview
        </p>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard title="Active" value={stats.active} icon={BookOpen} color="bg-indigo-500" />
        <StatCard title="Overdue" value={stats.overdue} icon={AlertTriangle} color="bg-red-500" />
        <StatCard title="Returned" value={stats.returned} icon={CheckCircle} color="bg-green-500" />
      </div>

      {/* BOOK LIST */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">My Books</h2>

        <div className="divide-y">
          {books.map((b) => (
            <div
              key={b._id}
              className="flex items-center justify-between py-4 hover:bg-gray-50 px-3 rounded-lg transition"
            >
              <div className="flex items-center gap-4">
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

              <span className={`text-xs px-3 py-1 rounded-full ${
                b.status === "borrowed"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}>
                {b.status}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default UserDashboard;