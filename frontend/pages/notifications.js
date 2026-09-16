import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTheme } from "../context/ThemeContext";

export default function Notifications() {
  const router = useRouter();
  const { colors, darkMode } = useTheme();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setNotifications([]);
        return;
      }

      const response = await fetch("/api/notifications/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setNotifications([]);
        return;
      }

      if (data.success) {
        setNotifications(data.notifications || []);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error(err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`/api/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      await loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem("token");

      await fetch("/api/notifications/read-all", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      await loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const clearAllNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      await fetch("/api/notifications/clear-all", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      await loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          padding: "60px",
          textAlign: "center",
          color: colors.text,
          backgroundColor: colors.background,
          minHeight: "200px",
          transition: "background-color 0.3s ease, color 0.3s ease",
        }}
      >
        Loading Notifications...
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        backgroundColor: colors.card,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        borderRadius: "20px",
        padding: "35px",
        boxShadow: darkMode
          ? "0 15px 35px rgba(0, 0, 0, 0.25)"
          : "0 15px 35px rgba(15, 23, 42, 0.08)",
        transition:
          "background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <h1
          style={{
            margin: 0,
            color: colors.text,
            fontSize: "30px",
            fontWeight: 700,
          }}
        >
          Notifications
        </h1>

        {notifications.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={markAllRead}
              style={{
                padding: "10px 18px",
                border: "none",
                borderRadius: "8px",
                backgroundColor: colors.button,
                color: "#ffffff",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Mark All Read
            </button>

            <button
              onClick={clearAllNotifications}
              style={{
                padding: "10px 18px",
                border: "none",
                borderRadius: "8px",
                backgroundColor: "#ef4444",
                color: "#ffffff",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* NOTIFICATIONS LIST */}
      {notifications.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            color: colors.subText,
            fontSize: "18px",
          }}
        >
          No notifications available.
        </div>
      ) : (
        notifications.map((item) => (
          <div
            key={item.id}
            onClick={async () => {
              if (!item.is_read) {
                await markAsRead(item.id);
              }

              if (item.link) {
                router.push(item.link);
              }
            }}
            style={{
              marginBottom: "18px",
              padding: "20px",
              borderRadius: "15px",
              border: `1px solid ${colors.border}`,
              backgroundColor: item.is_read
                ? colors.background
                : colors.infoBg,
              cursor: item.link ? "pointer" : "default",
              transition:
                "transform 0.25s ease, box-shadow 0.25s ease, background-color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              if (item.link) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = darkMode
                  ? "0 10px 20px rgba(0, 0, 0, 0.25)"
                  : "0 10px 20px rgba(15, 23, 42, 0.08)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* TITLE AND NEW BADGE */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "15px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: colors.text,
                  fontSize: "17px",
                  fontWeight: 700,
                }}
              >
                {item.title}
              </h3>

              {!item.is_read && (
                <span
                  style={{
                    backgroundColor: colors.button,
                    color: "#ffffff",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  NEW
                </span>
              )}
            </div>

            {/* MESSAGE */}
            <p
              style={{
                marginTop: "10px",
                marginBottom: 0,
                color: colors.subText,
                lineHeight: "24px",
                fontSize: "14px",
              }}
            >
              {item.message}
            </p>

            {/* DATE */}
            <div
              style={{
                marginTop: "12px",
                color: colors.muted,
                fontSize: "13px",
              }}
            >
              {item.created_at}
            </div>
          </div>
        ))
      )}
    </div>
  );
}