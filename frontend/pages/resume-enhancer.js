import { useState } from "react";

export default function ResumeEnhancer() {

  const [resume, setResume] = useState("");
  const [enhancedResume, setEnhancedResume] = useState("");
  const [loading, setLoading] = useState(false);

  const enhanceResume = async () => {

    if (!resume.trim()) {
      alert("Please paste your resume.");
      return;
    }

    setLoading(true);

    try {

      const response = await fetch("/api/ai-resume/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          master_resume: resume,
          job_description:
            "Improve this resume for ATS, readability, grammar, keywords and professional formatting."
        })
      });

      const data = await response.json();

      if (data.optimized_resume) {
        setEnhancedResume(data.optimized_resume);
      }
      else if (data.enhanced_resume) {
        setEnhancedResume(data.enhanced_resume);
      }
      else if (data.resume) {
        setEnhancedResume(data.resume);
      }
      else if (data.message) {
        setEnhancedResume(data.message);
      }
      else {
        setEnhancedResume(JSON.stringify(data, null, 2));
      }

    } catch (err) {

      console.error(err);
      alert("Unable to enhance resume.");

    }

    setLoading(false);

  };

  const copyResume = () => {

    navigator.clipboard.writeText(enhancedResume);
    alert("Copied Successfully");

  };

  return (

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
AI Resume Rewriter & ATS Optimizer
</h1>

<p
style={{
color:"#6b7280"
}}
>
Rewrite your resume professionally with improved ATS score, stronger bullet points, better grammar and modern formatting.
</p>

<textarea
rows="12"
placeholder="Paste your Resume"
value={resume}
onChange={(e)=>setResume(e.target.value)}
style={textarea}
/>

<button
onClick={enhanceResume}
disabled={loading}
style={button}
>

{
loading
?
"Enhancing..."
:
"Rewrite Resume"
}

</button>

{
enhancedResume &&
<>

<h2
style={{
marginTop:"40px"
}}
>
Enhanced Resume
</h2>

<textarea
rows="20"
value={enhancedResume}
readOnly
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
border:"1px solid #d1d5db",
fontSize:"15px"

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