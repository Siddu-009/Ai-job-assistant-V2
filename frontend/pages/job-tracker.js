import { useEffect, useState } from "react";
import Layout from "../components/Layout";

export default function JobTracker() {
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
          padding: "30px"
        }}
      >
        <h1>Job Tracker</h1>

        <p
          style={{
            color: "#6b7280",
            marginBottom: "30px"
          }}
        >
          Track all your job applications.
        </p>

        {loading && <p>Loading...</p>}

        {!loading && applications.length === 0 && (
          <p>No applications found.</p>
        )}
           {applications.map((app) => (
          <div
            key={app.application_id}
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "15px",
              padding: "20px",
              marginBottom: "20px",
              boxShadow: "0 8px 20px rgba(0,0,0,.05)"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "15px"
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0
                  }}
                >
                  {app.job_title}
                </h2>

                <p
                  style={{
                    marginTop: "8px"
                  }}
                >
                  🏢 {app.company}
                </p>

                <p>
                  📄 Resume: {app.resume}
                </p>

                <p>
                  📅 Applied: {app.applied_at}
                </p>
              </div>

              <span
                style={{
                  background: badgeColor(app.status),
                  color: "#ffffff",
                  padding: "10px 18px",
                  borderRadius: "25px",
                  fontWeight: "bold"
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
