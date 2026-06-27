import { useEffect, useState } from "react";

export default function JobTracker() {

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    loadJobs();

  }, []);

  const loadJobs = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(

        "/api/job-tracker/",

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

      setJobs(

        data.jobs ||

        data ||

        []

      );

    }

    catch{

      alert("Unable to load Job Tracker.");

    }

    setLoading(false);

  };

  const getColor=(status)=>{

    switch(status){

      case "Applied":
        return "#2563eb";

      case "Shortlisted":
        return "#16a34a";

      case "Interview":
        return "#f59e0b";

      case "Offer":
        return "#10b981";

      case "Rejected":
        return "#dc2626";

      default:
        return "#6b7280";

    }

  };

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

Job Tracker

</h1>

<p

style={{

color:"#6b7280"

}}

>

Track every job application in one place.

</p>

{

loading &&

<p>

Loading...

</p>

}

{

!loading && jobs.length===0 &&

<p>

No Applications Found.

</p>

}

{

jobs.map((job,index)=>(

<div

key={index}

style={{

marginTop:"25px",

padding:"25px",

border:"1px solid #e5e7eb",

borderRadius:"15px"

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

<h2>

{job.title}

</h2>

<p>

🏢 {job.company}

</p>

<p>

📍 {job.location}

</p>

</div>

<div

style={{

padding:"10px 18px",

borderRadius:"20px",

background:getColor(job.status),

color:"#fff",

fontWeight:"bold"

}}

>

{job.status}

</div>

</div>

<div

style={{

marginTop:"20px"

}}

>

<p>

📅 Applied Date: {job.applied_date}

</p>

<p>

📅 Next Interview: {job.interview_date || "Not Scheduled"}

</p>

<p>

📝 Notes: {job.notes || "No Notes"}

</p>

</div>

</div>

))

}

</div>

);

}
