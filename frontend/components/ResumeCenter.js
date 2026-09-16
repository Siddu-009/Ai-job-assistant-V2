import { useState } from "react";
import Button from "./ui/Button";
import Loader from "./ui/Loader";
import { useTheme } from "../context/ThemeContext";

export default function ResumeCenter() {
  const { colors, darkMode } = useTheme();

  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const generateResume = async () => {
    if (!jobDescription.trim()) {
      alert("Please enter Job Description.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      window.location.href = "/login";
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/generate/", {
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
        alert(
          data.message ||
            data.detail ||
            "Resume generation failed."
        );
        return;
      }

      alert("Resume Generated Successfully.");
    } catch (error) {
      console.error("Generate Resume Error:", error);
      alert("Unable to generate resume.");
    } finally {
      setLoading(false);
    }
  };

  const downloadTXT = () => {
    window.open("/api/download/resume-txt", "_blank");
  };

  const downloadPDF = () => {
    window.open("/api/download/resume-pdf", "_blank");
  };

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
          marginTop: 0,
          color: colors.text,
          fontSize: "22px",
          fontWeight: 700,
        }}
      >
        Resume Center
      </h2>

      <p
        style={{
          color: colors.subText,
          lineHeight: 1.6,
        }}
      >
        Generate an AI optimized resume using your latest uploaded resume.
      </p>

      <textarea
        rows={10}
        placeholder="Paste Job Description Here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "15px",
          borderRadius: "12px",
          border: `1px solid ${colors.border}`,
          backgroundColor: colors.cardSecondary,
          color: colors.text,
          marginTop: "20px",
          resize: "vertical",
          fontSize: "15px",
          lineHeight: 1.6,
          outline: "none",
          transition:
            "background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease",
        }}
      />

      <div style={{ marginTop: "25px" }}>
        {loading ? (
          <Loader text="Generating Resume..." />
        ) : (
          <Button fullWidth onClick={generateResume}>
            Generate Resume
          </Button>
        )}
      </div>

      <div
        style={{
          marginTop: "35px",
          borderTop: `1px solid ${colors.border}`,
          paddingTop: "25px",
        }}
      >
        <h3
          style={{
            color: colors.text,
            marginTop: 0,
            fontSize: "18px",
          }}
        >
          Downloads
        </h3>

        <div
          style={{
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <Button variant="secondary" onClick={downloadTXT}>
            Download TXT
          </Button>

          <Button variant="primary" onClick={downloadPDF}>
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
}