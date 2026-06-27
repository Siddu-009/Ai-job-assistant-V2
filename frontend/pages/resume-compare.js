import { useState } from "react";

export default function ResumeCompare() {

  const [resume1, setResume1] = useState("");
  const [resume2, setResume2] = useState("");
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);

  const compareResumes = async () => {

    if (!resume1 || !resume2) {
      alert("Please paste both resumes.");
      return;
    }

    setLoading(true);

    try {

      const response = await fetch(

        "/api/resume-recommend/compare",

        {

          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            resume_one: resume1,

            resume_two: resume2

          })

        }

      );

      const data = await response.json();

      setComparison(data);

    }

    catch {

      alert("Unable to compare resumes.");

    }

    setLoading(false);

  };

  return (

<div

style={{

maxWidth:"1300px",

margin:"40px auto",

background:"#fff",

padding:"35px",

borderRadius:"20px",

boxShadow:"0 15px 35px rgba(0,0,0,.08)"

}}

>

<h1>

Resume Comparison

</h1>

<p

style={{

color:"#6b7280"

}}

>

Compare two resumes and identify the stronger profile.

</p>

<div

style={{

display:"grid",

gridTemplateColumns:"1fr 1fr",

gap:"20px",

marginTop:"20px"

}}

>

<textarea

rows="14"

placeholder="Resume 1"

value={resume1}

onChange={(e)=>setResume1(e.target.value)}

style={textarea}

/>

<textarea

rows="14"

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

{

loading

?

"Comparing..."

:

"Compare Resumes"

}

</button>

{

comparison &&

<div

style={{

marginTop:"40px",

background:"#f8fafc",

padding:"25px",

borderRadius:"15px"

}}

>

<h2>

Comparison Result

</h2>

<pre

style={{

whiteSpace:"pre-wrap",

fontFamily:"inherit"

}}

>

{JSON.stringify(comparison,null,2)}

</pre>

</div>

}

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

cursor:"pointer"

};
