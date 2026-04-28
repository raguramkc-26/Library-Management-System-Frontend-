import { useEffect, useState } from "react";
import instance from "../../instances/instance";
import { toast } from "react-toastify";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";

const PaymentHistory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBorrowed();
  }, []);

  const fetchBorrowed = async () => {
    try {
      setLoading(true);
      const res = await instance.get("/borrow/me");
      setData(res?.data?.data || []);
    } catch (err) {
      toast.error("Failed to load borrowed books");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (data.length === 0)
    return (
      <EmptyState
        title="No borrowed books"
        subtitle="Start borrowing books"
      />
    );

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">My Borrowed Books</h1>

      {data.map((b) => (
        <Card key={b._id}>
          <div className="flex gap-4 items-center">

            <img
              src={b.book?.image || "https://via.placeholder.com/60"}
              className="w-12 h-16 rounded"
            />

            <div className="flex-1">
              <p className="font-semibold">{b.book?.title}</p>
              <p className="text-sm text-gray-500">
                Due: {new Date(b.dueDate).toLocaleDateString()}
              </p>
            </div>

            <span
              className={`text-xs font-semibold px-2 py-1 rounded ${
                b.status === "returned"
                  ? "bg-green-100 text-green-600"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              {b.status}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default PaymentHistory;