import { useState } from "react";

export default function ResumeTailoring() {

  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tailoredResume, setTailoredResume] = useState("");
  const [loading, setLoading] = useState(false);

  const tailorResume = async () => {

    if (!resume || !jobDescription) {

      alert("Please enter Resume and Job Description.");

      return;

    }

    setLoading(true);

    try {

      const response = await fetch(

        "/api/auto-resume/",

        {

          method: "POST",

          headers: {

            "Content-Type":"application/json"

          },

          body: JSON.stringify({

            resume,

            job_description: jobDescription

          })

        }

      );

      const data = await response.json();

      setTailoredResume(

        data.tailored_resume ||

        data.resume ||

        JSON.stringify(data,null,2)

      );

    }

    catch{

      alert("Unable to tailor resume.");

    }

    setLoading(false);

  };

  const copyResume=()=>{

    navigator.clipboard.writeText(tailoredResume);

    alert("Copied Successfully");

  };

  return(

<div

style={{

maxWidth:"1200px",

margin:"40px auto",

background:"#fff",

padding:"35px",

borderRadius:"20px",

boxShadow:"0 15px 35px rgba(0,0,0,.08)"

}}

>

<h1>

Resume Tailoring

</h1>

<p

style={{

color:"#6b7280"

}}

>

Customize your resume for every job application.

</p>

<textarea

rows="10"

placeholder="Paste Resume"

value={resume}

onChange={(e)=>setResume(e.target.value)}

style={textarea}

/>

<textarea

rows="10"

placeholder="Paste Job Description"

value={jobDescription}

onChange={(e)=>setJobDescription(e.target.value)}

style={textarea}

/>

<button

onClick={tailorResume}

disabled={loading}

style={button}

>

{

loading

?

"Tailoring..."

:

"Generate Tailored Resume"

}

</button>

{

tailoredResume &&

<>

<h2

style={{

marginTop:"35px"

}}

>

Tailored Resume

</h2>

<textarea

rows="16"

readOnly

value={tailoredResume}

style={textarea}

/>

<button

onClick={copyResume}

style={greenButton}

>

Copy Resume

</button>

</>

}

</div>

);

}

const textarea={

width:"100%",

padding:"15px",

marginTop:"20px",

borderRadius:"12px",

border:"1px solid #d1d5db"

};

const button={

width:"100%",

padding:"15px",

marginTop:"20px",

background:"#2563eb",

color:"#fff",

border:"none",

borderRadius:"12px",

cursor:"pointer",

fontSize:"16px"

};

const greenButton={

width:"100%",

padding:"15px",

marginTop:"20px",

background:"#16a34a",

color:"#fff",

border:"none",

borderRadius:"12px",

cursor:"pointer",

fontSize:"16px"

};
