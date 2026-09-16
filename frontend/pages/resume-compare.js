import { useState } from "react";
import api from "../services/api";
import { useTheme } from "../context/ThemeContext";

export default function ResumeCompare() {
  const { colors } = useTheme();

  const [resume1, setResume1] = useState("");
  const [resume2, setResume2] = useState("");
  const [comparison, setComparison] = useState("");
  const [loading, setLoading] = useState(false);

  const compareResumes = async () => {

    if (!resume1.trim() || !resume2.trim()) {
      alert("Please paste both resumes.");
      return;
    }

    setLoading(true);

    try {

      const { data } = await api.post(
        "/resume-recommend/compare",
        {
          resume_one: resume1,
          resume_two: resume2
        }
      );

      setComparison(data.comparison || "");

    } catch (err) {

      console.error(err);

      alert("Unable to compare resumes.");

    }

    setLoading(false);
  };

  function getSection(title, nextTitles = []) {

    if (!comparison) return "";

    let start = comparison.indexOf(title);

    if (start === -1) return "";

    start += title.length;

    let end = comparison.length;

    for (const next of nextTitles) {

      const pos = comparison.indexOf(next, start);

      if (pos !== -1 && pos < end) {
        end = pos;
      }

    }

    return comparison
      .substring(start, end)
      .replace(/\*\*/g, "")
      .trim();
  }

  return (

    <div
      style={{
        maxWidth: "1300px",
        margin: "40px auto",
        background: colors.card,
        border: colors.borderStyle,
        padding: "35px",
        borderRadius: "20px",
        boxShadow: "0 15px 35px rgba(0,0,0,.08)"
      }}
    >

      <h1 style={{ color: colors.text }}>
        Resume Comparison
      </h1>

      <p style={{ color: colors.subText }}>
        Compare two resumes and identify the stronger profile.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginTop: "20px"
        }}
      >

        <textarea
          rows={14}
          placeholder="Resume 1"
          value={resume1}
          onChange={(e)=>setResume1(e.target.value)}
          style={textarea}
        />

        <textarea
          rows={14}
          placeholder="Resume 2"
          value={resume2}
          onChange={(e)=>setResume2(e.target.value)}
          style={textarea}
        />

      </div>

      <button
        onClick={compareResumes}
        disabled={loading}
        style={button}
      >

        {loading ? "Comparing..." : "Compare Resumes"}

      </button>

      {comparison && (

        <div style={{marginTop:"40px"}}>

          <Card
            title="🏆 Overall Winner"
            content={getSection(
              "**Overall Winner:**",
              ["**ATS Score Resume 1"]
            )}
          />

          <div
            style={{
              display:"grid",
              gridTemplateColumns:"1fr 1fr",
              gap:"20px"
            }}
          >

            <Card
              title="📊 Resume 1 ATS Score"
              content={getSection(
                "**ATS Score Resume 1 (0-100):**",
                ["**ATS Score Resume 2"]
              )}
            />

            <Card
              title="📊 Resume 2 ATS Score"
              content={getSection(
                "**ATS Score Resume 2 (0-100):**",
                ["**Strengths of Resume 1:**"]
              )}
            />

          </div>

          <Card
            title="✅ Resume 1 Strengths"
            content={getSection(
              "**Strengths of Resume 1:**",
              ["**Strengths of Resume 2:**"]
            )}
          />

          <Card
            title="✅ Resume 2 Strengths"
            content={getSection(
              "**Strengths of Resume 2:**",
              ["**Weaknesses of Resume 1:**"]
            )}
          />

          <Card
            title="⚠ Resume 1 Weaknesses"
            content={getSection(
              "**Weaknesses of Resume 1:**",
              ["**Weaknesses of Resume 2:**"]
            )}
          />

          <Card
            title="⚠ Resume 2 Weaknesses"
            content={getSection(
              "**Weaknesses of Resume 2:**",
              ["**Missing Skills:**"]
            )}
          />

          <Card
            title="❌ Missing Skills"
            content={getSection(
              "**Missing Skills:**",
              ["**Final Recommendation:**"]
            )}
          />

          <Card
            title="💡 Final Recommendation"
            content={getSection(
              "**Final Recommendation:**"
            )}
          />

        </div>

      )}

    </div>

  );

}

function Card({title,content}){

  return(

    <div
      style={{
        background:"#f8fafc",
        padding:"20px",
        borderRadius:"15px",
        marginTop:"20px",
        border:"1px solid #e5e7eb"
      }}
    >

      <h3>{title}</h3>

      <pre
        style={{
          whiteSpace:"pre-wrap",
          fontFamily:"inherit",
          margin:0
        }}
      >
        {content}
      </pre>

    </div>

  );

}

const textarea={
  width:"100%",
  padding:"15px",
  borderRadius:"12px",
  border:"1px solid #d1d5db"
};

const button={
  width:"100%",
  padding:"15px",
  marginTop:"25px",
  background:"#2563eb",
  color:"#fff",
  border:"none",
  borderRadius:"12px",
  cursor:"pointer",
  fontSize:"16px"
};