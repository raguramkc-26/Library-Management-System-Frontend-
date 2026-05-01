import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBooks } from "../../services/bookService";
import { toast } from "react-toastify";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";

const Books = () => {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchBooks();
  }, [page, debouncedSearch]);

  const fetchBooks = async () => {
    try {
      setLoading(true);

      const res = await getAllBooks({
        page,
        keyword: debouncedSearch,
      });

      setBooks(res?.data?.data || []);

    } catch {
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (!books.length)
    return <EmptyState title="No books found" />;

  return (
   <div className="p-6 space-y-6">

  <input
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search books..."
    className="w-full border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
  />

  <div className="grid md:grid-cols-3 gap-6">
    {books.map((b) => (
      <Card key={b._id} className="p-4 hover:shadow-lg transition">

        <h2 className="font-semibold text-lg">{b.title}</h2>

        <Button
          className="mt-3 w-full"
          onClick={() => navigate(`/book/${b._id}`)}
        >
          View Details
        </Button>

      </Card>
    ))}
  </div>

</div>
  );
};

export default Books;