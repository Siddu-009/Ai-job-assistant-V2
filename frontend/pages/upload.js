import { useState } from "react";
import api from "../services/api";
import { useTheme } from "../context/ThemeContext";

export default function UploadPage() {
  const { colors } = useTheme();

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const uploadResume = async () => {
    if (!file) {
      alert("Please choose a resume.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("token", token);
    formData.append("file", file);

    try {
      const { data } = await api.post(
        "/resume/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(data.message || "Resume uploaded successfully.");

      console.log("Resume Text:", data.resume_text);
      console.log("Skills:", data.skills);
    } catch (err) {
      console.error(err);

      setMessage(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        background: colors.card,
        border: colors.borderStyle,
        borderRadius: "20px",
        padding: "40px",
        boxShadow: "0 15px 35px rgba(0,0,0,.08)",
      }}
    >
      <h1 style={{ color: colors.text }}>Resume Upload</h1>

      <p
        style={{
          color: colors.subText,
        }}
      >
        Upload your Resume for ATS Analysis, Resume Builder and AI Job
        Matching.
      </p>

      <div
        style={{
          marginTop: "30px",
          border: "2px dashed #2563eb",
          borderRadius: "18px",
          padding: "60px",
          textAlign: "center",
          background: colors.background,
        }}
      >
        <h2 style={{ color: colors.text }}>📄 Drag & Drop Resume</h2>

        <p style={{ color: colors.subText }}>PDF / DOCX Supported</p>

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      {file && (
        <div
          style={{
            marginTop: "25px",
            padding: "18px",
            background: colors.card,
            border: colors.borderStyle,
            borderRadius: "12px",
            color: colors.text,
          }}
        >
          <strong>Selected File</strong>

          <br />

          {file.name}
        </div>
      )}

      <button
        onClick={uploadResume}
        disabled={uploading}
        style={{
          marginTop: "30px",
          width: "100%",
          padding: "16px",
          border: "none",
          borderRadius: "12px",
          background: "#2563eb",
          color: "#fff",
          fontSize: "17px",
          cursor: "pointer",
        }}
      >
        {uploading ? "Uploading..." : "Upload Resume"}
      </button>

      {message && (
        <div
          style={{
            marginTop: "25px",
            padding: "18px",
            borderRadius: "12px",
            background: message.toLowerCase().includes("success")
              ? colors.successBg
              : colors.dangerBg,
            color: message.toLowerCase().includes("success")
              ? colors.successText
              : colors.dangerText,
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}