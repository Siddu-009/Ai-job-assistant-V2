import { useState } from "react";

export default function CoverLetter() {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!jobTitle || !company || !jobDescription) {
      alert("Please complete all fields.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/cover-letter/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          job_title: jobTitle,
          company,
          job_description: jobDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.detail ||
            data.message ||
            "Unable to generate cover letter."
        );
        setLoading(false);
        return;
      }

      setCoverLetter(
        data.cover_letter ||
          data.result ||
          ""
      );
    } catch (err) {
      console.error(err);
      alert("Unable to generate cover letter.");
    }

    setLoading(false);
  };

  const copyLetter = () => {
    navigator.clipboard.writeText(coverLetter);
    alert("Copied!");
  };

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "40px auto",
        background: "#fff",
        padding: "35px",
        borderRadius: "20px",
        boxShadow: "0 15px 35px rgba(0,0,0,.08)",
      }}
    >
      <h1>AI Cover Letter Generator</h1>

      <p style={{ color: "#6b7280" }}>
        Generate a professional cover letter in seconds.
      </p>

      <input
        placeholder="Job Title"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        style={input}
      />

      <input
        placeholder="Company Name"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        style={input}
      />

      <textarea
        rows="8"
        placeholder="Paste Job Description"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        style={textarea}
      />

      <button
        onClick={generate}
        disabled={loading}
        style={button}
      >
        {loading ? "Generating..." : "Generate Cover Letter"}
      </button>

      {coverLetter && (
        <div style={{ marginTop: "35px" }}>
          <h2>Generated Cover Letter</h2>

          <textarea
            rows="18"
            value={coverLetter}
            readOnly
            style={textarea}
          />

          <button
            onClick={copyLetter}
            style={greenButton}
          >
            Copy Cover Letter
          </button>
        </div>
      )}
    </div>
  );
}

const input = {
  width: "100%",
  padding: "14px",
  marginTop: "20px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
};

const textarea = {
  width: "100%",
  padding: "14px",
  marginTop: "20px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
};

const button = {
  width: "100%",
  padding: "16px",
  marginTop: "25px",
  border: "none",
  borderRadius: "12px",
  background: "#2563eb",
  color: "#fff",
  fontSize: "17px",
  cursor: "pointer",
};

const greenButton = {
  width: "100%",
  padding: "16px",
  marginTop: "20px",
  border: "none",
  borderRadius: "12px",
  background: "#16a34a",
  color: "#fff",
  fontSize: "16px",
  cursor: "pointer",
};