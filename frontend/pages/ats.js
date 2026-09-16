import { useState } from "react";
import Layout from "../components/Layout";
import { useTheme } from "../context/ThemeContext";

export default function ATSAnalyzer() {
  const { colors } = useTheme();

  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {

    const token = localStorage.getItem("token");

    if (!token) {

      window.location.href = "/login";

      return;

    }

    if (!jobDescription) {

      alert("Please enter Job Description");

      return;

    }

    setLoading(true);

    try {

      const response = await fetch(
        "/api/ats-score/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            token,
            job_description: jobDescription
          })
        }
      );

      const data = await response.json();

      console.log("Full Response:", data);
      console.log("Analysis:", data.analysis);

      if (!response.ok) {

    	  console.error(data);

	  alert(data.detail || data.message || JSON.stringify(data));

	  return;

      }

      if (data.success === false) {

	  alert(data.message);

	  return;

      }

      setResult(data.analysis);
      console.log("Result being stored:", data.analysis);

    }
    catch (err) {

      console.error(err);

      alert(err.message);

    }

    finally {

      setLoading(false);

    }

  };
  console.log("Current Result State:", result);

  const score =
    result?.overall_score ??
    result?.ats_score ??
    result?.score ??
    0;

  return (

    <Layout>

      <div
        style={{
          maxWidth: "1100px",
          margin: "40px auto",
          background: colors.card,
          border: colors.borderStyle,
          padding: "35px",
          borderRadius: "20px",
          boxShadow: "0 15px 35px rgba(0,0,0,.08)"
        }}
      >

        <h1>

          ATS Resume Analyzer

        </h1>

        <p
          style={{
            color: colors.subText
          }}
        >

          Analyze your uploaded resume against any Job Description.

        </p>

        <textarea
          rows="10"
          value={jobDescription}
          placeholder="Paste Job Description..."
          onChange={(e)=>setJobDescription(e.target.value)}
          style={{
            width:"100%",
            marginTop:"25px",
            padding:"15px",
            borderRadius:"12px"
          }}
        />

        <button

          onClick={analyze}

          disabled={loading}

          style={{

            marginTop:"25px",

            width:"100%",

            padding:"16px",

            border:"none",

            borderRadius:"12px",

            background:"#2563eb",

            color:"#fff",

            fontSize:"17px",

            cursor:"pointer"

          }}

        >

          {

            loading

            ?

            "Analyzing..."

            :

            "Check ATS Score"

          }

        </button>

        {

          result && (

            <div

              style={{

                marginTop:"40px"

              }}

            >

              <h3
                style={{
                  marginTop: "20px",
                  color: "#374151"
                }}
              >
                Overall Score: {result?.overall_score}/100
              </h3>

              <div
                style={{
                  fontSize: "70px",
                  fontWeight: "bold",
                  color:
                    score >= 80
                      ? "#16a34a"
                      : score >= 60
                      ? "#f59e0b"
                      : "#dc2626"
                }}
              >
                {score}%
              </div>

              <div

                style={{

                  width:"100%",

                  height:"15px",

                  background:"#e5e7eb",

                  borderRadius:"20px",

                  overflow:"hidden",

                  marginTop:"20px"

                }}

              >

                <div

                  style={{

                    width:`${score}%`,

                    height:"15px",

                    background:

                      score>=80

                      ?"green"

                      :

                      score>=60

                      ?"orange"

                      :

                      "red"

                  }}

                />

              </div>

              <h3

                style={{

                  marginTop:"35px"

                }}

              >

                Missing Skills

              </h3>

              <div

                style={{

                  display:"flex",

                  flexWrap:"wrap",

                  gap:"12px"

                }}

              >

                {

                  result?.job_match?.missing_keywords?.length

                  ?

                  result.job_match.missing_keywords.map((skill, index) => (

                      <span

                        key={index}

                        style={{

                          background:"#fee2e2",

                          color:"#991b1b",

                          padding:"8px 15px",

                          borderRadius:"25px"

                        }}

                      >

                        {skill}

                      </span>

                    )

                  )

                  :

                  <span
                    style={{
                      color:"green",
                      fontWeight:"bold"
                    }}
                  >
                    No Missing Skills 🎉
                  </span>

                }

              </div>

              <h3 style={{ marginTop: "35px" }}>
                Matched Keywords
              </h3>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px"
                }}
              >
                {result?.job_match?.matched_keywords?.length ? (
                  result.job_match.matched_keywords.map((skill, index) => (
                    <span
                      key={index}
                      style={{
                        background: "#dcfce7",
                        color: "#166534",
                        padding: "8px 15px",
                        borderRadius: "25px"
                      }}
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span>No matched keywords.</span>
                )}
              </div>

              <h3 style={{ marginTop: "35px" }}>
                Strengths
              </h3>

              <ul>
                {result?.strengths?.map((item, index) => (
                  <li
                    key={index}
                    style={{
                      color: "#166534",
                      marginBottom: "8px"
                    }}
                  >
                    ✅ {item}
                  </li>
                ))}
              </ul>

              <h3 style={{ marginTop: "35px" }}>
                Weaknesses
              </h3>

              <ul>
                {result?.weaknesses?.map((item, index) => (
                  <li
                    key={index}
                    style={{
                      color: "#991b1b",
                      marginBottom: "8px"
                    }}
                  >
                    ❌ {item}
                  </li>
                ))}
              </ul>

              <h3 style={{ marginTop: "35px" }}>
                AI Suggestions
              </h3>

              <ul>
                {result?.suggestions?.map((item, index) => (
                  <li
                    key={index}
                    style={{
                      color: "#1d4ed8",
                      marginBottom: "8px"
                    }}
                  >
                    💡 {item}
                  </li>
                ))}
              </ul>

              <h3 style={{ marginTop: "35px" }}>
                ATS Breakdown
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "15px",
                  marginTop: "20px"
                }}
              >

                {Object.entries(result?.ats_breakdown || {}).map(
                  ([key, value]) => (

                    <div
                      key={key}
                      style={{
                        background: "#f8fafc",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        padding: "18px"
                      }}
                    >

                      <div
                        style={{
                          fontWeight: "600",
                          textTransform: "capitalize",
                          marginBottom: "10px"
                        }}
                      >
                        {key.replace(/_/g, " ")}
                      </div>

                      <div
                        style={{
                          fontSize: "30px",
                          color: "#2563eb",
                          fontWeight: "700"
                        }}
                      >
                        {value} pts
                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

          )

        }

      </div>

    </Layout>

  );

}
