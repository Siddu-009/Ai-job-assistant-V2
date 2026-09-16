import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useTheme } from "../context/ThemeContext";

export default function JobTracker() {
  const { colors, darkMode } = useTheme();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const response = await fetch("/api/job-tracker/list");

      const data = await response.json();

      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert("Unable to load applications.");
    } finally {
      setLoading(false);
    }
  };

  const badgeColor = (status) => {
    switch (status) {
      case "Applied":
        return "#2563eb";

      case "Interview Scheduled":
        return "#f59e0b";

      case "Selected":
        return "#16a34a";

      case "Rejected":
        return "#dc2626";

      default:
        return "#6b7280";
    }
  };

  return (
    <Layout>
      <div
        style={{
          ...styles.container,
          color: colors.text,
        }}
      >
        <h1
          style={{
            ...styles.title,
            color: colors.text,
          }}
        >
          Job Tracker
        </h1>

        <p
          style={{
            ...styles.subtitle,
            color: colors.subText,
          }}
        >
          Track all your job applications.
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
            No applications found.
          </div>
        )}

        {applications.map((app, index) => (
          <div
            key={app.application_id || index}
            style={{
              ...styles.applicationCard,
              backgroundColor: colors.card,
              border: `1px solid ${colors.border}`,
              boxShadow: darkMode
                ? "0 8px 20px rgba(0, 0, 0, 0.2)"
                : "0 8px 20px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div style={styles.headerRow}>
              <div style={styles.jobDetails}>
                <h2
                  style={{
                    ...styles.jobTitle,
                    color: colors.text,
                  }}
                >
                  {app.job_title}
                </h2>

                <p
                  style={{
                    ...styles.detailText,
                    color: colors.subText,
                  }}
                >
                  🏢 {app.company}
                </p>

                <p
                  style={{
                    ...styles.detailText,
                    color: colors.subText,
                  }}
                >
                  📄 Resume: {app.resume}
                </p>

                <p
                  style={{
                    ...styles.detailText,
                    color: colors.subText,
                  }}
                >
                  📅 Applied: {app.applied_at}
                </p>
              </div>

              <span
                style={{
                  ...styles.statusBadge,
                  backgroundColor: badgeColor(app.status),
                }}
              >
                {app.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}

const styles = {
  container: {
    padding: "30px",
    maxWidth: "1400px",
    margin: "0 auto",
    boxSizing: "border-box",
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
    padding: "25px",
    borderRadius: "15px",
    textAlign: "center",
    marginTop: "20px",
  },

  applicationCard: {
    borderRadius: "15px",
    padding: "20px",
    marginBottom: "20px",
    transition:
      "background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
  },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
  },

  jobDetails: {
    flex: "1 1 300px",
    minWidth: 0,
  },

  jobTitle: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "700",
  },

  detailText: {
    marginTop: "8px",
    marginBottom: "8px",
    fontSize: "15px",
  },

  statusBadge: {
    color: "#ffffff",
    padding: "10px 18px",
    borderRadius: "25px",
    fontWeight: "700",
    fontSize: "14px",
    whiteSpace: "nowrap",
  },
};