import React, { useState } from "react";
import "./notification.css";

// Sample notifications data
const sampleNotifications = [
  {
    id: 1,
    title: "New rescue request near you",
    time: "2 min ago",
    read: false,
    icon: "🚨"
  },
  {
    id: 2,
    title: "Volunteer joined your team",
    time: "10 min ago",
    read: true,
    icon: "👤"
  },
  {
    id: 3,
    title: "Location updated successfully",
    time: "1 hour ago",
    read: true,
    icon: "📍"
  }
];

function NotificationBell() {
  // State to open/close dropdown
  const [isOpen, setIsOpen] = useState(false);

  // State to store notifications
  const [notifications, setNotifications] = useState(sampleNotifications);

  // Count unread notifications
  const unreadCount = notifications.filter((item) => item.read === false).length;

  // Function to mark notification as read
  function markAsRead(id) {
    const updatedNotifications = notifications.map((item) => {
      if (item.id === id) {
        return { ...item, read: true };
      }
      return item;
    });

    setNotifications(updatedNotifications);
  }

  return (
    <div className="notification-wrapper">

      {/* Bell Icon */}
      <div
        className="bell-icon"
        onClick={() => setIsOpen(!isOpen)}
      >
        🔔

        {/* Show unread count */}
        {unreadCount > 0 && (
          <span className="badge">{unreadCount}</span>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="dropdown">
          <h4>Notifications</h4>

          {/* Notification List */}
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`notification-item ${item.read ? "" : "unread"}`}
              onClick={() => markAsRead(item.id)}
            >
              <span className="icon">{item.icon}</span>

              <div className="content">
                <p>{item.title}</p>
                <span className="time">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;