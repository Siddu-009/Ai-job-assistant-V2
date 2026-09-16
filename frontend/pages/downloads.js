import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function Downloads() {
  const { colors } = useTheme();

  const [loading, setLoading] = useState(false);

  const token =
  typeof window !== "undefined"
    ? localStorage.getItem("token")
    : "";

  const downloadFile = async (endpoint, filename) => {
    setLoading(true);

    try {
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        alert(data.error || "File not found");
        return;
      }

      const blob = await response.blob();

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => URL.revokeObjectURL(url), 1000);

    } catch (err) {
      console.error(err);
      alert("Unable to download file.");
    } finally {
      setLoading(false);
    }
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
      title: "ATS Resume",
      endpoint: `/api/download-document/ats_resume/${token}`,
      filename: "ats_resume.pdf",
    },

    {
      title:"Cover Letter",
      endpoint: `/api/download-document/cover_letter/${token}`,
      filename:"cover_letter.pdf"
    },

    {
      title:"ATS Report",
      endpoint: `/api/download-document/ats_report/${token}`,
      filename:"ats_report.pdf"
    },

    {
      title:"Career Roadmap",
      endpoint: `/api/download-document/career_roadmap/${token}`,
      filename:"career_roadmap.pdf"
    }

  ];

  return (

<div

style={{

maxWidth:"1000px",

margin:"40px auto",

background: colors.card,
border: colors.borderStyle,

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

color: colors.subText,

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
