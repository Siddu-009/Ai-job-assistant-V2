import { useState } from "react";

export default function ResumeUpload() {

  const [file, setFile] = useState(null);

  const [skills, setSkills] = useState([]);

  const uploadResume = async () => {

    const formData = new FormData();

    formData.append(
      "file",
      file
    );

    const response = await fetch(
      "/api/resume/upload",
      {
        method: "POST",
        body: formData
      }
    );

    const data = await response.json();

    setSkills(
      data.skills || []
    );
  };

  return (
    <div
      style={{
        marginTop: "40px",
        border: "1px solid #ddd",
        padding: "20px",
        borderRadius: "10px"
      }}
    >
      <h2>Upload Resume</h2>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) =>
          setFile(
            e.target.files[0]
          )
        }
      />

      <br />
      <br />

      <button
        onClick={uploadResume}
      >
        Upload Resume
      </button>

      <h3>
        Detected Skills
      </h3>

      <ul>
        {
          skills.map(
            (skill, index) => (
              <li key={index}>
                {skill}
              </li>
            )
          )
        }
      </ul>
    </div>
  );
}
