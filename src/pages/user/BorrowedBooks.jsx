import { useEffect, useState } from "react";
import instance from "../../instances/instance";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";

const BorrowedBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBorrowed();
  }, []);

  const fetchBorrowed = async () => {
    try {
      const res = await instance.get("/borrow/me");
      setBooks(res?.data?.data || []);
    } catch (err) {
      console.error("Borrow fetch failed", err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (books.length === 0) {
    return (
      <EmptyState
        title="No borrowed books"
        subtitle="Start exploring and borrow books"
      />
    );
  }

  return (
    <div className="p-6 space-y-4">
      {books.map((b) => (
        <Card
          key={b._id}
          className="flex justify-between items-center p-4 hover:shadow-md transition"
        >
          <div className="flex gap-4 items-center">
            <img
              src={b.book?.image || "https://via.placeholder.com/100"}
              onError={(e) =>
                (e.target.src = "https://via.placeholder.com/100")
              }
              alt={b.book?.title}
              className="w-14 h-20 rounded object-cover"
            />

            <div>
              <h3 className="font-semibold">
                {b.book?.title || "Unknown Book"}
              </h3>

              <p className="text-sm text-gray-500">
                Due:{" "}
                {b.dueDate
                  ? new Date(b.dueDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              b.status === "returned"
                ? "bg-green-100 text-green-700"
                : b.status === "borrowed"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {b.status}
          </span>
        </Card>
      ))}
    </div>
  );
};

export default BorrowedBooks;