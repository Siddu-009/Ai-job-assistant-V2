import { useTheme } from "../../context/ThemeContext";

export default function JobMatch({
  loading,
  analyzeJob,
  jobDescription,
  setJobDescription
}) {

  const { colors } = useTheme();

  return (

    <div

      style={{

        background: colors.card,

        borderRadius:"18px",

        padding:"35px",

        boxShadow:"0 10px 30px rgba(0,0,0,.08)"

      }}

    >

      <h2

        style={{

          marginTop:0,

          color:"#111827"

        }}

      >

        Job Match Analysis

      </h2>

      <p

        style={{

          color: colors.subText,

          marginBottom:"25px",

          lineHeight:"28px"

        }}

      >

        Compare your uploaded resume with a Job Description and discover
        your ATS match score, matched skills, missing skills and AI
        recommendations.

      </p>

      <div

        style={{

          background:"#eff6ff",

          border:"1px solid #3b82f6",

          borderRadius:"12px",

          padding:"18px",

          marginBottom:"25px"

        }}

      >

        <strong

          style={{

            color:"#1d4ed8"

          }}

        >

          📄 Latest Resume

        </strong>

        <p

          style={{

            marginTop:"8px",

            marginBottom:0,

            color:"#1e40af"

          }}

        >

          Your latest uploaded resume will automatically be used for ATS
          comparison.

        </p>

      </div>

      <label

        style={{

          fontWeight:"600",

          color:"#111827"

        }}

      >

        Paste Job Description

      </label>

      <textarea

        rows={14}

        value={jobDescription}

        onChange={(e)=>setJobDescription(e.target.value)}

        placeholder="Paste the complete Job Description here..."

        style={{

          width:"100%",

          marginTop:"12px",

          padding:"18px",

          borderRadius:"12px",

          border:"1px solid #d1d5db",

          fontSize:"15px",

          resize:"vertical",

          outline:"none",

          lineHeight:"28px"

        }}

      />

      <div

        style={{

          marginTop:"20px",

          display:"flex",

          gap:"15px"

        }}

      >

        <button

          onClick={analyzeJob}

          disabled={loading}

          style={{

            flex:1,

            padding:"16px",

            background:"#2563eb",

            color:"#ffffff",

            border:"none",

            borderRadius:"12px",

            cursor:"pointer",

            fontSize:"17px",

            fontWeight:"600"

          }}

        >

          {

            loading

            ?

            "Analyzing..."

            :

            "Analyze ATS Match"

          }

        </button>

      </div>

      <div

        style={{

          marginTop:"35px",

          background:"#f9fafb",

          borderRadius:"12px",

          padding:"20px",

          border:"1px solid #e5e7eb"

        }}

      >

        <h3

          style={{

            marginTop:0

          }}

        >

          Analysis Includes

        </h3>

        <div

          style={{

            display:"grid",

            gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",

            gap:"15px",

            marginTop:"15px"

          }}

        >

          <FeatureCard title="🎯 ATS Match Score" colors={colors}/>

          <FeatureCard title="✅ Matched Skills" colors={colors}/>

          <FeatureCard title="❌ Missing Skills" colors={colors}/>

          <FeatureCard title="📈 Resume Strength" colors={colors}/>

          <FeatureCard title="🤖 AI Recommendations" colors={colors}/>

          <FeatureCard title="📄 Download ATS Report" colors={colors}/>

        </div>

      </div>

    </div>

  );

}

function FeatureCard({title, colors}){

  return(

    <div

      style={{

        background: colors.card,

        border: colors.borderStyle,

        padding:"16px",

        borderRadius:"10px",

        textAlign:"center",

        fontWeight:"600",

        color: colors.text

      }}

    >

      {title}

    </div>

  );

}
