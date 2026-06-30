export default function ResumeReview({

  loading,

  analyzeResume

}) {

  return (

    <div

      style={{

        background:"#ffffff",

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

        Resume Review

      </h2>

      <p

        style={{

          color:"#6b7280",

          marginBottom:"30px"

        }}

      >

        Analyze your latest uploaded resume without providing a Job Description.

      </p>

      <div

        style={{

          background:"#ecfdf5",

          border:"1px solid #10b981",

          borderRadius:"14px",

          padding:"20px",

          marginBottom:"25px"

        }}

      >

        <div

          style={{

            fontWeight:"bold",

            color:"#065f46",

            fontSize:"18px"

          }}

        >

          ✔ Resume Status

        </div>

        <div

          style={{

            marginTop:"10px",

            color:"#065f46"

          }}

        >

          Latest uploaded resume will be analyzed.

        </div>

      </div>

      <div

        style={{

          display:"grid",

          gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",

          gap:"20px",

          marginBottom:"30px"

        }}

      >

        <InfoCard

          title="Resume"

          value="Latest Uploaded Resume"

        />

        <InfoCard

          title="ATS Compatibility"

          value="Ready for Analysis"

        />

        <InfoCard

          title="Analysis Type"

          value="Resume Review"

        />

      </div>

      <button

        onClick={analyzeResume}

        disabled={loading}

        style={{

          width:"100%",

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

          "Analyze Resume"

        }

      </button>

      <div

        style={{

          marginTop:"35px",

          padding:"25px",

          background:"#f9fafb",

          borderRadius:"14px",

          border:"1px solid #e5e7eb"

        }}

      >

        <h3

          style={{

            marginTop:0

          }}

        >

          Resume Review will check

        </h3>

        <ul

          style={{

            lineHeight:"32px",

            color:"#4b5563"

          }}

        >

          <li>✔ ATS Friendly Format</li>

          <li>✔ Resume Sections</li>

          <li>✔ Professional Summary</li>

          <li>✔ Skills Coverage</li>

          <li>✔ Project Quality</li>

          <li>✔ Work Experience</li>

          <li>✔ Education Details</li>

          <li>✔ Grammar & Readability</li>

          <li>✔ Resume Strength</li>

          <li>✔ AI Suggestions</li>

        </ul>

      </div>

    </div>

  );

}

function InfoCard({

  title,

  value

}) {

  return (

    <div

      style={{

        background:"#f9fafb",

        borderRadius:"12px",

        padding:"20px",

        border:"1px solid #e5e7eb"

      }}

    >

      <div

        style={{

          fontSize:"14px",

          color:"#6b7280"

        }}

      >

        {title}

      </div>

      <div

        style={{

          marginTop:"8px",

          fontWeight:"bold",

          fontSize:"17px",

          color:"#111827"

        }}

      >

        {value}

      </div>

    </div>

  );

}
