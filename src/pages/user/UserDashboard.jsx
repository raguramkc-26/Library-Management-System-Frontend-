import { useEffect, useState } from "react";
import instance from "../../instances/instance";
import { toast } from "react-toastify";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import Button from "../../components/ui/Button";

const UserDashboard = () => {
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({
    active: 0,
    overdue: 0,
    returned: 0,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

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
        returned: data.filter((b) => b.status === "returned").length,
      });

    } catch (err) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (borrowId) => {
    try {
      setActionLoading(borrowId);

      await instance.post(`/borrow/return/${borrowId}`);
      toast.success("Returned successfully");

      fetchData();
    } catch (err) {
      toast.error("Return failed");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">My Dashboard</h1>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-4">
        <Stat title="Active" value={stats.active} />
        <Stat title="Overdue" value={stats.overdue} />
        <Stat title="Returned" value={stats.returned} />
      </div>

      {/* BOOK LIST */}
      <Card>
        <h2 className="font-semibold mb-4">My Books</h2>

        {books.length === 0 ? (
          <p className="text-gray-400 text-center">
            No books yet
          </p>
        ) : (
          books.map((b) => {
            const isOverdue =
              b.status === "borrowed" &&
              new Date(b.dueDate) < new Date();

            return (
              <div
                key={b._id}
                className="flex gap-4 border-b py-4 items-center"
              >
                <img
                  src={b.book?.image || "https://via.placeholder.com/40"}
                  className="w-12 h-16 rounded object-cover"
                />

                <div className="flex-1">
                  <p className="font-medium">{b.book?.title}</p>

                  <p className="text-sm text-gray-500">
                    Due: {new Date(b.dueDate).toLocaleDateString()}
                  </p>

                  {isOverdue && (
                    <p className="text-red-500 text-xs">
                      Overdue
                    </p>
                  )}
                </div>

                {/* STATUS */}
                <div className="text-right space-y-2">

                  <span className="text-sm block">
                    {b.status}
                  </span>

                  {b.status === "borrowed" && (
                    <Button
                      size="sm"
                      loading={actionLoading === b._id}
                      onClick={() => handleReturn(b._id)}
                    >
                      Return
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </Card>

    </div>
  );
};

const Stat = ({ title, value }) => (
  <Card className="p-4 text-center">
    <p className="text-gray-500">{title}</p>
    <h2 className="text-xl font-bold">{value}</h2>
  </Card>
);

export default UserDashboard;