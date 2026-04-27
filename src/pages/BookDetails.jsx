import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import instance from "../instances/instance";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const BookDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState("");
  const [borrowing, setBorrowing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [bookRes, reviewRes] = await Promise.all([
        instance.get(`/books/${id}`),
        instance.get(`/reviews/${id}`),
      ]);

      setBook(bookRes.data);
      setReviews(reviewRes.data.data || []);
    } catch {
      toast.error("Failed to load book");
    }
  };

  const handleBorrow = async () => {
    try {
      setBorrowing(true);
      await instance.post(`/borrow/${id}`);
      toast.success("Book borrowed successfully");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Borrow failed");
    } finally {
      setBorrowing(false);
    }
  };

  const handleReserve = async () => {
    try {
      await instance.post(`/reservation/${id}`);
      toast.success("Book reserved");
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  const handleReview = async () => {
    if (!rating) return toast.error("Select a rating");
    if (!comment.trim()) return toast.error("Write a comment");

    try {
      await instance.post(`/reviews/${id}`, { rating, comment });

      toast.success("Review submitted");
      setRating(0);
      setComment("");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Review failed");
    }
  };

  if (!book) return <p className="p-6 text-center">Loading book...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">

      {/* BOOK CARD */}
      <div className="bg-white rounded-xl shadow p-6 grid md:grid-cols-3 gap-6">

        {/* IMAGE */}
        <img
          src={book.image || "https://via.placeholder.com/150"}
          alt={book.title}
          className="w-40 h-60 object-cover rounded"
        />

        {/* DETAILS */}
        <div className="md:col-span-2 space-y-3">

          <h1 className="text-2xl font-bold">{book.title}</h1>
          <p className="text-gray-600">{book.author}</p>

          <p className="text-sm text-gray-500">Genre: {book.genre}</p>

          <p className="text-gray-700">{book.description}</p>

          {/* STATUS */}
          <p>
            Status:
            <span className={`ml-2 font-semibold ${
              book.status === "Available"
                ? "text-green-600"
                : "text-red-500"
            }`}>
              {book.status}
            </span>
          </p>

          {/* ROLE MESSAGE */}
          {user?.role !== "user" && (
            <p className="text-red-500 text-sm">
              Only users can borrow books
            </p>
          )}

          {/* ACTIONS */}
          <div className="mt-4 flex gap-3">

  {/* LOGIN MESSAGE */}
  {!user && (
    <p className="text-blue-500 text-sm">
      Please login to borrow books
    </p>
  )}

  {/* ROLE MESSAGE */}
  {user && user.role !== "user" && (
    <p className="text-red-500 text-sm">
      Only users can borrow books
    </p>
  )}

  {/* BORROW */}
  {user?.role === "user" && (
    <button
      onClick={handleBorrow}
      disabled={book.status !== "Available" || borrowing}
      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-5 py-2 rounded-lg"
    >
      {borrowing ? "Borrowing..." : "Borrow Book"}
    </button>
  )}

  {/* RESERVE */}
  {user?.role === "user" && book.status !== "Available" && (
    <button
      onClick={handleReserve}
      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
    >
      Reserve Book
    </button>
  )}

</div>

        </div>
      </div>

      {/* REVIEW FORM */}
      {user && (
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold text-lg mb-3">Add Review</h2>

          {/* STAR RATING */}
          <div className="flex gap-2 text-2xl mb-3">
            {[1,2,3,4,5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(null)}
                className={`transition ${
                  (hover || rating) >= star
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>

          {/* INPUT */}
          <textarea
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border p-3 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />

          <button
            onClick={handleReview}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            Submit Review
          </button>
        </div>
      )}

      {/* REVIEWS */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="font-semibold text-lg mb-4">Reviews</h2>

        {reviews.length === 0 ? (
          <p className="text-gray-400 text-center">
            No reviews yet. Be the first to review!
          </p>
        ) : (
          reviews.map((r) => (
            <div
              key={r._id}
              className="border-b py-3 last:border-none"
            >
              <div className="flex justify-between items-center">
                <p className="font-medium">{r.user?.name}</p>
                <span className="text-yellow-500 text-sm">
                  {"★".repeat(r.rating)}
                </span>
              </div>

              <p className="text-gray-700 mt-1">{r.comment}</p>

              <p className="text-xs text-gray-400 mt-1">
                {new Date(r.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default BookDetails;