import { useEffect, useState } from "react";
import instance from "../instances/instance";
import { toast } from "react-toastify";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await instance.get("/reviews/pending");
      setReviews(res.data.data || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await instance.patch(`/reviews/${id}/approve`);
      toast.success("Review approved");
      fetchReviews();
    } catch {
      toast.error("Approve failed");
    }
  };

  const handleReject = async (id) => {
    try {
      await instance.patch(`/reviews/${id}/reject`);
      toast.success("Review rejected");
      fetchReviews();
    } catch {
      toast.error("Reject failed");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">Pending Reviews</h1>

      {loading ? (
        <p>Loading...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-400 text-center">No pending reviews</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="bg-white p-4 rounded shadow border"
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
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() => handleReject(r._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
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