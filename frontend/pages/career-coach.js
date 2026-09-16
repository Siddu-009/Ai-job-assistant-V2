import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function CareerCoach() {
  const { colors } = useTheme();

  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const askCoach = async () => {

    if (!question.trim()) {

      alert("Please enter your question.");

      return;

    }

    setResponse("");
    setLoading(true);

    try {

      const res = await fetch(

        "/api/career-coach/",

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json"

          },

          body: JSON.stringify({

            question

          })

        }

      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
          alert(data.message || data.detail || "Something went wrong.");
          return;
      }

      setResponse(

        data.answer ||

        data.response ||

        JSON.stringify(data,null,2)

      );

    }

    catch (error) {

        console.error(error);

        alert("Unable to get AI response.");

    }
    finally {

        setLoading(false);

    }

  };

  return(

<div

style={{

maxWidth:"1100px",

margin:"40px auto",

background: colors.card,
border: colors.borderStyle,

padding:"35px",

borderRadius:"20px",

boxShadow:"0 15px 35px rgba(0,0,0,.08)"

}}

>

<h1>

AI Career Coach

</h1>

<p

style={{

color: colors.subText

}}

>

Ask anything about your career, interviews, skills, roadmap or certifications.

</p>

<textarea

rows="6"

placeholder="Example: How can I become a DevOps Engineer in 6 months?"

value={question}

onChange={(e)=>setQuestion(e.target.value)}

style={textarea}

/>

<button

onClick={askCoach}

disabled={loading || !question.trim()}

style={button}

>

{

loading

?

"Thinking..."

:

"Ask AI Coach"

}

</button>

{

response &&

<div

style={{

marginTop:"35px",

padding:"20px",

background:"#f8fafc",

borderRadius:"12px"

}}

>

<h2>

AI Response

</h2>

<pre
style={{
whiteSpace: "pre-wrap",
wordBreak: "break-word",
lineHeight: "1.7",
fontFamily: "inherit",
}}
>

{response}

</pre>

</div>

}

</div>

);

}

const textarea={

width:"100%",

padding:"15px",

marginTop:"20px",

border:"1px solid #d1d5db",

borderRadius:"10px"

};

const button={

width:"100%",

padding:"15px",

marginTop:"20px",

background:"#2563eb",

color:"#fff",

border:"none",

borderRadius:"10px",

cursor:"pointer",

fontSize:"16px"

};
