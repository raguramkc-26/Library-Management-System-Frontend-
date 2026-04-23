import { useEffect, useState } from "react";
import instance from "../instances/instance";
import { toast } from "react-toastify";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await instance.get("/reviews/pending");
      setReviews(res.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load reviews");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await instance.patch(`/reviews/${id}/${action}`);
      toast.success(`Review ${action}d`);
      fetchReviews();
    } catch {
      toast.error("Action failed");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Pending Reviews</h2>

      {!loading && reviews.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          <p className="text-lg">No pending reviews</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="bg-white p-5 rounded-xl shadow border"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-semibold">{r.book?.title}</p>
                  <p className="text-sm text-gray-500">
                    by {r.user?.name}
                  </p>
                </div>

                {/* RATING */}
                <div className="text-yellow-400 text-sm">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </div>
              </div>

              {/* COMMENT */}
              <p className="text-gray-700 mb-4">{r.comment}</p>

              {/* ACTIONS */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleAction(r._id, "approve")}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  Approve
                </button>

                <button
                  onClick={() => handleAction(r._id, "reject")}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
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