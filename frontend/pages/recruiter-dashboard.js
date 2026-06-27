import { useState } from "react";

export default function RecruiterDashboard() {

  const [query, setQuery] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchCandidates = async () => {

    if (!query) {
      alert("Enter skill or job title");
      return;
    }

    setLoading(true);

    try {

      const response = await fetch(

        "/api/recruiter-search/",

        {

          method: "POST",

          headers: {

            "Content-Type":"application/json"

          },

          body: JSON.stringify({

            search: query

          })

        }

      );

      const data = await response.json();

      setCandidates(data.results || data || []);

    }

    catch{

      alert("Search Failed");

    }

    setLoading(false);

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

Recruiter Dashboard

</h1>

<p
style={{
color:"#6b7280"
}}
>

Search candidates by skills.

</p>

<div
style={{
display:"flex",
gap:"15px",
marginTop:"25px"
}}
>

<input

placeholder="AWS, Docker, Kubernetes..."

value={query}

onChange={(e)=>setQuery(e.target.value)}

style={{
flex:1,
padding:"14px",
borderRadius:"10px",
border:"1px solid #d1d5db"
}}

/>

<button

onClick={searchCandidates}

style={{
padding:"14px 25px",
background:"#2563eb",
color:"#fff",
border:"none",
borderRadius:"10px",
cursor:"pointer"
}}

>

{loading?"Searching...":"Search"}

</button>

</div>

{

candidates.map((candidate,index)=>(

<div

key={index}

style={{
marginTop:"25px",
padding:"20px",
border:"1px solid #e5e7eb",
borderRadius:"15px"
}}

>

<h2>

{candidate.name}

</h2>

<p>

📧 {candidate.email}

</p>

<p>

💼 {candidate.skills}

</p>

<p>

⭐ Match Score: {candidate.match_score}%

</p>

</div>

))

}

</div>

);

}
