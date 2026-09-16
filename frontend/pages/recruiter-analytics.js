import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function RecruiterAnalytics() {
  const { colors, darkMode } = useTheme();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/recruiter-dashboard/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to load analytics");
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      alert("Unable to load recruiter analytics.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
          color: colors.text,
          background: colors.background,
          minHeight: "100vh",
        }}
      >
        Loading...
      </div>
    );
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
          background: colors.card,
          border: colors.borderStyle,
          padding: "35px",
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
          Recruiter Analytics
        </h1>

        <p
          style={{
            color: colors.subText,
            marginTop: "10px",
            fontSize: "16px",
          }}
        >
          Monitor hiring performance and recruitment insights.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          <Card
            title="Candidates"
            value={analytics?.candidates || 0}
            color="#2563eb"
            colors={colors}
          />

          <Card
            title="Jobs Posted"
            value={analytics?.jobs || 0}
            color="#16a34a"
            colors={colors}
          />

          <Card
            title="Interviews"
            value={analytics?.interviews || 0}
            color="#f59e0b"
            colors={colors}
          />

          <Card
            title="Offers"
            value={analytics?.offers || 0}
            color="#7c3aed"
            colors={colors}
          />

          <Card
            title="Hiring Rate"
            value={`${analytics?.hiring_rate || 0}%`}
            color="#dc2626"
            colors={colors}
          />

          <Card
            title="Average ATS"
            value={analytics?.average_ats || 0}
            color="#0ea5e9"
            colors={colors}
          />
        </div>

        <div
          style={{
            marginTop: "40px",
            padding: "25px",
            background: colors.cardSecondary,
            border: colors.borderStyle,
            borderRadius: "15px",
            transition: "background 0.3s ease, border 0.3s ease",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: colors.text,
              fontSize: "22px",
            }}
          >
            Recruitment Insights
          </h2>

          <p
            style={{
              color: colors.subText,
              lineHeight: "1.7",
              marginBottom: 0,
            }}
          >
            {analytics?.insights || "No insights available."}
          </p>
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