import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import instance from "../../instances/instance";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";

const BookDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [borrowLoading, setBorrowLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  // FETCH DATA 
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [bookRes, reviewRes] = await Promise.all([
        instance.get(`/books/${id}`),
        instance.get(`/reviews/${id}`),
      ]);

      setBook(bookRes?.data?.data || bookRes?.data || null);
      setReviews(reviewRes?.data?.data || reviewRes?.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load book");
      toast.error(err?.response?.data?.message || "Failed to load book");
    } finally {
      setLoading(false);
    }
  };

  // BORROW
  const handleBorrow = async () => {
    if (!user) return toast.error("Login required");

    try {
      setBorrowLoading(true);

      await instance.post(`/borrow/${id}`); // safer

      toast.success("Book borrowed successfully");
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Borrow failed");
    } finally {
      setBorrowLoading(false);
    }
  };

  // RESERVE
  const handleReserve = async () => {
    if (!user) return toast.error("Login required");

    try {
      setBorrowLoading(true);

      await instance.post(`/reservation/${id}`);

      toast.success("Book reserved successfully");
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Reserve failed");
    } finally {
      setBorrowLoading(false);
    }
  };

  // REVIEW
  const handleReview = async () => {
    if (!user) return toast.error("Login required");
    if (!rating) return toast.error("Select rating");
    if (!comment.trim()) return toast.error("Write comment");

    try {
      setReviewLoading(true);

      await instance.post(`/reviews`, {
        book: id, // safer key
        rating,
        comment,
      });

      toast.success("Review submitted");

      setRating(0);
      setComment("");

      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Review failed");
    } finally {
      setReviewLoading(false);
    }
  };

  // AVG RATING
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + (r.rating || 0), 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  // STATES
  if (loading) return <Loader />;

  if (error)
    return (
      <div className="text-center mt-10">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchData}>Retry</Button>
      </div>
    );

  if (!book)
    return (
      <EmptyState
        title="Book not found"
        subtitle="Try another book"
      />
    );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">

      {/* BOOK INFO */}
      <Card>
        <div className="grid md:grid-cols-3 gap-6">

          <img
            src={
              book.image?.trim()
                ? book.image
                : "https://via.placeholder.com/200"
            }
            onError={(e) =>
              (e.target.src = "https://via.placeholder.com/200")
            }
            alt={book.title}
            className="w-full max-w-xs h-72 object-cover rounded-lg mx-auto"
          />

          <div className="md:col-span-2 space-y-4">

            <h1 className="text-3xl font-bold">{book.title}</h1>

            <p className="text-gray-500">{book.author}</p>

            <p className="text-yellow-500 font-semibold">
              ⭐ {avgRating} / 5 ({reviews.length} reviews)
            </p>

            <p className="text-sm text-gray-600">
              Genre: {book.genre || "N/A"}
            </p>

            <p className="text-gray-700">
              {book.description || "No description available"}
            </p>

            {/* STATUS BADGE */}
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                book.status === "Available"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {book.status}
            </span>

            {!user && (
              <p className="text-sm text-red-500">
                Login to borrow or review
              </p>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 flex-wrap pt-2">

              {book.status === "Available" ? (
                <Button
                  onClick={handleBorrow}
                  loading={borrowLoading}
                  disabled={!user || borrowLoading}
                >
                  Borrow Book
                </Button>
              ) : (
                <Button
                  onClick={handleReserve}
                  loading={borrowLoading}
                  disabled={!user || borrowLoading}
                  variant="warning"
                >
                  Reserve Book
                </Button>
              )}

            </div>
          </div>
        </div>
      </Card>

      {/* REVIEW FORM */}
      {user && (
        <Card>
          <h2 className="font-semibold text-lg mb-3">
            Write a Review
          </h2>

          <div className="flex gap-2 text-2xl mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setRating(s)}
                className={
                  s <= rating
                    ? "text-yellow-400"
                    : "text-gray-300"
                }
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            placeholder="Share your thoughts..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border p-3 rounded mb-3"
          />

          <Button onClick={handleReview} loading={reviewLoading}>
            Submit Review
          </Button>
        </Card>
      )}

      {/* REVIEWS */}
      <Card>
        <h2 className="font-semibold text-lg mb-4">Reviews</h2>

        {reviews.length === 0 ? (
          <EmptyState
            title="No reviews yet"
            subtitle="Be the first to review this book"
          />
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="border-b py-4">
              <p className="font-medium">
                {r.user?.name || "User"}
              </p>
              <p className="text-yellow-500">
                {"★".repeat(r.rating || 0)}
              </p>
              <p className="text-gray-600">{r.comment}</p>
            </div>
          ))
        )}
      </Card>

    </div>
  );
};

export default BookDetails;