import { useEffect, useState } from "react";
import Layout from "../components/Layout";

export default function RecruiterDashboard() {
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
        background: "#ffffff",
        padding: "25px",
        borderRadius: "18px",
        boxShadow: "0 10px 25px rgba(0,0,0,.08)",
        borderTop: `5px solid ${color}`
      }}
    >
      <h3
        style={{
          margin: 0,
          color: "#6b7280",
          fontWeight: 500
        }}
      >
        {title}
      </h3>

      <h1
        style={{
          marginTop: "20px",
          color,
          fontSize: "42px"
        }}
      >
        {value}
      </h1>
    </div>
  );

  return (
    <Layout>
      <div
        style={{
          padding: "30px"
        }}
      >
        <h1>Recruiter Dashboard</h1>

        <p
          style={{
            color: "#6b7280",
            marginBottom: "30px"
          }}
        >
          View recruitment statistics.
        </p>

        {loading && <p>Loading...</p>}

        {!loading && stats && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(220px,1fr))",
                gap: "20px"
              }}
            >
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
                marginTop: "40px",
                background: "#ffffff",
                padding: "30px",
                borderRadius: "18px",
                boxShadow: "0 10px 25px rgba(0,0,0,.08)"
              }}
            >
              <h2>Recruitment Summary</h2>

              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "25px"
                }}
              >
                <tbody>
                  <tr>
                    <td style={cell}>Total Resumes</td>
                    <td style={cell}>{stats.total_resumes}</td>
                  </tr>

                  <tr>
                    <td style={cell}>Total Jobs</td>
                    <td style={cell}>{stats.total_jobs}</td>
                  </tr>

                  <tr>
                    <td style={cell}>Applications</td>
                    <td style={cell}>{stats.total_applications}</td>
                  </tr>

                  <tr>
                    <td style={cell}>Applied</td>
                    <td style={cell}>{stats.applied}</td>
                  </tr>

                  <tr>
                    <td style={cell}>Interview Scheduled</td>
                    <td style={cell}>{stats.interview_scheduled}</td>
                  </tr>

                  <tr>
                    <td style={cell}>Selected</td>
                    <td style={cell}>{stats.selected}</td>
                  </tr>

                  <tr>
                    <td style={cell}>Rejected</td>
                    <td style={cell}>{stats.rejected}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

const cell = {
  padding: "15px",
  borderBottom: "1px solid #e5e7eb",
  fontSize: "15px"
};
