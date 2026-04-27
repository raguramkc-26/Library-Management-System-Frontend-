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
      toast.success("Book borrowed");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message);
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
    if (!rating) return toast.error("Select rating");
    if (!comment.trim()) return toast.error("Write a comment");

    try {
      await instance.post(`/reviews/${id}`, { rating, comment });

      toast.success("Review submitted for approval");
      setRating(0);
      setComment("");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add review");
    }
  };

  if (!book) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto p-6 space-y-6">

        {/* BOOK */}
        <div className="bg-white rounded-xl shadow p-6 grid md:grid-cols-3 gap-6">

          <img
            src={book.image || "https://via.placeholder.com/150"}
            alt={book.title}
            className="w-40 h-60 object-cover rounded"
          />

          <div className="md:col-span-2 space-y-3">
            <h1 className="text-2xl font-bold">{book.title}</h1>
            <p className="text-gray-600">{book.author}</p>
            <p className="text-gray-700">{book.description}</p>

            <p>
              Status:
              <span className={`ml-2 font-semibold ${
                book.status === "Available" ? "text-green-600" : "text-red-500"
              }`}>
                {book.status}
              </span>
            </p>

            <div className="flex gap-3 mt-4">
              {book.status === "Available" && user?.role === "user" ? (
                <button
                  onClick={handleBorrow}
                  disabled={borrowing}
                  className="bg-green-600 disabled:bg-gray-400 text-white px-5 py-2 rounded-lg"
                >
                  {borrowing ? "Borrowing..." : "Borrow Book"}
                </button>
              ) : (
                <button
                  onClick={handleReserve}
                  className="bg-yellow-500 text-white px-4 py-2 rounded"
                >
                  Reserve
                </button>
              )}
            </div>
          </div>
        </div>

        {/* REVIEW */}
        {user && (
          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-semibold mb-3">Add Review</h2>

            <div className="flex gap-2 text-2xl mb-2">
              {[1,2,3,4,5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(null)}
                  className={(hover || rating) >= star ? "text-yellow-400" : "text-gray-300"}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              placeholder="Write your review"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border p-2 rounded mb-2"
            />

            <button
              onClick={handleReview}
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Submit Review
            </button>
          </div>
        )}

        {/* REVIEWS */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Reviews</h2>

          {reviews.length === 0 ? (
            <p>No reviews yet</p>
          ) : (
            reviews.map((r) => (
              <div key={r._id} className="border-b py-2">
                <p className="font-medium">{r.user?.name}</p>
                <p className="text-yellow-600 text-sm">⭐ {r.rating}</p>
                <p>{r.comment}</p>
                <p className="text-xs text-gray-400">
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default BookDetails;