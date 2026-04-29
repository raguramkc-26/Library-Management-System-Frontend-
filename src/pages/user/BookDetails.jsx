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
        instance.get(`/reviews/${id}/average`),
      ]);

      setBook(bookRes?.data?.data);
      setReviews(reviewRes?.data?.data || []);
      setAvgRating(avgRes?.data?.data?.avgRating || 0);

      if (user) {
        try {
          const borrowRes = await instance.get(`/borrow/me`);

          const record = borrowRes.data.data.find(
            (b) => b.book?._id === id && b.status === "borrowed"
          );

          setBorrowRecord(record || null);
        } catch {
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
      toast.error(err?.response?.data?.message || "Reserve failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturn = async () => {
    try {
      setActionLoading(true);

      await instance.put(`/borrow/${borrowRecord._id}/return`);
      toast.success("Book returned");

      await fetchData(); 

    } catch (err) {
      toast.error(err?.response?.data?.message || "Return failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReview = async () => {
    if (!user) return toast.error("Login required");
    if (!borrowRecord) return toast.error("Borrow before reviewing");
    if (!rating) return toast.error("Select rating");
    if (!comment.trim()) return toast.error("Write comment");

    try {
      setReviewLoading(true);

      await instance.post(`/reviews/${id}`, { rating, comment });

      toast.success("Review submitted");

      setRating(0);
      setComment("");

      const reviewRes = await instance.get(`/reviews/${id}`);
      setReviews(reviewRes?.data?.data || []);

    } catch (err) {
      toast.error(err?.response?.data?.message || "Review failed");
    } finally {
      setReviewLoading(false);
    }
  };

  // ================= STATES =================

  if (loading) return <Loader />;

  if (!book)
    return <EmptyState title="Book not found" subtitle="Try another book" />;

  const status = (book?.status || "").toLowerCase();

  const showBorrow = status === "available";
  const showReturn = borrowRecord !== null;
  const showReserve = status === "borrowed" && !borrowRecord;

  // ================= UI =================

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">

      {/* LOGIN WARNING */}
      {!user && (
        <p className="text-red-500 text-sm">
          Please login to borrow or reserve books
        </p>
      )}

      {/* BOOK */}
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
              status === "available"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}>
              {book.status}
            </span>

            <div>
              <h3 className="font-semibold">Description</h3>
              <p className="text-gray-700 text-sm">
                {book.description || "No description available"}
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 flex-wrap pt-2">

              {showBorrow && (
                <Button
                  onClick={handleBorrow}
                  disabled={!user || actionLoading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {actionLoading ? "Processing..." : "Borrow"}
                </Button>
              )}

              {showReserve && (
                <Button
                  onClick={handleReserve}
                  disabled={!user || actionLoading}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  Reserve
                </Button>
              )}

              {showReturn && (
                <Button
                  onClick={handleReturn}
                  disabled={actionLoading}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Return Book
                </Button>
              )}

            </div>
          </div>
        </div>
      </Card>

      {/* REVIEW FORM */}
      {user && borrowRecord && (
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
            placeholder="Write your review..."
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
        <h2 className="font-semibold mb-4">Reviews</h2>

        {reviews.length === 0 ? (
          <EmptyState title="No reviews yet" />
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="border-b py-3">
              <p className="font-medium">{r.user?.name || "User"}</p>
              <p className="text-yellow-500">
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
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