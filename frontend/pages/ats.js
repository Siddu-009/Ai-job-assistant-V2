import { useState } from "react";
import Layout from "../components/Layout";

export default function ATSAnalyzer() {

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

      if (!response.ok) {

    	  console.error(data);

	  alert(data.detail || data.message || JSON.stringify(data));

	  return;

      }

      if (data.success === false) {

	  alert(data.message);

	  return;

      }

      setResult(data);

    }
    catch (err) {

      console.error(err);

      alert(err.message);

    }

    setLoading(false);

  };

  const score = result?.score || 0;

  return (

    <Layout>

      <div
        style={{
          maxWidth: "1100px",
          margin: "40px auto",
          background: "#fff",
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
            color: "#6b7280"
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

              <h2>

                ATS Score

              </h2>

              <div

                style={{

                  fontSize:"70px",

                  fontWeight:"bold",

                  color:"#2563eb"

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

                  result.missing_skills?.length

                  ?

                  result.missing_skills.map(

                    (skill,index)=>(

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

            </div>

          )

        }

      </div>

    </Layout>

  );

}
