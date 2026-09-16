import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function ApplicationWorkflow() {
  const { colors, darkMode } = useTheme();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkflow();
  }, []);

  const loadWorkflow = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/application-workflow/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
        }),
      });

      const data = await response.json();

      if (Array.isArray(data.workflow)) {
        setApplications(data.workflow);
      } else {
        setApplications([]);
      }
    } catch (err) {
      console.error(err);
      alert("Unable to load workflow.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    "Applied",
    "Resume Shortlisted",
    "Assessment",
    "HR Interview",
    "Technical Interview",
    "Manager Round",
    "Offer Released",
  ];

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
        Application Workflow
      </h1>

      <p
        style={{
          ...styles.subtitle,
          color: colors.subText,
        }}
      >
        Track every application through the recruitment pipeline.
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
          No Applications Found
        </div>
      )}

      {applications.map((job, index) => (
        <div
          key={job.application_id || index}
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

          <p style={{ color: colors.text }}>
            <strong>Company:</strong>{" "}
            <span style={{ color: colors.subText }}>
              {job.company}
            </span>
          </p>

          <p style={{ color: colors.text }}>
            <strong>Status:</strong>{" "}
            <span style={{ color: colors.subText }}>
              {job.status}
            </span>
          </p>

          <p style={{ color: colors.text }}>
            <strong>Applied:</strong>{" "}
            <span style={{ color: colors.subText }}>
              {job.applied_at}
            </span>
          </p>

          <div style={styles.workflowContainer}>
            {steps.map((step, i) => {
              const isCompleted = i <= job.current_step;

              return (
                <div
                  key={i}
                  style={styles.stepWrapper}
                >
                  <div
                    style={{
                      ...styles.stepCircle,
                      backgroundColor: isCompleted
                        ? "#16a34a"
                        : darkMode
                        ? "#475569"
                        : "#d1d5db",
                      color: "#ffffff",
                      boxShadow: isCompleted
                        ? "0 4px 10px rgba(22, 163, 74, 0.25)"
                        : "none",
                    }}
                  >
                    {isCompleted ? "✓" : i + 1}
                  </div>

                  <p
                    style={{
                      ...styles.stepLabel,
                      color: isCompleted
                        ? colors.text
                        : colors.subText,
                      fontWeight: isCompleted ? "600" : "400",
                    }}
                  >
                    {step}
                  </p>
                </div>
              );
            })}
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
  },

  applicationCard: {
    marginTop: "30px",
    padding: "25px",
    borderRadius: "16px",
    transition:
      "background-color 0.3s ease, border-color 0.3s ease",
  },

  jobTitle: {
    marginTop: "0",
    marginBottom: "20px",
    fontSize: "24px",
  },

  workflowContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: "30px",
    flexWrap: "wrap",
    gap: "15px",
  },

  stepWrapper: {
    flex: "1 1 120px",
    minWidth: "120px",
    textAlign: "center",
  },

  stepCircle: {
    width: "45px",
    height: "45px",
    margin: "0 auto",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    transition:
      "background-color 0.3s ease, box-shadow 0.3s ease",
  },

  stepLabel: {
    marginTop: "10px",
    fontSize: "13px",
    lineHeight: "1.5",
  },
};