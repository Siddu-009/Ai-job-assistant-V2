import { useState } from "react";

export default function SkillGap() {

  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {

    if (!role || !skills) {

      alert("Please enter target role and current skills.");

      return;

    }

    setLoading(true);

    try {

      const response = await fetch(

        "/api/skill-gap/",

        {

          method: "POST",

          headers: {

            "Content-Type":"application/json"

          },

          body: JSON.stringify({

            target_role: role,

            current_skills: skills

          })

        }

      );

      const data = await response.json();

      setResult(data);

    }

    catch{

      alert("Unable to analyze skill gap.");

    }

    setLoading(false);

  };

  return(

<div

style={{

maxWidth:"1100px",

margin:"40px auto",

background:"#fff",

padding:"35px",

borderRadius:"20px",

boxShadow:"0 15px 35px rgba(0,0,0,.08)"

}}

>

<h1>

AI Skill Gap Analyzer

</h1>

<p

style={{

color:"#6b7280"

}}

>

Compare your skills with your dream job.

</p>

<input

placeholder="Target Role"

value={role}

onChange={(e)=>setRole(e.target.value)}

style={input}

/>

<textarea

rows="6"

placeholder="Current Skills (comma separated)"

value={skills}

onChange={(e)=>setSkills(e.target.value)}

style={textarea}

/>

<button

onClick={analyze}

disabled={loading}

style={button}

>

{

loading

?

"Analyzing..."

:

"Analyze Skill Gap"

}

</button>

{

result &&

<div

style={{

marginTop:"35px"

}}

>

<h2>

Missing Skills

</h2>

<div

style={{

display:"flex",

flexWrap:"wrap",

gap:"10px"

}}

>

{

(result.missing_skills || []).map((skill,index)=>(

<span

key={index}

style={{

background:"#fee2e2",

color:"#991b1b",

padding:"8px 15px",

borderRadius:"25px"

}}

>

{skill}

</span>

))

}

</div>

<h2

style={{

marginTop:"30px"

}}

>

Learning Suggestions

</h2>

<div

style={{

background:"#f8fafc",

padding:"20px",

borderRadius:"12px"

}}

>

<pre

style={{

whiteSpace:"pre-wrap",

fontFamily:"inherit"

}}

>

{JSON.stringify(result.learning_path || result.suggestions || result, null, 2)}

</pre>

</div>

</div>

}

</div>

);

}

const input={

width:"100%",

padding:"14px",

marginTop:"20px",

borderRadius:"10px",

border:"1px solid #d1d5db"

};

const textarea={

width:"100%",

padding:"14px",

marginTop:"20px",

borderRadius:"10px",

border:"1px solid #d1d5db"

};

const button={

width:"100%",

padding:"16px",

marginTop:"25px",

border:"none",

borderRadius:"12px",

background:"#2563eb",

color:"#fff",

fontSize:"17px",

cursor:"pointer"

};
