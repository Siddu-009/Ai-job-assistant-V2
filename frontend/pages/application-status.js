import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

const STATUS = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "HR Interview",
  "Technical Interview",
  "Manager Round",
  "Offer",
  "Rejected",
];

export default function ApplicationStatus() {
  const { colors, darkMode } = useTheme();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/application-status/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
        }),
      });

      const data = await response.json();

      if (Array.isArray(data.applications)) {
        setApplications(data.applications);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error(error);
      alert("Unable to load application status.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (step, currentStatus) => {
    const isActive = step === currentStatus;
    const isRejected = currentStatus === "Rejected" && isActive;

    return {
      padding: "10px 15px",
      borderRadius: "20px",
      backgroundColor: isActive
        ? isRejected
          ? "#dc2626"
          : colors.button
        : darkMode
        ? "#334155"
        : "#e5e7eb",
      color: isActive
        ? "#ffffff"
        : darkMode
        ? "#e2e8f0"
        : "#374151",
      fontWeight: "600",
      fontSize: "14px",
      border: isActive
        ? "none"
        : `1px solid ${colors.border}`,
      transition:
        "background-color 0.3s ease, color 0.3s ease",
    };
  };

  return (
    <div
      style={{
        ...styles.container,
        backgroundColor: colors.card,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        boxShadow: darkMode
          ? "0 15px 35px rgba(0, 0, 0, 0.25)"
          : "0 15px 35px rgba(0, 0, 0, 0.08)",
      }}
    >
      <h1
        style={{
          ...styles.title,
          color: colors.text,
        }}
      >
        Application Status
      </h1>

      <p
        style={{
          ...styles.subtitle,
          color: colors.subText,
        }}
      >
        Track the current status of all your job applications.
      </p>

      {loading && (
        <p style={{ color: colors.subText }}>
          Loading...
        </p>
      )}

      {!loading && applications.length === 0 && (
        <div
          style={{
            ...styles.emptyCard,
            backgroundColor: colors.cardSecondary,
            border: `1px solid ${colors.border}`,
            color: colors.subText,
          }}
        >
          No job applications found.
        </div>
      )}

      {applications.map((job, index) => (
        <div
          key={index}
          style={{
            ...styles.applicationCard,
            backgroundColor: colors.cardSecondary,
            border: `1px solid ${colors.border}`,
          }}
        >
          <h2
            style={{
              ...styles.jobTitle,
              color: colors.text,
            }}
          >
            {job.title}
          </h2>

          <p
            style={{
              ...styles.company,
              color: colors.subText,
            }}
          >
            🏢 {job.company}
          </p>

          <p
            style={{
              ...styles.currentStatus,
              color: colors.text,
            }}
          >
            <strong>Current Status:</strong>{" "}
            {job.status || "Not Updated"}
          </p>

          <div style={styles.statusContainer}>
            {STATUS.map((step, i) => (
              <div
                key={i}
                style={getStatusStyle(step, job.status)}
              >
                {step}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1300px",
    margin: "40px auto",
    padding: "35px",
    borderRadius: "20px",
    boxSizing: "border-box",
    transition:
      "background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease",
  },

  title: {
    marginBottom: "10px",
    fontSize: "32px",
    fontWeight: "700",
  },

  subtitle: {
    marginBottom: "30px",
    fontSize: "16px",
  },

  emptyCard: {
    marginTop: "25px",
    padding: "25px",
    borderRadius: "15px",
    textAlign: "center",
    fontSize: "16px",
  },

  applicationCard: {
    marginTop: "30px",
    padding: "25px",
    borderRadius: "15px",
    transition:
      "background-color 0.3s ease, border-color 0.3s ease",
  },

  jobTitle: {
    margin: "0 0 10px",
    fontSize: "24px",
  },

  company: {
    fontSize: "16px",
    marginBottom: "15px",
  },

  currentStatus: {
    fontSize: "15px",
    marginTop: "15px",
  },

  statusContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "25px",
  },
};