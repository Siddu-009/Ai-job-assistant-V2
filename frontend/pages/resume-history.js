import { useEffect, useState } from "react";

export default function ResumeHistory() {

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(

        "/api/resume-history/",

        {

          method: "POST",

          headers: {

            "Content-Type":"application/json"

          },

          body: JSON.stringify({

            token

          })

        }

      );

      const data = await response.json();

      setHistory(

        data.history || data || []

      );

    }

    catch{

      alert("Unable to load history.");

    }

    setLoading(false);

  };

  const openResume = (id)=>{

    window.open(

      `/api/resume-view/${id}`,

      "_blank"

    );

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

Resume History

</h1>

<p

style={{

color:"#6b7280"

}}

>

All Generated Resumes

</p>

{

loading &&

<p>

Loading...

</p>

}

{

!loading && history.length===0 &&

<p>

No Resume History Found

</p>

}

{

history.map((resume)=>(

<div

key={resume.id}

style={{

border:"1px solid #e5e7eb",

borderRadius:"15px",

padding:"20px",

marginTop:"20px"

}}

>

<div

style={{

display:"flex",

justifyContent:"space-between",

alignItems:"center"

}}

>

<div>

<h3>

{resume.title || "Generated Resume"}

</h3>

<p>

Version:

{" "}

{resume.version || 1}

</p>

<p>

Created:

{" "}

{resume.created_at}

</p>

</div>

<button

onClick={()=>

openResume(

resume.id

)

}

style={{

padding:"12px 20px",

border:"none",

background:"#2563eb",

color:"#fff",

borderRadius:"10px",

cursor:"pointer"

}}

>

View Resume

</button>

</div>

</div>

))

}

</div>

);

}
