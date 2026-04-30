import { useEffect, useState } from "react";
import instance from "../../instances/instance";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await instance.get("/notifications");
      setNotifications(res?.data?.data || []);
    } catch (err) {
      console.error("Notification fetch failed", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (notifications.length === 0) {
    return (
      <EmptyState
        title="No notifications"
        subtitle="You will see updates here"
      />
    );
  }

  return (
    <div className="p-6 space-y-3">
      {notifications.map((n) => (
        <Card
          key={n._id}
          className="p-4 hover:shadow-md transition"
        >
          <p className="font-medium text-gray-800">
            📢 {n.message}
          </p>

          <span className="text-xs text-gray-400">
            {new Date(n.createdAt).toLocaleString()}
          </span>
        </Card>
      ))}
    </div>
  );
};

export default Notifications;