import { useEffect, useState } from "react";
import { getNotifications } from "../../services/notificationService";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getNotifications();
        setNotifications(res?.data || []);
      } catch {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) return <Loader />;

  if (!notifications.length)
    return <EmptyState title="No notifications" />;

  return (
    <div>
      {notifications.map((n) => (
        <Card key={n._id}>{n.message}</Card>
      ))}
    </div>
  );
};

export default Notifications;