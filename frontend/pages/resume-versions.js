import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useTheme } from "../context/ThemeContext";

export default function ResumeVersions() {
  const { colors } = useTheme();
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  const resumeId = 3;

  useEffect(() => {
    loadVersions();
  }, []);

  const loadVersions = async () => {
    try {
      const response = await fetch(
        `/api/resume-versions/${resumeId}`
      );

      const data = await response.json();

      setVersions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert("Unable to load resume versions.");
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
        <h1>Resume Versions</h1>

        <p
          style={{
            color: colors.subText,
            marginBottom: "30px"
          }}
        >
          Previous versions of your resume.
        </p>

        {loading && <p>Loading...</p>}

        {!loading && versions.length === 0 && (
          <p>No resume versions found.</p>
        )}
            {versions.map((version) => (
          <div
            key={version.id}
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "15px",
              padding: "20px",
              marginBottom: "20px",
              boxShadow: "0 8px 20px rgba(0,0,0,.05)"
            }}
          >
            <h2
              style={{
                marginTop: 0
              }}
            >
              {version.version_name}
            </h2>

            <p>
              📅 Created: {version.created_at}
            </p>

            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "20px",
                flexWrap: "wrap"
              }}
            >
              <button
                onClick={() =>
                  alert(
                    "Restore API is not implemented in the backend yet."
                  )
                }
                style={{
                  padding: "10px 20px",
                  background: "#16a34a",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer"
                }}
              >
                Restore
              </button>

              <button
                onClick={() =>
                  alert(
                    "Download API is not implemented in the backend yet."
                  )
                }
                style={{
                  padding: "10px 20px",
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer"
                }}
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
