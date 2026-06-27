import { useState } from "react";

export default function ATSAnalyzer() {

  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {

    if (!resume || !jobDescription) {
      alert("Please enter Resume and Job Description");
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
            resume,
            job_description: jobDescription
          })
        }
      );

      const data = await response.json();

      setResult(data);

    } catch {

      alert("Unable to analyze.");

    }

    setLoading(false);

  };

  const score = result?.score || 0;

  return (

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

      <h1>ATS Resume Analyzer</h1>

      <p style={{color:"#6b7280"}}>

        Analyze your resume against any Job Description.

      </p>

      <textarea
        rows="10"
        value={resume}
        placeholder="Paste Resume..."
        onChange={(e)=>setResume(e.target.value)}
        style={{
          width:"100%",
          marginTop:"25px",
          padding:"15px",
          borderRadius:"12px"
        }}
      />

      <textarea
        rows="10"
        value={jobDescription}
        placeholder="Paste Job Description..."
        onChange={(e)=>setJobDescription(e.target.value)}
        style={{
          width:"100%",
          marginTop:"20px",
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

          fontSize:"17px"

        }}

      >

        {

          loading

          ?

          "Analyzing..."

          :

          "Analyze Resume"

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

                result.missing_skills?.map(

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

              }

            </div>

          </div>

        )

      }

    </div>

  );

}
