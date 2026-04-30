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
  const [avgRating, setAvgRating] = useState(0);
  const [borrowRecord, setBorrowRecord] = useState(null);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id, user]);

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      setLoading(true);

      const [bookRes, reviewRes, avgRes] = await Promise.all([
        instance.get(`/books/${id}`),
        instance.get(`/reviews/${id}`),
        instance.get(`/reviews/${id}/average`)
      ]);

      const bookData = bookRes?.data?.data;
      if (!bookData) throw new Error("Book not found");

      setBook(bookData);
      setReviews(reviewRes?.data?.data || []);
      setAvgRating(avgRes?.data?.data?.avgRating || 0);

      // fetch borrow info
      if (user) {
        try {
          const borrowRes = await instance.get(`/borrow/me`);
          const borrowData = borrowRes?.data?.data || [];

          const record = borrowData.find(
            (b) => b.book?._id === id && b.status === "borrowed"
          );

          setBorrowRecord(record || null);
        } catch (err) {
          console.error("BORROW FETCH ERROR:", err);
          setBorrowRecord(null);
        }
      } else {
        setBorrowRecord(null);
      }

    } catch (err) {
      console.error("FETCH ERROR:", err);
      toast.error("Failed to load book");
    } finally {
      setLoading(false);
    }
  };

  // ================= ACTIONS =================

  const handleBorrow = async () => {
    if (!user) return toast.error("Login required");

    try {
      setActionLoading(true);
      await instance.post(`/borrow/${id}`);
      toast.success("Book borrowed");
      await fetchData();
    } catch (err) {
      console.error("BORROW ERROR:", err);
      toast.error(err?.response?.data?.message || "Borrow failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReserve = async () => {
    if (!user) return toast.error("Login required");

    try {
      setActionLoading(true);
      await instance.post(`/reservation/${id}`);
      toast.success("Book reserved");
    } catch (err) {
      console.error("RESERVE ERROR:", err);
      toast.error(err?.response?.data?.message || "Reserve failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturn = async () => {
    if (!borrowRecord?._id) return;

    try {
      setActionLoading(true);
      await instance.put(`/borrow/${borrowRecord._id}/return`);
      toast.success("Book returned");
      await fetchData();
    } catch (err) {
      console.error("RETURN ERROR:", err);
      toast.error(err?.response?.data?.message || "Return failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReview = async () => {
    if (!user) return toast.error("Login required");
    if (!rating) return toast.error("Select rating");
    if (!comment.trim()) return toast.error("Write comment");

    try {
      setReviewLoading(true);

      await instance.post(`/reviews/${id}`, { rating, comment });

      toast.success("Review submitted");

      setRating(0);
      setComment("");

      // refresh reviews + avg rating
      const [reviewRes, avgRes] = await Promise.all([
        instance.get(`/reviews/${id}`),
        instance.get(`/reviews/${id}/average`)
      ]);

      setReviews(reviewRes?.data?.data || []);
      setAvgRating(avgRes?.data?.data?.avgRating || 0);

    } catch (err) {
      console.error("REVIEW ERROR:", err);
      toast.error(err?.response?.data?.message || "Review failed");
    } finally {
      setReviewLoading(false);
    }
  };

  // ================= STATES =================

  if (loading) return <Loader />;

  if (!book)
    return <EmptyState title="Book not found" subtitle="Try another book" />;

  const isAvailable = book?.status === "Available";
  const isBorrowed = book?.status === "Borrowed";

  const showBorrow = isAvailable && !borrowRecord;
  const showReturn = borrowRecord?.status === "borrowed";
  const showReserve = isBorrowed && !borrowRecord;

  // ================= UI =================

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">

      {!user && (
        <p className="text-red-500 text-sm">
          Please login to interact with books
        </p>
      )}

      <Card>
        <div className="grid md:grid-cols-3 gap-8">

          <img
            src={book.image || "https://via.placeholder.com/200"}
            onError={(e) =>
              (e.target.src = "https://via.placeholder.com/200")
            }
            alt={book.title}
            className="w-full max-w-xs h-72 object-cover rounded-lg mx-auto shadow"
          />

          <div className="md:col-span-2 space-y-4">
            <h1 className="text-3xl font-bold">{book.title}</h1>
            <p className="text-gray-500">{book.author}</p>

            <p className="text-yellow-500 font-semibold">
              ⭐ {avgRating} ({reviews.length} reviews)
            </p>

            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isAvailable
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}>
              {book.status}
            </span>

            <p className="text-sm">{book.description}</p>

            <div className="flex gap-3 flex-wrap">

              {showBorrow && (
                <Button
                  onClick={handleBorrow}
                  disabled={!user || actionLoading}
                >
                  {actionLoading ? "Processing..." : "Borrow"}
                </Button>
              )}

              {showReserve && (
                <Button
                  onClick={handleReserve}
                  disabled={!user || actionLoading}
                >
                  Reserve
                </Button>
              )}

              {showReturn && (
                <Button
                  onClick={handleReturn}
                  disabled={actionLoading}
                >
                  Return Book
                </Button>
              )}

            </div>
          </div>
        </div>
      </Card>

      {/* REVIEW SECTION */}
      {user && (
        <Card>
          <h2 className="font-semibold mb-3">Write Review</h2>

          <div className="flex gap-2 text-2xl mb-3">
            {[1,2,3,4,5].map((s) => (
              <button
                key={s}
                onClick={() => setRating(s)}
                className={s <= rating ? "text-yellow-400" : "text-gray-300"}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border p-3 rounded mb-3"
          />

          <Button
            onClick={handleReview}
            disabled={reviewLoading}
          >
            {reviewLoading ? "Submitting..." : "Submit Review"}
          </Button>
        </Card>
      )}

      {/* REVIEWS */}
      <Card>
        <h2 className="font-semibold mb-4">Reviews</h2>

        {reviews.length === 0 ? (
          <EmptyState
            title="No reviews yet"
            subtitle="Be the first to review this book"
          />
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="border-b py-3">
              <p>{r.user?.name || "User"}</p>
              <p>{"★".repeat(r.rating)}</p>
              <p>{r.comment}</p>
            </div>
          ))
        )}
      </Card>

    </div>
  );
};

export default BookDetails;