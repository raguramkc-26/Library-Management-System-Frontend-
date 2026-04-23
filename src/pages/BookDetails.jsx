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
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [comment, setComment] = useState("");

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
      setReviews(reviewRes.data.reviews || []);
    } catch {
      toast.error("Failed to load book");
    }
  };

  // BORROW
  const handleBorrow = async () => {
    try {
      await instance.post(`/borrow/${id}`);
      toast.success("Book borrowed");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  // RESERVE
  const handleReserve = async () => {
    try {
      await instance.post(`/reservation/${id}`);
      toast.success("Book reserved");
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  // REVIEW
  const handleReview = async () => {
    if (!rating) return toast.error("Select rating first");

    try {
      await instance.post(`/reviews/${id}`, {
        rating,
        comment,
      });

      toast.success("Review added");
      setRating(0);
      setComment("");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add review");
    }
  };

  if (!book) return <p className="p-6">Loading...</p>;

  const handleImageChange = (e) => {
  const file = e.target.files[0];
  setImage(file);

  if (file) {
    setPreview(URL.createObjectURL(file));
  }
};

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto p-6 space-y-6">

        {/* BOOK CARD */}
        <div className="bg-white rounded-xl shadow p-6 grid md:grid-cols-3 gap-6">

          {/* IMAGE */}
          <img
            src={book.image || "https://via.placeholder.com/200x280"}
            alt={book.title}
            className="w-full h-72 object-cover rounded-lg"
          />

          {/* DETAILS */}
          <div className="md:col-span-2 space-y-3">
            <h1 className="text-2xl font-bold">{book.title}</h1>
            <p className="text-gray-600">{book.author}</p>

            <p className="text-sm text-gray-500">Genre: {book.genre}</p>

            <p className="text-gray-700">{book.description}</p>

            <p className="mt-2">
              Status:
              <span
                className={`ml-2 font-semibold ${
                  book.status === "Available"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {book.status}
              </span>
            </p>

            {/* ACTIONS */}
            <div className="flex gap-3 mt-4">
              {book.status === "Available" ? (
                <button
                  onClick={handleBorrow}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Borrow
                </button>
              ) : (
                <button
                  onClick={handleReserve}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Reserve
                </button>
              )}
            </div>
          </div>
        </div>

        {/* REVIEW FORM */}
        {user && (
          <div className="bg-white p-5 rounded-xl shadow space-y-4">
            <h2 className="font-semibold text-lg">Add Review</h2>

            {/* ⭐ STAR RATING */}
            <div className="flex gap-2 text-2xl">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(null)}
                  className={`cursor-pointer ${
                    (hover || rating) >= star
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border p-2 rounded"
            />

            <button
              onClick={handleReview}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Submit Review
            </button>
          </div>
        )}

        {/* REVIEWS */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold text-lg mb-4">Reviews</h2>

          {reviews.length === 0 ? (
            <p>No reviews yet</p>
          ) : (
            reviews.map((r) => (
              <div key={r._id} className="border-b py-3">
                <p className="font-medium">{r.user?.name}</p>
                <p className="text-yellow-500">⭐ {r.rating}</p>
                <p className="text-gray-700">{r.comment}</p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default BookDetails;