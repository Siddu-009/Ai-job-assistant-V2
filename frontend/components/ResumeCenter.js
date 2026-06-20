import { useState } from "react";

export default function ResumeCenter() {

  const [filename, setFilename] =
    useState("");

  const [jobDescription, setJobDescription] =
    useState("");

  const generateATSResume = async () => {

    const response = await fetch(
      "/api/auto-resume/",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          filename,
          job_description:
            jobDescription
        })
      }
    );

    const data =
      await response.json();

    alert(
      data.message ||
      JSON.stringify(data)
    );
  };

  const downloadTXT = () => {

    window.open(
      "/api/download/resume-txt",
      "_blank"
    );

  };

  const downloadPDF = () => {

    window.open(
      "/api/download/resume-pdf",
      "_blank"
    );

  };

  const downloadATS = () => {

    window.open(
      "/api/download/ats-resume",
      "_blank"
    );

  };

  return (

    <div
      style={{
        marginTop: "30px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "20px",
        background: "white"
      }}
    >

      <h2>
        Resume Center
      </h2>

      <input
        type="text"
        placeholder="Uploaded Resume Filename"
        value={filename}
        onChange={(e) =>
          setFilename(
            e.target.value
          )
        }
        style={{
          width: "100%",
          padding: "10px"
        }}
      />

      <br />
      <br />

      <textarea
        rows="5"
        placeholder="Paste Job Description"
        value={jobDescription}
        onChange={(e) =>
          setJobDescription(
            e.target.value
          )
        }
        style={{
          width: "100%"
        }}
      />

      <br />
      <br />

      <button
        onClick={
          generateATSResume
        }
      >
        Generate ATS Resume
      </button>

      <hr />

      <button
        onClick={downloadTXT}
      >
        Download TXT
      </button>

      {" "}

      <button
        onClick={downloadPDF}
      >
        Download PDF
      </button>

      {" "}

      <button
        onClick={downloadATS}
      >
        Download ATS Resume
      </button>

    </div>

  );

}
