import { useState } from "react";

export default function CandidateSearch() {

  const [skill, setSkill] = useState("");
  const [experience, setExperience] = useState("");
  const [atsScore, setAtsScore] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchCandidates = async () => {

    setLoading(true);

    try {

      const response = await fetch(

        "/api/recruiter-search/",

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json"

          },

          body: JSON.stringify({

            skill,

            experience,

            ats_score: atsScore

          })

        }

      );

      const data = await response.json();

      setCandidates(

        data.candidates ||

        data.results ||

        []

      );

    }

    catch {

      alert("Unable to search candidates.");

    }

    setLoading(false);

  };

  return (

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

Candidate Search

</h1>

<p

style={{

color:"#6b7280"

}}

>

Search candidates using AI filters.

</p>

<div

style={{

display:"grid",

gridTemplateColumns:"1fr 1fr 1fr auto",

gap:"15px",

marginTop:"25px"

}}

>

<input

placeholder="Skill"

value={skill}

onChange={(e)=>setSkill(e.target.value)}

style={input}

/>

<input

placeholder="Experience"

value={experience}

onChange={(e)=>setExperience(e.target.value)}

style={input}

/>

<input

placeholder="Minimum ATS Score"

value={atsScore}

onChange={(e)=>setAtsScore(e.target.value)}

style={input}

/>

<button

onClick={searchCandidates}

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

candidates.map((candidate,index)=>(

<div

key={index}

style={{

marginTop:"25px",

padding:"25px",

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

💼 Experience: {candidate.experience}

</p>

<p>

⭐ ATS Score: {candidate.ats_score}

</p>

<p>

🛠 Skills: {candidate.skills}

</p>

<div

style={{

display:"flex",

gap:"15px",

marginTop:"20px"

}}

>

<button

style={greenButton}

>

View Resume

</button>

<button

style={blueButton}

>

Contact

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

background:"#2563eb",

color:"#fff",

border:"none",

borderRadius:"10px",

cursor:"pointer"

};

const greenButton={

flex:1,

padding:"14px",

background:"#16a34a",

color:"#fff",

border:"none",

borderRadius:"10px",

cursor:"pointer"

};

const blueButton={

flex:1,

padding:"14px",

background:"#2563eb",

color:"#fff",

border:"none",

borderRadius:"10px",

cursor:"pointer"

};
