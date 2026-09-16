import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function CandidateSearch() {
  const { colors } = useTheme();

  const card={

  marginTop:"30px",

  padding:"25px",

  background: colors.card,
  border: colors.borderStyle,

  borderRadius:"15px",

  boxShadow:"0 8px 25px rgba(0,0,0,.08)"

  };

  const [skill, setSkill] = useState("");
  const [experience, setExperience] = useState("");
  const [atsScore, setAtsScore] = useState("");
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);

  async function searchCandidates() {

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

            ats_score: Number(atsScore) || 0

          })

        }

      );

      const data = await response.json();

      setCandidates(data.candidates || []);

    }

    catch {

      alert("Unable to search candidates.");

    }

    setLoading(false);

  }

  return (

<div
style={{
maxWidth:"1400px",
margin:"40px auto",
padding:"20px"
}}
>

<h1
style={{
fontSize:"34px",
fontWeight:"700"
}}
>

🔍 AI Recruiter Search

</h1>

<p
style={{
color: colors.subText,
marginBottom:"25px"
}}
>

Search resumes using AI ranking.

</p>

<div
style={{
display:"grid",
gridTemplateColumns:"1fr 1fr 1fr auto",
gap:"15px"
}}
>

<input
placeholder="Skill (Docker)"
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
placeholder="Minimum Match Score"
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

candidates.length===0

?

<p
style={{
marginTop:"40px",
color: colors.subText
}}
>

No candidates found.

</p>

:

candidates.map((candidate,index)=>(

<div

key={index}

style={card}

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

👤 {candidate.name}

</h2>

<p>

📧 {candidate.email}

</p>

</div>

<div
style={{
textAlign:"center"
}}
>

<div
style={circle}
>

{candidate.match_score}%

</div>

<p>

AI Match

</p>

</div>

</div>

<div
style={{
marginTop:"20px"
}}
>

<p>

⭐ ATS Score

<b>

 {candidate.ats_score}

</b>

</p>

<p>

💼 Experience

<b>

 {candidate.experience||"Not Available"}

</b>

</p>

<p>

🛠 Skills

</p>

<div
style={{
display:"flex",
flexWrap:"wrap",
gap:"10px"
}}
>

{

(candidate.skills || "")

.split(",")

.filter(Boolean)

.map((skill,index)=>(

<span

key={index}

style={chip}

>

{skill.trim()}

</span>

))

}

</div>

</div>

<div
style={{
marginTop:"20px",
background:"#f8fafc",
padding:"18px",
borderRadius:"10px"
}}
>

<h3>

🤖 AI Analysis

</h3>

<pre
style={{
whiteSpace:"pre-wrap",
fontFamily:"inherit"
}}
>

{candidate.ai_reason}

</pre>

</div>

<div
style={{
display:"flex",
gap:"15px",
marginTop:"20px"
}}
>

<button style={greenButton}>

📄 View Resume

</button>

<button style={blueButton}>

📧 Contact

</button>

<button style={orangeButton}>

⭐ Shortlist

</button>

</div>

</div>

))

}

</div>

);

}

const input={

padding:"15px",

border:"1px solid #d1d5db",

borderRadius:"10px",

fontSize:"15px"

};

const button={

background:"#2563eb",

color:"#fff",

border:"none",

borderRadius:"10px",

padding:"15px 30px",

cursor:"pointer"

};

const chip={

background:"#2563eb",

color:"#fff",

padding:"6px 12px",

borderRadius:"20px",

fontSize:"13px"

};

const circle={

width:"75px",

height:"75px",

borderRadius:"50%",

background:"#16a34a",

display:"flex",

justifyContent:"center",

alignItems:"center",

fontSize:"20px",

fontWeight:"700",

color:"#fff"

};

const greenButton={

flex:1,

background:"#16a34a",

color:"#fff",

border:"none",

padding:"14px",

borderRadius:"10px",

cursor:"pointer"

};

const blueButton={

flex:1,

background:"#2563eb",

color:"#fff",

border:"none",

padding:"14px",

borderRadius:"10px",

cursor:"pointer"

};

const orangeButton={

flex:1,

background:"#f59e0b",

color:"#fff",

border:"none",

padding:"14px",

borderRadius:"10px",

cursor:"pointer"

};