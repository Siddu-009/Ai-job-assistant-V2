import { useState } from "react";

export default function LearningRecommendations() {

  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);

  const generateRecommendations = async () => {

    if (!role || !skills) {

      alert("Please enter target role and current skills.");

      return;

    }

    setLoading(true);

    try {

      const response = await fetch(

        "/api/career-roadmap/",

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json"

          },

          body: JSON.stringify({

            target_role: role,

            current_skills: skills

          })

        }

      );

      const data = await response.json();

      setRecommendations(data);

    }

    catch {

      alert("Unable to generate recommendations.");

    }

    setLoading(false);

  };

  return (

<div

style={{

maxWidth:"1200px",

margin:"40px auto",

padding:"35px",

background:"#fff",

borderRadius:"20px",

boxShadow:"0 15px 35px rgba(0,0,0,.08)"

}}

>

<h1>

Learning Recommendations

</h1>

<p

style={{

color:"#6b7280"

}}

>

Get AI-powered learning recommendations based on your target career.

</p>

<input

type="text"

placeholder="Target Role"

value={role}

onChange={(e)=>setRole(e.target.value)}

style={input}

/>

<textarea

rows="5"

placeholder="Current Skills (comma separated)"

value={skills}

onChange={(e)=>setSkills(e.target.value)}

style={textarea}

/>

<button

onClick={generateRecommendations}

disabled={loading}

style={button}

>

{

loading

?

"Generating..."

:

"Generate Recommendations"

}

</button>

{

recommendations &&

<div

style={{

marginTop:"40px"

}}

>

<h2>

Learning Plan

</h2>

<pre

style={{

background:"#f8fafc",

padding:"20px",

borderRadius:"10px",

whiteSpace:"pre-wrap",

fontFamily:"inherit"

}}

>

{JSON.stringify(recommendations,null,2)}

</pre>

</div>

}

</div>

);

}

const input={

width:"100%",

padding:"14px",

marginTop:"20px",

border:"1px solid #d1d5db",

borderRadius:"10px"

};

const textarea={

width:"100%",

padding:"14px",

marginTop:"20px",

border:"1px solid #d1d5db",

borderRadius:"10px"

};

const button={

width:"100%",

padding:"15px",

marginTop:"20px",

border:"none",

borderRadius:"10px",

background:"#2563eb",

color:"#fff",

fontSize:"16px",

cursor:"pointer"

};
