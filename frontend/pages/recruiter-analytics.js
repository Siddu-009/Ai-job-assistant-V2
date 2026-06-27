import { useEffect, useState } from "react";

export default function RecruiterAnalytics() {

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    loadAnalytics();

  }, []);

  const loadAnalytics = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(

        "/api/recruiter-dashboard/",

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

      setAnalytics(data);

    }

    catch{

      alert("Unable to load recruiter analytics.");

    }

    setLoading(false);

  };

  if(loading){

    return(

      <div style={{padding:"40px"}}>

        Loading...

      </div>

    );

  }

  return(

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

Recruiter Analytics

</h1>

<p

style={{

color:"#6b7280"

}}

>

Monitor hiring performance and recruitment insights.

</p>

<div

style={{

display:"grid",

gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",

gap:"20px",

marginTop:"30px"

}}

>

<Card

title="Candidates"

value={analytics?.candidates || 0}

color="#2563eb"

/>

<Card

title="Jobs Posted"

value={analytics?.jobs || 0}

color="#16a34a"

/>

<Card

title="Interviews"

value={analytics?.interviews || 0}

color="#f59e0b"

/>

<Card

title="Offers"

value={analytics?.offers || 0}

color="#7c3aed"

/>

<Card

title="Hiring Rate"

value={`${analytics?.hiring_rate || 0}%`}

color="#dc2626"

/>

<Card

title="Average ATS"

value={analytics?.average_ats || 0}

color="#0ea5e9"

/>

</div>

<div

style={{

marginTop:"40px",

padding:"20px",

background:"#f8fafc",

borderRadius:"15px"

}}

>

<h2>

Recruitment Insights

</h2>

<p>

{analytics?.insights ||

"No insights available."}

</p>

</div>

</div>

);

}

function Card({

title,

value,

color

}){

return(

<div

style={{

padding:"25px",

border:"1px solid #e5e7eb",

borderRadius:"15px"

}}

>

<h3

style={{

margin:0,

color:"#6b7280"

}}

>

{title}

</h3>

<h1

style={{

marginTop:"15px",

color

}}

>

{value}

</h1>

</div>

);

}
