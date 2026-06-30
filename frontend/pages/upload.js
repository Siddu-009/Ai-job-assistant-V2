import { useState } from "react";

export default function UploadPage() {

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

      const response = await fetch(
        "/api/resume/upload",
        {
          method: "POST",
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {

        setMessage(
          data.detail ||
          data.message ||
          "Resume upload failed."
        );

      } else {

        setMessage(
          data.message ||
          "Resume uploaded successfully."
        );

        console.log("Resume Text:", data.resume_text);
        console.log("Skills:", data.skills);

      }

    }

    catch (err) {

      console.error(err);

      setMessage("Upload failed.");

    }

    finally {

      setUploading(false);

    }

  };

  return (

    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        background: "#fff",
        borderRadius: "20px",
        padding: "40px",
        boxShadow: "0 15px 35px rgba(0,0,0,.08)"
      }}
    >

      <h1>Resume Upload</h1>

      <p
        style={{
          color: "#6b7280"
        }}
      >
        Upload your Resume for ATS Analysis,
        Resume Builder and AI Job Matching.
      </p>

      <div
        style={{
          marginTop: "30px",
          border: "2px dashed #2563eb",
          borderRadius: "18px",
          padding: "60px",
          textAlign: "center",
          background: "#f8fbff"
        }}
      >

        <h2>📄 Drag & Drop Resume</h2>

        <p>PDF / DOCX Supported</p>

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files[0])}
        />

      </div>

      {

        file && (

          <div
            style={{
              marginTop: "25px",
              padding: "18px",
              background: "#f3f4f6",
              borderRadius: "12px"
            }}
          >

            <strong>Selected File</strong>

            <br />

            {file.name}

          </div>

        )

      }

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
          cursor: "pointer"
        }}
      >

        {

          uploading

            ? "Uploading..."

            : "Upload Resume"

        }

      </button>

      {

        message && (

          <div
            style={{
              marginTop: "25px",
              padding: "18px",
              borderRadius: "12px",
              background: "#dcfce7",
              color: "#166534"
            }}
          >

            {message}

          </div>

        )

      }

    </div>

  );

}
