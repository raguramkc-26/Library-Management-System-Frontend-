import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../instances/instance";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Books = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [books, setBooks] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [genre, setGenre] = useState("");
  const [available, setAvailable] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchBooks();
    }, 400);
    return () => clearTimeout(delay);
  }, [keyword, genre, available, page]);

  const fetchBooks = async () => {
    try {
      setLoading(true);

      const res = await instance.get("/books", {
        params: { keyword, genre, available, page },
      });

      setBooks(res.data.books || []);
      setTotalPages(res.data.totalPages || 1);

    } catch {
      toast.error("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this book?")) return;

    try {
      await instance.delete(`/admin/books/${id}`);
      toast.success("Book deleted");
      fetchBooks();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (id, e) => {
    e.stopPropagation();
    navigate(`/admin/edit-book/${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Books</h1>

        {isAdmin && (
          <button
            onClick={() => navigate("/admin/add-book")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            + Add Book
          </button>
        )}
      </div>

      {/* GUIDE TEXT */}
      <p className="text-gray-500 mb-6">
        Browse books. Click a book to borrow or add a review.
      </p>

      {/* FILTERS */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <input
          placeholder="Search by title / author"
          value={keyword}
          onChange={handleFilterChange(setKeyword)}
          className="border p-2 rounded"
        />

        <select
          value={genre}
          onChange={handleFilterChange(setGenre)}
          className="border p-2 rounded"
        >
          <option value="">All Genres</option>
          <option value="Fiction">Fiction</option>
          <option value="Non-Fiction">Non-Fiction</option>
        </select>

        <select
          value={available}
          onChange={handleFilterChange(setAvailable)}
          className="border p-2 rounded"
        >
          <option value="">All Status</option>
          <option value="true">Available</option>
          <option value="false">Borrowed</option>
        </select>
      </div>

      {/* LIST */}
      {loading ? (
        <p className="text-center text-gray-500">Loading books...</p>
      ) : books.length === 0 ? (
        <p className="text-center text-gray-500">No books found</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {books.map((b) => (
            <div
              key={b._id}
              onClick={() => navigate(`/book/${b._id}`)}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition cursor-pointer"
            >
              <h3 className="font-bold text-lg">{b.title}</h3>
              <p className="text-gray-600 text-sm">{b.author}</p>
              <p className="text-xs mt-2 text-gray-500">{b.genre}</p>

              <span
                className={`mt-3 inline-block text-sm font-semibold ${
                  b.status === "Available"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {b.status}
              </span>

              {isAdmin && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={(e) => handleEdit(b._id, e)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Edit
                  </button>

                  <button
                    onClick={(e) => handleDelete(b._id, e)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

    </div>
  );
};

export default Books;