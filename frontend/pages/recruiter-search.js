import { useState } from "react";
import Layout from "../components/Layout";

export default function RecruiterSearch() {
  const [skill, setSkill] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!skill.trim()) {
      alert("Enter a skill.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/recruiter-search/${encodeURIComponent(skill)}`
      );

      const data = await response.json();

      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert("Unable to search resumes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div
        style={{
          padding: "30px"
        }}
      >
        <h1>Recruiter Search</h1>

        <p
          style={{
            color: "#6b7280",
            marginBottom: "25px"
          }}
        >
          Search resumes by skill.
        </p>

        <div
          style={{
            display: "flex",
            gap: "15px",
            marginBottom: "30px"
          }}
        >
          <input
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            placeholder="Example: AWS"
            style={{
              flex: 1,
              padding: "14px",
              border: "1px solid #d1d5db",
              borderRadius: "10px"
            }}
          />

          <button
            onClick={search}
            disabled={loading}
            style={{
              padding: "14px 24px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer"
            }}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
	          {results.length === 0 && !loading && (
          <p>No resumes found.</p>
        )}

        {results.map((resume) => (
          <div
            key={resume.resume_id}
            style={{
              marginTop: "20px",
              padding: "20px",
              background: "#ffffff",
              borderRadius: "15px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 8px 20px rgba(0,0,0,.05)"
            }}
          >
            <h2
              style={{
                marginTop: 0
              }}
            >
              {resume.filename}
            </h2>

            <p>
              <strong>Skills:</strong> {resume.skills}
            </p>

            <p>
              <strong>Uploaded:</strong> {resume.created_at}
            </p>

            <button
              onClick={() =>
                window.open(
                  `/api/resume-view/${resume.resume_id}`,
                  "_blank"
                )
              }
              style={{
                marginTop: "15px",
                padding: "10px 20px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer"
              }}
            >
              View Resume
            </button>
          </div>
        ))}
      </div>
    </Layout>
  );
}
