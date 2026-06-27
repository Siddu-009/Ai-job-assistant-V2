import { useState } from "react";

export default function LiveJobs() {

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchJobs = async () => {

    setLoading(true);

    try {

      const response = await fetch(

        "/api/jobs/search",

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json"

          },

          body: JSON.stringify({

            keyword,

            location

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

    catch {

      alert("Unable to search jobs.");

    }

    setLoading(false);

  };

  const saveJob = async(id)=>{

    await fetch(

      "/api/saved-jobs/add",

      {

        method:"POST",

        headers:{

          "Content-Type":"application/json"

        },

        body:JSON.stringify({

          token:localStorage.getItem("token"),

          job_id:id

        })

      }

    );

    alert("Job Saved");

  };

  const applyJob = async(id)=>{

    await fetch(

      "/api/applications/apply",

      {

        method:"POST",

        headers:{

          "Content-Type":"application/json"

        },

        body:JSON.stringify({

          token:localStorage.getItem("token"),

          job_id:id

        })

      }

    );

    alert("Application Submitted");

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

Live Jobs

</h1>

<p

style={{

color:"#6b7280"

}}

>

Search jobs from multiple job portals.

</p>

<div

style={{

display:"grid",

gridTemplateColumns:"2fr 1fr auto",

gap:"15px",

marginTop:"25px"

}}

>

<input

placeholder="Job Title"

value={keyword}

onChange={(e)=>setKeyword(e.target.value)}

style={input}

/>

<input

placeholder="Location"

value={location}

onChange={(e)=>setLocation(e.target.value)}

style={input}

/>

<button

onClick={searchJobs}

style={button}

>

{

loading

?

"Searching..."

:

"Search"

}

</button>

</div>

{

jobs.map(job=>(

<div

key={job.id}

style={{

marginTop:"25px",

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

<p>

📍 {job.location}

</p>

<p>

💰 {job.salary}

</p>

<p>

⭐ Match: {job.match_score || "--"}%

</p>

<div

style={{

display:"flex",

gap:"15px",

marginTop:"20px"

}}

>

<button

onClick={()=>saveJob(job.id)}

style={saveButton}

>

Save

</button>

<button

onClick={()=>applyJob(job.id)}

style={applyButton}

>

Apply

</button>

</div>

</div>

))

}

</div>

);

}

const input={

padding:"14px",

borderRadius:"10px",

border:"1px solid #d1d5db"

};

const button={

padding:"14px 25px",

border:"none",

background:"#2563eb",

color:"#fff",

borderRadius:"10px",

cursor:"pointer"

};

const saveButton={

flex:1,

padding:"14px",

background:"#f59e0b",

border:"none",

color:"#fff",

borderRadius:"10px",

cursor:"pointer"

};

const applyButton={

flex:1,

padding:"14px",

background:"#16a34a",

border:"none",

color:"#fff",

borderRadius:"10px",

cursor:"pointer"

};
