import { useEffect, useState } from "react";

export default function JobRecommendations() {

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {

    loadJobs();

  }, []);

  const loadJobs = async () => {

    setLoading(true);

    try {

      const token = localStorage.getItem("token");

      console.log("TOKEN:", token);

      const response = await fetch(

          "/api/recommend-jobs/",

          {

              method: "POST",

              headers: {

                  "Content-Type": "application/json"

              },

              body: JSON.stringify({

                  token,
                  keyword: search,
                  location

              })

          }

      );

      const data = await response.json();

      if (!response.ok) {

	  alert(data.message || "Unable to load jobs");

	  return;

      }

      setJobs(data.recommended_jobs || []);

    }

    catch {

      alert("Unable to load jobs.");

    }

    setLoading(false);

  };

  const saveJob = async (job) => {

    const token = localStorage.getItem("token");

    // First add the job to the jobs table
    const addResponse = await fetch("/api/jobs/add", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            title: job.title,
            company: job.company,
            location: job.location,
            skills: job.skills || "",
            apply_url: job.apply_url

        })

    });

    const addedJob = await addResponse.json();

    // Then save it for the user
    await fetch("/api/saved-jobs/add", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            token,
            job_id: addedJob.id

        })

    });

    alert("Job Saved");

};

  const applyJob = async (job) => {

    const token = localStorage.getItem("token");

    // First add the job
    const addResponse = await fetch("/api/jobs/add", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            title: job.title,
            company: job.company,
            location: job.location,
            skills: job.skills || "",
            apply_url: job.apply_url

        })

    });

    const addedJob = await addResponse.json();

    // Then apply
    await fetch("/api/applications/apply", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            token,
            job_id: addedJob.id

        })

    });

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

AI Job Recommendations

</h1>

<p

style={{

color:"#6b7280"

}}

>

Discover jobs matched to your resume.

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

placeholder="Search Job"

value={search}

onChange={(e)=>setSearch(e.target.value)}

style={input}

/>

<input

placeholder="Location"

value={location}

onChange={(e)=>setLocation(e.target.value)}

style={input}

/>

<button

onClick={loadJobs}

style={button}

>

Search

</button>

</div>

{

loading &&

<p

style={{

marginTop:"30px"

}}

>

Loading Jobs...

</p>

}

{

!loading && jobs.length===0 &&

<p

style={{

marginTop:"30px"

}}

>

No Jobs Found.

</p>

}

{

jobs.map(job=>(

<div

key={job.job_id}

style={{

marginTop:"25px",

border:"1px solid #e5e7eb",

borderRadius:"15px",

padding:"25px"

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

{job.company}

</p>

<p>

📍 {job.location}

</p>

</div>

<div

style={{

background:"#2563eb",

color:"#fff",

padding:"10px 18px",

borderRadius:"20px",

fontWeight:"bold"

}}

>

{job.score}%

</div>

</div>

<p

style={{

marginTop:"20px"

}}

>

{job.reason}

</p>

<div

style={{

display:"flex",

gap:"15px",

marginTop:"20px"

}}

>

<button

onClick={() => saveJob(job)}

style={saveButton}

>

Save Job

</button>

<button

onClick={() => applyJob(job)}

style={applyButton}

>

Apply Now

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

borderRadius:"10px",

background:"#2563eb",

color:"#fff",

cursor:"pointer"

};

const saveButton={

flex:1,

padding:"14px",

border:"none",

borderRadius:"10px",

background:"#f59e0b",

color:"#fff",

cursor:"pointer"

};

const applyButton={

flex:1,

padding:"14px",

border:"none",

borderRadius:"10px",

background:"#16a34a",

color:"#fff",

cursor:"pointer"

};
