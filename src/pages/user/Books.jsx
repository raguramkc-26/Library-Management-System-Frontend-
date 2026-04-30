import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBooks } from "../../services/bookService"; 
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
  const [totalPages, setTotalPages] = useState(1);
  const res = await getBooks();

  // Debounce search 
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // reset page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch books
  useEffect(() => {
    console.log("Books component mounted");
    fetchBooks();
  }, [page, debouncedSearch]);

  const fetchBooks = async () => {
    try {
      console.log("API CALL START");
      setLoading(true);

      const res = await instance.get(
        `/books?page=${page}&keyword=${debouncedSearch}`
      );
      console.log("FULL RESPONSE:", res);
      console.log("DATA:", res.data);
      setBooks(Array.isArray(res?.data?.data) ? res.data.data : []);
      setTotalPages(res?.data?.totalPages || 1);

    } catch (err) {
      console.log("API ERROR:",err); 
      toast.error("Failed to load books"); 
    } finally {
      setLoading(false);
    }
  };

  // UI

  if  (loading) return <Loader />;
  if (!books.length)
    return (
     <EmptyState
     title="No books found"
     subtitle="Try another search"
     />
  );
  console.log("BOOKS STATE:", books);
  console.log("RENDER CHECK:", books.length); 

  return (
  <div className="p-6 space-y-6">

    {/* SEARCH */}
    <input
      type="text"
      placeholder="Search books..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
    />

    {/* LOADING */}
    {loading ? (
      <Loader />
    ) : books.length === 0 ? (
      <EmptyState title="No books found" subtitle="Try another search" />
    ) : (
      <div className="grid md:grid-cols-3 gap-6">
        {books.map((b) => (
          <Card key={b._id}>
            <img
              src={b.image || "https://via.placeholder.com/150"}
              onError={(e) =>
                (e.target.src = "https://via.placeholder.com/150")
              }
              className="w-full h-44 object-cover rounded"
            />

            <div className="mt-3 space-y-1">
              <h2 className="font-semibold text-lg">{b.title}</h2>
              <p className="text-sm text-gray-500">{b.author}</p>

              <span
                className={`text-xs font-semibold px-2 py-1 rounded ${
                  b.status === "Available"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {b.status}
              </span>
            </div>

            <div className="mt-4">
              <Button
                onClick={() => navigate(`/book/${b._id}`)}
                className="w-full"
              >
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>
    )}

    {/* PAGINATION */}
    {totalPages > 1 && !loading && (
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-1 border rounded disabled:opacity-40"
        >
          Prev
        </button>

        <span className="font-medium">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() =>
            setPage((p) => Math.min(p + 1, totalPages))
          }
          disabled={page === totalPages}
          className="px-4 py-1 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    )}
  </div>
);
};

export default Books;