import { useTheme } from "../../context/ThemeContext";

export default function ATSHeader({ tab, setTab }) {

    const { colors } = useTheme();

  return (

    <>

      <div

        style={{

          background: colors.card,

          borderRadius:"18px",

          padding:"35px",

          boxShadow:"0 10px 30px rgba(0,0,0,.08)",

          marginBottom:"30px"

        }}

      >

        <h1

          style={{

            margin:0,

            fontSize:"34px",

            color:"#111827"

          }}

        >

          ATS Resume Analyzer

        </h1>

        <p

          style={{

            marginTop:"12px",

            color: colors.subText,

            fontSize:"16px",

            lineHeight:"26px"

          }}

        >

          Analyze your uploaded resume professionally,

          compare it with any Job Description,

          identify missing skills,

          and receive AI-powered recommendations.

        </p>

      </div>

      <div

        style={{

          display:"flex",

          gap:"20px",

          marginBottom:"35px"

        }}

      >

        <button

          onClick={() => setTab("review")}

          style={{

            flex:1,

            padding:"16px",

            border:"none",

            borderRadius:"12px",

            cursor:"pointer",

            fontSize:"16px",

            fontWeight:"600",

            background:

              tab==="review"

              ? "#2563eb"

              : "#e5e7eb",

            color:

              tab==="review"

              ? "#ffffff"

              : "#111827",

            transition:"0.3s"

          }}

        >

          📄 Resume Review

        </button>

        <button

          onClick={() => setTab("match")}

          style={{

            flex:1,

            padding:"16px",

            border:"none",

            borderRadius:"12px",

            cursor:"pointer",

            fontSize:"16px",

            fontWeight:"600",

            background:

              tab==="match"

              ? "#2563eb"

              : "#e5e7eb",

            color:

              tab==="match"

              ? "#ffffff"

              : "#111827",

            transition:"0.3s"

          }}

        >

          🎯 Job Match

        </button>

      </div>

    </>

  );

}
