import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function ATSScore() {
  const { colors, darkMode } = useTheme();

  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkScore = async () => {
    if (!jobDescription.trim()) {
      alert("Please enter Job Description.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/ats-score/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          job_description: jobDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        alert(data.message || "Unable to analyze ATS.");
        return;
      }

      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Unable to calculate ATS Score.");
    } finally {
      setLoading(false);
    }
  };

  const score = result?.score || 0;

  return (
    <div
      style={{
        marginTop: "30px",
        backgroundColor: colors.card,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        borderRadius: "18px",
        padding: "30px",
        boxShadow: darkMode
          ? "0 10px 30px rgba(0, 0, 0, 0.25)"
          : "0 10px 30px rgba(15, 23, 42, 0.08)",
        transition:
          "background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease",
      }}
    >
      <h2
        style={{
          color: colors.text,
          marginTop: 0,
          marginBottom: "10px",
          fontSize: "22px",
          fontWeight: 700,
        }}
      >
        ATS Resume Analyzer
      </h2>

      <p
        style={{
          color: colors.subText,
          marginTop: 0,
          lineHeight: 1.6,
        }}
      >
        Analyze your uploaded resume against a Job Description.
      </p>

      <textarea
        rows={10}
        placeholder="Paste Job Description..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "15px",
          borderRadius: "10px",
          border: `1px solid ${colors.border}`,
          backgroundColor: colors.cardSecondary,
          color: colors.text,
          outline: "none",
          resize: "vertical",
          marginTop: "20px",
          fontSize: "14px",
          lineHeight: 1.6,
          transition:
            "background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease",
        }}
      />

      <button
        onClick={checkScore}
        disabled={loading}
        style={{
          marginTop: "25px",
          width: "100%",
          padding: "15px",
          border: "none",
          borderRadius: "12px",
          backgroundColor: loading ? "#64748b" : colors.button,
          color: "#ffffff",
          fontWeight: "bold",
          fontSize: "15px",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background-color 0.3s ease",
        }}
      >
        {loading ? "Analyzing..." : "Check ATS Score"}
      </button>

      {result && (
        <div
          style={{
            marginTop: "30px",
            paddingTop: "25px",
            borderTop: `1px solid ${colors.border}`,
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: colors.text,
              fontSize: "20px",
            }}
          >
            ATS Score
          </h2>

          <h1
            style={{
              color: "#2563eb",
              fontSize: "42px",
              margin: "15px 0",
              fontWeight: 700,
            }}
          >
            {score}%
          </h1>

          <h3
            style={{
              color: colors.text,
              fontSize: "16px",
              marginTop: "25px",
              marginBottom: "15px",
            }}
          >
            Missing Skills
          </h3>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            {result.missing_skills?.length ? (
              result.missing_skills.map((skill, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: colors.dangerBg,
                    color: colors.dangerText,
                    padding: "8px 14px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  {skill}
                </span>
              ))
            ) : (
              <span
                style={{
                  backgroundColor: colors.successBg,
                  color: colors.successText,
                  padding: "8px 14px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                No Missing Skills 🎉
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}