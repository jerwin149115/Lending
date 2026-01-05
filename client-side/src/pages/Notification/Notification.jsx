import { useEffect, useState } from "react";
import {
  getAdminNotifications,
  markNotificationAsRead
} from "../../api/notificationAPI.js";

import "./Notification.css";

function Notification() {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    const data = await getAdminNotifications();
    setNotifications(data);

    const unreadNotifications = data.filter(n => !n.is_read);

    await Promise.all(
      unreadNotifications.map(n =>
        markNotificationAsRead(n.notification_id)
      )
    );

    if (unreadNotifications.length > 0) {
      const updatedData = await getAdminNotifications();
      setNotifications(updatedData);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleRead = async (id) => {
    await markNotificationAsRead(id);
    fetchNotifications();
  };

  return (
    <div className="table-container-notification">
      <div className="text-end-notification">
        <h2>Notifications</h2>
      </div>

      <table className="custom-table-notification">
        <thead>
          <tr>
            <th>Title</th>
            <th>Message</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {notifications.length ? (
            notifications.map(n => (
              <tr
                key={n.notification_id}
                className={!n.is_read ? "unread-row" : ""}
              >
                <td>{n.title}</td>
                <td>{n.message}</td>
                <td>{new Date(n.created_at).toLocaleString()}</td>
                <td>
                  {!n.is_read ? (
                    <button
                      className="status-unread"
                      onClick={() => handleRead(n.notification_id)}
                    >
                      Mark as read
                    </button>
                  ) : (
                    <span className="status-read">Read</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No notifications</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Notification;
