import { useState } from "react";

export default function ATSScore() {

  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkScore = async () => {

    if (!resume || !jobDescription) {
      alert("Please enter Resume and Job Description");
      return;
    }

    setLoading(true);

    try {

      const response = await fetch("/api/ats-score/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          resume,
          job_description: jobDescription
        })
      });

      const data = await response.json();

      setResult(data);

    } catch (error) {

      console.error(error);

      alert("Unable to calculate ATS Score.");

    }

    setLoading(false);

  };

  const score = result?.score || 0;

  return (

    <div
      style={{
        marginTop: "30px",
        background: "#ffffff",
        borderRadius: "18px",
        padding: "30px",
        boxShadow: "0 10px 30px rgba(0,0,0,.08)"
      }}
    >

      <h2
        style={{
          marginTop: 0
        }}
      >
        ATS Resume Analyzer
      </h2>

      <p
        style={{
          color: "#6b7280"
        }}
      >
        Compare your resume against a job description.
      </p>

      <textarea
        rows="8"
        placeholder="Paste Resume..."
        value={resume}
        onChange={(e)=>setResume(e.target.value)}
        style={{
          width:"100%",
          padding:"15px",
          borderRadius:"10px",
          border:"1px solid #d1d5db",
          resize:"vertical",
          marginTop:"20px"
        }}
      />

      <textarea
        rows="8"
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
          background:"linear-gradient(135deg,#2563eb,#7c3aed)",
          color:"#fff",
          fontWeight:"bold",
          cursor:"pointer",
          fontSize:"16px"
        }}
      >
        {loading ? "Analyzing Resume..." : "Check ATS Score"}
      </button>

      {result !== null && (

        <div
          style={{
            marginTop:"35px"
          }}
        >

          <div
            style={{
              display:"flex",
              justifyContent:"space-between",
              alignItems:"center"
            }}
          >

            <h3>ATS Score</h3>

            <h1
              style={{
                color:"#2563eb",
                margin:0
              }}
            >
              {score}%
            </h1>

          </div>

          <div
            style={{
              width:"100%",
              height:"12px",
              borderRadius:"10px",
              background:"#e5e7eb",
              marginTop:"15px"
            }}
          >

            <div
              style={{
                width:`${score}%`,
                height:"12px",
                borderRadius:"10px",
                background:
                  score >= 80
                    ? "#22c55e"
                    : score >= 60
                    ? "#f59e0b"
                    : "#ef4444"
              }}
            />

          </div>

          <h3
            style={{
              marginTop:"30px"
            }}
          >
            Missing Skills
          </h3>

          <div
            style={{
              display:"flex",
              flexWrap:"wrap",
              gap:"10px"
            }}
          >

            {result.missing_skills?.length > 0 ? (

              result.missing_skills.map((skill,index)=>(

                <span
                  key={index}
                  style={{
                    background:"#fee2e2",
                    color:"#991b1b",
                    padding:"8px 14px",
                    borderRadius:"25px",
                    fontSize:"14px"
                  }}
                >
                  {skill}
                </span>

              ))

            ) : (

              <span
                style={{
                  color:"#16a34a"
                }}
              >
                No missing skills 🎉
              </span>

            )}

          </div>

        </div>

      )}

    </div>

  );

}
