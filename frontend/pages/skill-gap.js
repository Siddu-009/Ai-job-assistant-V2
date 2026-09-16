import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function SkillGap() {
  const { colors } = useTheme();

  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {

    if (!resume || !jobDescription) {

      alert("Please paste Resume and Job Description.");

      return;

    }

    setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login.");
        setLoading(false);
        return;
      }

    try {

      const response = await fetch(

        "/api/skill-gap/",

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json"

          },

          body: JSON.stringify({

            token,

            resume_text: resume,

            job_description: jobDescription

          })

        }

      );

      const data = await response.json();

      console.log(data);

      setResult(data);

    }

    catch (err) {

      console.error(err);

      alert("Unable to analyze skill gap.");

    }

    finally {

      setLoading(false);

    }

  };

  return (

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

      <h1>AI Skill Gap Analyzer</h1>

      <p
        style={{
          color: colors.subText
        }}
      >
        Compare your resume against a Job Description.
      </p>

      <textarea
        rows="10"
        placeholder="Paste Resume Here..."
        value={resume}
        onChange={(e)=>setResume(e.target.value)}
        style={textarea}
      />

      <textarea
        rows="10"
        placeholder="Paste Job Description Here..."
        value={jobDescription}
        onChange={(e)=>setJobDescription(e.target.value)}
        style={textarea}
      />

      <button
        onClick={analyze}
        disabled={loading}
        style={button}
      >

        {

          loading

            ? "Analyzing..."

            : "Analyze Skill Gap"

        }

      </button>

      {

        result &&

        <div
          style={{
            marginTop:"35px"
          }}
        >

          <h2>Skill Gap Result</h2>

          <div
            style={{
              background:"#f8fafc",
              padding:"20px",
              borderRadius:"12px",
              border:"1px solid #e5e7eb"
            }}
          >

            <pre
              style={{
                whiteSpace:"pre-wrap",
                wordBreak:"break-word",
                fontFamily:"inherit",
                lineHeight:"1.7"
              }}
            >

              {JSON.stringify(result,null,2)}

            </pre>

          </div>

        </div>

      }

    </div>

  );

}

const textarea={

  width:"100%",

  padding:"14px",

  marginTop:"20px",

  borderRadius:"10px",

  border:"1px solid #d1d5db",

  fontSize:"15px"

};

const button={

  width:"100%",

  padding:"16px",

  marginTop:"25px",

  border:"none",

  borderRadius:"12px",

  background:"#2563eb",

  color:"#fff",

  fontSize:"17px",

  cursor:"pointer"

};
