import { useEffect, useState } from "react";

const STATUS = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "HR Interview",
  "Technical Interview",
  "Manager Round",
  "Offer",
  "Rejected"
];

export default function ApplicationStatus() {

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    loadStatus();

  }, []);

  const loadStatus = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(

        "/api/application-status/",

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

      if (Array.isArray(data.applications)) {
          setApplications(data.applications);
      } else {
          setApplications([]);
      }

    }

    catch{

      alert("Unable to load application status.");

    }

    setLoading(false);

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

Application Status

</h1>

<p

style={{

color:"#6b7280"

}}

>

Track the current status of all your job applications.

</p>

{

loading &&

<p>

Loading...

</p>

}

{

applications.map((job,index)=>(

<div

key={index}

style={{

marginTop:"30px",

padding:"25px",

border:"1px solid #e5e7eb",

borderRadius:"15px"

}}

>

<h2>

{job.title}

</h2>

<p>

🏢 {job.company}

</p>

<div

style={{

display:"flex",

flexWrap:"wrap",

gap:"10px",

marginTop:"25px"

}}

>

{

STATUS.map((step,i)=>(

<div

key={i}

style={{

padding:"10px 15px",

borderRadius:"20px",

background:

step===job.status

?

"#2563eb"

:

"#e5e7eb",

color:

step===job.status

?

"#fff"

:

"#374151",

fontWeight:"bold"

}}

>

{step}

</div>

))

}

</div>

</div>

))

}

</div>

);

}
