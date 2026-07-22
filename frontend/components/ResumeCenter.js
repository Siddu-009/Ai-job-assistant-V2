import { useState } from "react";
import Button from "./ui/Button";
import Loader from "./ui/Loader";

export default function ResumeCenter() {

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
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token,
          job_description: jobDescription
        })
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
        background: "#ffffff",
        borderRadius: "18px",
        padding: "30px",
        boxShadow: "0 10px 30px rgba(0,0,0,.08)"
      }}
    >

      <h2>Resume Center</h2>

      <p style={{ color: "#6b7280" }}>
        Generate an AI optimized resume using your latest uploaded resume.
      </p>

      <textarea
        rows="10"
        placeholder="Paste Job Description Here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        style={{
          width: "100%",
          padding: "15px",
          borderRadius: "12px",
          border: "1px solid #d1d5db",
          marginTop: "20px",
          resize: "vertical",
          fontSize: "15px"
        }}
      />

      <div style={{ marginTop: "25px" }}>

        {
          loading
            ? <Loader text="Generating Resume..." />
            : (
              <Button
                fullWidth
                onClick={generateResume}
              >
                Generate Resume
              </Button>
            )
        }

      </div>

      <div
        style={{
          marginTop: "35px",
          borderTop: "1px solid #e5e7eb",
          paddingTop: "25px"
        }}
      >

        <h3>Downloads</h3>

        <div
          style={{
            display: "flex",
            gap: "15px",
            flexWrap: "wrap"
          }}
        >

          <Button
            variant="secondary"
            onClick={downloadTXT}
          >
            Download TXT
          </Button>

          <Button
            variant="primary"
            onClick={downloadPDF}
          >
            Download PDF
          </Button>

        </div>

      </div>

    </div>

  );

}