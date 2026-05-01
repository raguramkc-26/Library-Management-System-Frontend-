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

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // fetch books
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

    } catch (err) {
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-center">

        <h1 className="text-2xl font-bold">
          Browse Books
        </h1>

        {/* SEARCH */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search books..."
          className="w-full md:w-80 border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        />

      </div>

      {/* EMPTY */}
      {books.length === 0 ? (
        <EmptyState title="No books found" />
      ) : (
        <>
          {/* GRID */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {books.map((b) => (
              <Card
                key={b._id}
                className="p-4 rounded-2xl shadow-md hover:shadow-xl transition flex flex-col"
              >

                {/* IMAGE */}
                <img
                  src={b.image || "https://via.placeholder.com/150"}
                  alt={b.title}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />

                {/* INFO */}
                <h2 className="font-semibold text-lg line-clamp-1">
                  {b.title}
                </h2>

                <p className="text-sm text-gray-500 line-clamp-1">
                  {b.author}
                </p>

                <p className="text-xs mt-1">
                  Status:{" "}
                  <span className="font-medium text-indigo-600">
                    {b.status}
                  </span>
                </p>

                {/* BUTTON */}
                <Button
                  className="mt-auto w-full mt-4"
                  onClick={() => navigate(`/book/${b._id}`)}
                >
                  View Details
                </Button>

              </Card>
            ))}

          </div>

          {/* PAGINATION */}
          <div className="flex justify-center gap-3 pt-4">

            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              Prev
            </button>

            <span className="px-4 py-2 font-medium">
              Page {page}
            </span>

            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Next
            </button>

          </div>
        </>
      )}

    </div>
  );
};

export default Books;