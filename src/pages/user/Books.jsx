import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../instances/instance";
import { toast } from "react-toastify";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";

const Books = () => {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await instance.get("/books");
      setBooks(res?.data?.books || []);
    } catch (err) {
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (books.length === 0)
    return <EmptyState title="No books found" subtitle="Try adding books" />;

  return (
    <div className="p-6 grid md:grid-cols-3 gap-6">
      {books.map((b) => (
        <Card key={b._id} className="cursor-pointer hover:shadow-lg transition">
          <img
            src={b.image || "https://via.placeholder.com/150"}
            className="w-full h-44 object-cover rounded"
          />

          <div className="mt-3 space-y-1">
            <h2 className="font-semibold text-lg">{b.title}</h2>
            <p className="text-sm text-gray-500">{b.author}</p>

            <span
              className={`text-xs font-semibold ${
                b.status === "Available"
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {b.status}
            </span>
          </div>

          <div className="mt-3">
            <Button onClick={() => navigate(`/book/${b._id}`)}>
              View Details
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Books;