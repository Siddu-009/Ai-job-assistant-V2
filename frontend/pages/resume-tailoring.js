import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function ResumeTailoring() {
  const { colors } = useTheme();

  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tailoredResume, setTailoredResume] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const tailorResume = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      alert("Please enter Resume and Job Description.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    setLoading(true);
    setTailoredResume("");
    setDownloadUrl("");

    try {
      const response = await fetch(
        "/api/resume-tailoring/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            token: token,
            resume: resume,
            job_description: jobDescription
          })
        }
      );

      const data = await response.json().catch(() => ({}));

      console.log("Resume Tailoring Response:", data);

      if (!response.ok) {
        alert(
          data.message ||
          data.detail ||
          "Resume tailoring failed."
        );
        return;
      }

      if (data.success === false) {
        alert(
          data.message ||
          "Resume tailoring failed."
        );
        return;
      }

      setTailoredResume(
        data.tailored_resume || ""
      );

      setDownloadUrl(
        data.download_url || ""
      );

    } catch (error) {
      console.error(
        "Resume Tailoring Error:",
        error
      );

      alert(
        "Unable to generate tailored resume. Please check Ollama and backend."
      );

    } finally {
      setLoading(false);
    }
  };

  const copyResume = async () => {
    if (!tailoredResume) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        tailoredResume
      );

      alert(
        "Tailored resume copied successfully!"
      );

    } catch (error) {
      console.error(error);
      alert("Unable to copy resume.");
    }
  };

  const downloadResume = () => {
    if (!downloadUrl) {
      alert("Download link is not available.");
      return;
    }

    window.open(
      downloadUrl,
      "_blank"
    );
  };

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "40px auto",
        background: colors.card,
        border: colors.borderStyle,
        padding: "35px",
        borderRadius: "20px",
        boxShadow: "0 15px 35px rgba(0,0,0,.08)"
      }}
    >

      <h1
        style={{
          color: colors.text
        }}
      >
        Resume Tailoring
      </h1>

      <p
        style={{
          color: colors.subText
        }}
      >
        Customize your resume for a specific job
        description using AI.
      </p>

      {/* RESUME */}

      <textarea
        rows="14"
        placeholder="Paste your existing resume here..."
        value={resume}
        onChange={(e) =>
          setResume(e.target.value)
        }
        style={textarea}
      />

      {/* JOB DESCRIPTION */}

      <textarea
        rows="14"
        placeholder="Paste the Job Description here..."
        value={jobDescription}
        onChange={(e) =>
          setJobDescription(e.target.value)
        }
        style={textarea}
      />

      {/* GENERATE */}

      <button
        onClick={tailorResume}
        disabled={loading}
        style={{
          ...button,
          opacity: loading ? 0.7 : 1,
          cursor: loading
            ? "not-allowed"
            : "pointer"
        }}
      >
        {loading
          ? "Generating Tailored Resume..."
          : "Generate Tailored Resume"}
      </button>

      {/* RESULT */}

      {tailoredResume && (
        <div
          style={{
            marginTop: "40px",
            padding: "25px",
            background:
              colors.cardSecondary ||
              "#f8fafc",
            borderRadius: "16px",
            border: colors.borderStyle
          }}
        >

          <h2
            style={{
              color: colors.text
            }}
          >
            ✅ Tailored Resume Generated
          </h2>

          <p
            style={{
              color: colors.subText,
              lineHeight: 1.7
            }}
          >
            Your resume has been optimized
            according to the job description.
          </p>

          {/* DOWNLOAD BUTTON */}

          {downloadUrl && (
            <button
              onClick={downloadResume}
              style={{
                ...downloadButton
              }}
            >
              📄 Download Word Resume
            </button>
          )}

          {/* COPY BUTTON */}

          <button
            onClick={copyResume}
            disabled={!tailoredResume}
            style={{
              ...copyButton,
              opacity: !tailoredResume
                ? 0.6
                : 1
            }}
          >
            📋 Copy Resume
          </button>

          {/* PREVIEW */}

          <h3
            style={{
              marginTop: "30px",
              color: colors.text
            }}
          >
            Resume Preview
          </h3>

          <textarea
            rows="22"
            readOnly
            value={tailoredResume}
            style={{
              ...textarea,
              background:
                colors.card ||
                "#ffffff",
              color:
                colors.text ||
                "#111827",
              lineHeight: 1.6
            }}
          />

        </div>
      )}

    </div>
  );
}

const textarea = {
  width: "100%",
  padding: "15px",
  marginTop: "20px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  fontFamily: "inherit",
  boxSizing: "border-box",
  resize: "vertical"
};

const button = {
  width: "100%",
  padding: "16px",
  marginTop: "25px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  fontSize: "17px",
  fontWeight: "600"
};

const downloadButton = {
  padding: "14px 22px",
  marginTop: "20px",
  marginRight: "12px",
  background: "#16a34a",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer"
};

const copyButton = {
  padding: "14px 22px",
  marginTop: "20px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer"
};