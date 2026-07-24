import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function ATSScore() {

  const { colors } = useTheme();

  const [jobDescription, setJobDescription] = useState("");

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const checkScore = async () => {

    if (!jobDescription) {

      alert("Please enter Job Description.");

      return;

    }

    const token = localStorage.getItem("token");

    if (!token) {

      window.location.href = "/login";

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

      if (!response.ok || data.success === false) {

        alert(

          data.message ||

          "Unable to analyze ATS."

        );

        return;

      }

      setResult(data);

    }

    catch (error) {

      console.error(error);

      alert("Unable to calculate ATS Score.");

    }

    finally {

      setLoading(false);

    }

  };

  const score = result?.score || 0;

  return (

    <div
      style={{
        marginTop: "30px",
        background: colors.card,
        color: colors.text,
        border: colors.borderStyle,
        borderRadius: "18px",
        padding: "30px",
        boxShadow: "0 10px 30px rgba(0,0,0,.08)"
      }}
    >

      <h2
        style={{
          color: colors.text,
          marginBottom: "10px",
        }}
      >
        ATS Resume Analyzer
      </h2>

      <p style={{ color: colors.subText }}>

        
        Analyze your uploaded resume against a Job Description.
      </p>

      <textarea
        rows="10"
        placeholder="Paste Job Description..."
        value={jobDescription}
        onChange={(e)=>setJobDescription(e.target.value)}
        style={{
          width:"100%",
          padding:"15px",
          borderRadius:"10px",
          border:"1px solid #d1d5db",
          resize:"vertical",
          marginTop:"20px"
        }}
      />

      <button
        onClick={checkScore}
        disabled={loading}
        style={{
          marginTop:"25px",
          width:"100%",
          padding:"15px",
          border:"none",
          borderRadius:"12px",
          background:"#2563eb",
          color:"#fff",
          fontWeight:"bold",
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
              marginTop:"30px"
            }}
          >

            <h2>

              ATS Score

            </h2>

            <h1
              style={{
                color:"#2563eb"
              }}
            >

              {score}%

            </h1>

            <h3>

              Missing Skills

            </h3>

            <div
              style={{
                display:"flex",
                gap:"10px",
                flexWrap:"wrap"
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
                        padding:"8px 14px",
                        borderRadius:"20px"
                      }}
                    >

                      {skill}

                    </span>

                  )

                )

                :

                <span
                  style={{
                    color:"green"
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

  );

}
