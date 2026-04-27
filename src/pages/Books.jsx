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
    const delay = setTimeout(fetchBooks, 400);
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
  <div className="max-w-7xl mx-auto p-6">

    {/* HEADER */}
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-gray-800">📚 Books</h1>

      {isAdmin && (
        <button
          onClick={() => navigate("/admin/add-book")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow"
        >
          + Add Book
        </button>
      )}
    </div>

    {/* FILTERS */}
    <div className="grid md:grid-cols-3 gap-4 mb-8">
      <input
        placeholder="🔍 Search books..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-300"
      />

      <select
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        className="border p-3 rounded-lg"
      >
        <option value="">All Genres</option>
        <option value="Fiction">Fiction</option>
        <option value="Non-Fiction">Non-Fiction</option>
      </select>

      <select
        value={available}
        onChange={(e) => setAvailable(e.target.value)}
        className="border p-3 rounded-lg"
      >
        <option value="">All Status</option>
        <option value="true">Available</option>
        <option value="false">Borrowed</option>
      </select>
    </div>

    {/* LIST */}
    {loading ? (
      <div className="grid md:grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map((i) => (
          <div key={i} className="animate-pulse bg-gray-200 h-60 rounded-xl"></div>
        ))}
      </div>
    ) : books.length === 0 ? (
      <div className="text-center py-20">
        <p className="text-xl text-gray-500">No books found 📭</p>
        <p className="text-sm text-gray-400">Try changing filters</p>
      </div>
    ) : (
      <div className="grid md:grid-cols-3 gap-6">
        {books.map((b) => (
          <div
            key={b._id}
            onClick={() => navigate(`/book/${b._id}`)}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 cursor-pointer group"
          >
            {/* IMAGE */}
            <div className="overflow-hidden rounded-lg">
              <img
                src={b.image || "https://via.placeholder.com/150"}
                onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                className="w-full h-44 object-cover group-hover:scale-105 transition"
              />
            </div>

            {/* CONTENT */}
            <div className="mt-4">
              <h3 className="font-semibold text-lg text-gray-800">
                {b.title}
              </h3>

              <p className="text-sm text-gray-500">{b.author}</p>

              {/* STATUS BADGE */}
              <span
                className={`inline-block mt-2 px-3 py-1 text-xs rounded-full font-semibold ${
                  b.status === "Available"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {b.status}
              </span>
            </div>

            {/* ADMIN */}
            {isAdmin && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={(e) => handleEdit(b._id, e)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-1 rounded text-xs"
                >
                  Edit
                </button>

                <button
                  onClick={(e) => handleDelete(b._id, e)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 rounded text-xs"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);
}
export default Books