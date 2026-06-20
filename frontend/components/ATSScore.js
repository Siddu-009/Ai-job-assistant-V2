import { useState } from "react";

export default function ATSScore() {

  const [resume, setResume] = useState("");

  const [jobDescription, setJobDescription] = useState("");

  const [result, setResult] = useState(null);

  const checkScore = async () => {

    const response = await fetch(
      "/api/ats-score/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          resume,
          job_description: jobDescription
        })
      }
    );

    const data = await response.json();

    setResult(data);
  };

  return (
    <div
      style={{
        marginTop: "30px",
        border: "1px solid #ddd",
        padding: "20px",
        borderRadius: "10px"
      }}
    >
      <h2>
        ATS Score Checker
      </h2>

      <textarea
        rows="6"
        placeholder="Paste Resume Text"
        value={resume}
        onChange={(e) =>
          setResume(
            e.target.value
          )
        }
        style={{
          width: "100%"
        }}
      />

      <br />
      <br />

      <textarea
        rows="6"
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
        onClick={checkScore}
      >
        Check ATS Score
      </button>

      {
        result && (
          <div
            style={{
              marginTop: "20px"
            }}
          >
            <h3>
              ATS Score:
              {" "}
              {result.score}%
            </h3>

            <h4>
              Missing Skills
            </h4>

            <ul>
              {
                result.missing_skills?.map(
                  (
                    skill,
                    index
                  ) => (
                    <li key={index}>
                      {skill}
                    </li>
                  )
                )
              }
            </ul>
          </div>
        )
      }
    </div>
  );
}
