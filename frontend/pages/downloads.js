import { useState } from "react";

export default function Downloads() {

  const [loading, setLoading] = useState(false);

  const downloadFile = async (endpoint, filename) => {

    setLoading(true);

    try {

      const response = await fetch(endpoint);

      if (!response.ok) {

        throw new Error("Download failed");

      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;

      a.download = filename;

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(url);

    }

    catch {

      alert("Unable to download file.");

    }

    setLoading(false);

  };

  const downloads = [

    {
      title:"Resume PDF",
      endpoint:"/api/download/resume-pdf",
      filename:"resume.pdf"
    },

    {
      title:"Resume TXT",
      endpoint:"/api/download/resume-txt",
      filename:"resume.txt"
    },

    {
      title:"ATS Resume",
      endpoint:"/api/download/ats-resume",
      filename:"ats_resume.pdf"
    },

    {
      title:"Cover Letter",
      endpoint:"/api/download/cover-letter",
      filename:"cover_letter.pdf"
    },

    {
      title:"ATS Report",
      endpoint:"/api/download/ats-report",
      filename:"ats_report.pdf"
    },

    {
      title:"Career Roadmap",
      endpoint:"/api/download/career-roadmap",
      filename:"career_roadmap.pdf"
    }

  ];

  return (

<div

style={{

maxWidth:"1000px",

margin:"40px auto",

background:"#fff",

padding:"35px",

borderRadius:"20px",

boxShadow:"0 15px 35px rgba(0,0,0,.08)"

}}

>

<h1>

Downloads

</h1>

<p

style={{

color:"#6b7280",

marginBottom:"30px"

}}

>

Download your AI-generated documents and reports.

</p>

{

downloads.map((file,index)=>(

<div

key={index}

style={{

display:"flex",

justifyContent:"space-between",

alignItems:"center",

padding:"20px",

marginBottom:"20px",

border:"1px solid #e5e7eb",

borderRadius:"12px"

}}

>

<div>

<h3>

{file.title}

</h3>

</div>

<button

onClick={()=>

downloadFile(

file.endpoint,

file.filename

)

}

disabled={loading}

style={{

padding:"12px 25px",

background:"#2563eb",

color:"#fff",

border:"none",

borderRadius:"8px",

cursor:"pointer"

}}

>

Download

</button>

</div>

))

}

</div>

);

}
