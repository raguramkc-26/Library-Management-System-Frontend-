import { useEffect, useState } from "react";
import {
  getMyNotifications,
  markAsRead,
} from "../../services/notificationService";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await getMyNotifications();
    setNotifications(data.notifications || []);
  };

  const handleRead = async (id) => {
    await markAsRead(id);
    fetchData();
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Notifications</h1>

      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        notifications.map((n) => (
          <div
            key={n._id}
            className={`p-3 mb-2 border rounded ${
              n.read ? "bg-gray-100" : "bg-blue-50"
            }`}
          >
            <p>{n.message}</p>

            {!n.read && (
              <button
                onClick={() => handleRead(n._id)}
                className="text-blue-600 text-sm" 
              >
                Mark as read
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;