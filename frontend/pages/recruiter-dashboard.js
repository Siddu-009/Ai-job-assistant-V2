import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useTheme } from "../context/ThemeContext";

export default function RecruiterDashboard() {
  const { colors, darkMode } = useTheme();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await fetch("/api/recruiter-dashboard/");
      const data = await response.json();

      setStats(data);
    } catch (error) {
      console.error(error);
      alert("Unable to load recruiter dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const Card = ({ title, value, color }) => (
    <div
      style={{
        ...styles.statCard,
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`,
        borderTop: `5px solid ${color}`,
        boxShadow: darkMode
          ? "0 10px 25px rgba(0, 0, 0, 0.2)"
          : "0 10px 25px rgba(0, 0, 0, 0.08)",
      }}
    >
      <h3
        style={{
          ...styles.statTitle,
          color: colors.subText,
        }}
      >
        {title}
      </h3>

      <h1
        style={{
          ...styles.statValue,
          color,
        }}
      >
        {value ?? 0}
      </h1>
    </div>
  );

  const tableCellStyle = {
    ...styles.cell,
    color: colors.text,
    borderBottom: `1px solid ${colors.border}`,
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
          Recruiter Dashboard
        </h1>

        <p
          style={{
            ...styles.subtitle,
            color: colors.subText,
          }}
        >
          View recruitment statistics.
        </p>

        {loading && (
          <p style={{ color: colors.subText }}>
            Loading...
          </p>
        )}

        {!loading && !stats && (
          <div
            style={{
              ...styles.emptyCard,
              backgroundColor: colors.cardSecondary,
              border: `1px solid ${colors.border}`,
              color: colors.subText,
            }}
          >
            No dashboard data available.
          </div>
        )}

        {!loading && stats && (
          <>
            <div style={styles.statsGrid}>
              <Card
                title="Total Resumes"
                value={stats.total_resumes}
                color="#2563eb"
              />

              <Card
                title="Total Jobs"
                value={stats.total_jobs}
                color="#16a34a"
              />

              <Card
                title="Applications"
                value={stats.total_applications}
                color="#7c3aed"
              />

              <Card
                title="Applied"
                value={stats.applied}
                color="#f59e0b"
              />

              <Card
                title="Interview Scheduled"
                value={stats.interview_scheduled}
                color="#8b5cf6"
              />

              <Card
                title="Selected"
                value={stats.selected}
                color="#10b981"
              />

              <Card
                title="Rejected"
                value={stats.rejected}
                color="#dc2626"
              />
            </div>

            <div
              style={{
                ...styles.summaryCard,
                backgroundColor: colors.card,
                border: `1px solid ${colors.border}`,
                boxShadow: darkMode
                  ? "0 10px 25px rgba(0, 0, 0, 0.2)"
                  : "0 10px 25px rgba(0, 0, 0, 0.08)",
              }}
            >
              <h2
                style={{
                  ...styles.summaryTitle,
                  color: colors.text,
                }}
              >
                Recruitment Summary
              </h2>

              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <tbody>
                    <tr>
                      <td style={tableCellStyle}>Total Resumes</td>
                      <td style={tableCellStyle}>
                        {stats.total_resumes ?? 0}
                      </td>
                    </tr>

                    <tr>
                      <td style={tableCellStyle}>Total Jobs</td>
                      <td style={tableCellStyle}>
                        {stats.total_jobs ?? 0}
                      </td>
                    </tr>

                    <tr>
                      <td style={tableCellStyle}>Applications</td>
                      <td style={tableCellStyle}>
                        {stats.total_applications ?? 0}
                      </td>
                    </tr>

                    <tr>
                      <td style={tableCellStyle}>Applied</td>
                      <td style={tableCellStyle}>
                        {stats.applied ?? 0}
                      </td>
                    </tr>

                    <tr>
                      <td style={tableCellStyle}>
                        Interview Scheduled
                      </td>
                      <td style={tableCellStyle}>
                        {stats.interview_scheduled ?? 0}
                      </td>
                    </tr>

                    <tr>
                      <td style={tableCellStyle}>Selected</td>
                      <td style={tableCellStyle}>
                        {stats.selected ?? 0}
                      </td>
                    </tr>

                    <tr>
                      <td style={tableCellStyle}>Rejected</td>
                      <td style={tableCellStyle}>
                        {stats.rejected ?? 0}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
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

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },

  statCard: {
    padding: "25px",
    borderRadius: "18px",
    transition:
      "background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
    boxSizing: "border-box",
  },

  statTitle: {
    margin: 0,
    fontWeight: "500",
    fontSize: "16px",
  },

  statValue: {
    marginTop: "20px",
    marginBottom: 0,
    fontSize: "42px",
    fontWeight: "700",
  },

  summaryCard: {
    marginTop: "40px",
    padding: "30px",
    borderRadius: "18px",
    transition:
      "background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
    boxSizing: "border-box",
  },

  summaryTitle: {
    margin: 0,
    fontSize: "24px",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "25px",
    minWidth: "400px",
  },

  cell: {
    padding: "15px",
    fontSize: "15px",
    textAlign: "left",
  },

  emptyCard: {
    marginTop: "25px",
    padding: "25px",
    borderRadius: "15px",
    textAlign: "center",
  },
};