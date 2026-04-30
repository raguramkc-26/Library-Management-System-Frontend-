import { useEffect, useState } from "react";
import { getBooks } from "../../services/bookService"; 
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const AdminReviews = () => {
  const { user, loading } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const res = await getBooks();

  useEffect(() => {
    if (!loading && user?.role === "admin") {
      fetchReviews();
    }
  }, [user, loading]);

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);

      const res = await instance.get("/reviews/pending");

      setReviews(res.data.data || []);
    } catch (err) {
      console.log("Review fetch error:", err?.response?.data || err.message);

      if (err.response?.status === 403) {
        toast.error("Access denied (Admin only)");
      } else if (err.response?.status === 401) {
        toast.error("Please login again");
      } else {
        toast.error("Failed to load reviews");
      }
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await instance.patch(`/reviews/${id}/approve`);
      toast.success("Review approved");
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Approve failed");
    }
  };

  const handleReject = async (id) => {
    try {
      await instance.patch(`/reviews/${id}/reject`);
      toast.success("Review rejected");
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Reject failed");
    }
  };

  // AUTH GUARD UI
  if (loading) return <p className="p-6 text-center">Loading user...</p>;

  if (!user || user.role !== "admin") {
    return (
      <p className="p-6 text-center text-red-500 font-medium">
        Access Denied (Admin only)
      </p>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">Pending Reviews</h1>

      {loadingReviews ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-400 text-center">No pending reviews</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="bg-white p-4 rounded-xl shadow border hover:shadow-md transition"
            >
              <div className="flex justify-between mb-2">
                <p className="font-semibold">{r.user?.name}</p>
                <span className="text-yellow-500">
                  {"★".repeat(r.rating)}
                </span>
              </div>

              <p className="text-gray-700 mb-2">{r.comment}</p>

              <p className="text-sm text-gray-500 mb-3">
                Book: {r.book?.title}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(r._id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() => handleReject(r._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;