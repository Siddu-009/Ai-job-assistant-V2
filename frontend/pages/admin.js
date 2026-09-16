import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function AdminDashboard() {
  const { colors, darkMode } = useTheme();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return;
      }

      const response = await fetch("/api/admin/dashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        alert(result.message || "Unable to load dashboard.");
        return;
      }

      setData(result);
    } catch (error) {
      console.error(error);
      alert("Unable to load admin dashboard.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader text="Loading Admin Dashboard..." colors={colors} />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.background,
        padding: "40px 20px",
        transition: "background 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
          padding: "35px",
          background: colors.card,
          border: colors.borderStyle,
          borderRadius: "20px",
          boxShadow: darkMode
            ? "0 15px 35px rgba(0, 0, 0, 0.35)"
            : "0 15px 35px rgba(0, 0, 0, 0.08)",
          transition: "background 0.3s ease, border 0.3s ease",
        }}
      >
        <h1
          style={{
            margin: 0,
            color: colors.text,
            fontSize: "32px",
            fontWeight: "700",
          }}
        >
          Admin Dashboard
        </h1>

        <p
          style={{
            marginTop: "10px",
            color: colors.subText,
          }}
        >
          Monitor platform activity and system performance.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          <Card
            title="Users"
            value={data?.users || 0}
            color="#2563eb"
            colors={colors}
          />

          <Card
            title="Resumes"
            value={data?.resumes || 0}
            color="#16a34a"
            colors={colors}
          />

          <Card
            title="Applications"
            value={data?.applications || 0}
            color="#f59e0b"
            colors={colors}
          />

          <Card
            title="Jobs"
            value={data?.jobs || 0}
            color="#7c3aed"
            colors={colors}
          />
        </div>

        <div
          style={{
            marginTop: "40px",
          }}
        >
          <h2
            style={{
              color: colors.text,
              fontSize: "24px",
              marginBottom: "20px",
            }}
          >
            Recent Activity
          </h2>

          {(data?.recent_activity || []).map((item, index) => (
            <div
              key={item.id || index}
              style={{
                padding: "18px 0",
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <strong
                style={{
                  color: colors.text,
                  fontSize: "16px",
                }}
              >
                {item.user}
              </strong>

              <p
                style={{
                  margin: "8px 0",
                  color: colors.subText,
                }}
              >
                {item.action}
              </p>

              <small
                style={{
                  color: colors.muted,
                }}
              >
                {item.time}
              </small>
            </div>
          ))}

          {(data?.recent_activity || []).length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "30px",
                background: colors.cardSecondary,
                border: colors.borderStyle,
                borderRadius: "12px",
                color: colors.subText,
              }}
            >
              No recent activity.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, color, colors }) {
  return (
    <div
      style={{
        padding: "25px",
        background: colors.cardSecondary,
        border: colors.borderStyle,
        borderRadius: "15px",
        transition: "background 0.3s ease, border 0.3s ease",
      }}
    >
      <h3
        style={{
          margin: 0,
          color: colors.subText,
          fontSize: "16px",
          fontWeight: "600",
        }}
      >
        {title}
      </h3>

      <h1
        style={{
          marginTop: "15px",
          marginBottom: 0,
          color,
          fontSize: "32px",
          fontWeight: "700",
        }}
      >
        {value}
      </h1>
    </div>
  );
}

function Loader({ text, colors }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: colors.background,
        color: colors.text,
        fontSize: "18px",
        fontWeight: "600",
      }}
    >
      {text}
    </div>
  );
}