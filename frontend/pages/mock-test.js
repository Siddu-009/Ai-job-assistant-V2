import { useState } from "react";

export default function MockInterview() {

  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateQuestions = async () => {

    if (!role) {
      alert("Enter Target Role");
      return;
    }

    setLoading(true);

    try {

      const response = await fetch(

        "/api/interview-questions/",

        {

          method:"POST",

          headers:{

            "Content-Type":"application/json"

          },

          body:JSON.stringify({

            role

          })

        }

      );

      const data = await response.json();

      setQuestions(

        data.questions ||

        []

      );

    }

    catch{

      alert("Unable to generate questions.");

    }

    setLoading(false);

  };

  const updateAnswer=(index,value)=>{

    setAnswers(prev=>({

      ...prev,

      [index]:value

    }));

  };

  const submitInterview=async()=>{

    setLoading(true);

    try{

      const response=await fetch(

        "/api/mock-test/",

        {

          method:"POST",

          headers:{

            "Content-Type":"application/json"

          },

          body:JSON.stringify({

            role,

            answers

          })

        }

      );

      const data=await response.json();

      setFeedback(data);

    }

    catch{

      alert("Unable to evaluate test.");

    }

    setLoading(false);

  };

  return(

<div

style={{

maxWidth:"1200px",

margin:"40px auto",

background:"#fff",

padding:"35px",

borderRadius:"20px",

boxShadow:"0 15px 35px rgba(0,0,0,.08)"

}}

>

<h1>

AI Mock Interview

</h1>

<p

style={{

color:"#6b7280"

}}

>

Practice technical test using AI.

</p>

<input

placeholder="Target Role"

value={role}

onChange={(e)=>setRole(e.target.value)}

style={input}

/>

<button

onClick={generateQuestions}

disabled={loading}

style={button}

>

{

loading

?

"Generating..."

:

"Generate Questions"

}

</button>

{

questions.map((question,index)=>(

<div

key={index}

style={{

marginTop:"30px",

padding:"20px",

border:"1px solid #e5e7eb",

borderRadius:"15px"

}}

>

<h3>

Question {index+1}

</h3>

<p>

{question}

</p>

<textarea

rows="5"

placeholder="Type your answer..."

value={answers[index]||""}

onChange={(e)=>

updateAnswer(

index,

e.target.value

)

}

style={textarea}

/>

</div>

))

}

{

questions.length>0 &&

<button

onClick={submitInterview}

style={greenButton}

>

Submit Interview

</button>

}

{

feedback &&

<div

style={{

marginTop:"40px",

padding:"25px",

background:"#f8fafc",

borderRadius:"15px"

}}

>

<h2>

Interview Feedback

</h2>

<pre

style={{

whiteSpace:"pre-wrap",

fontFamily:"inherit"

}}

>

{JSON.stringify(feedback,null,2)}

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

marginTop:"20px",

border:"none",

borderRadius:"12px",

background:"#2563eb",

color:"#fff",

fontSize:"16px",

cursor:"pointer"

};

const greenButton={

width:"100%",

padding:"16px",

marginTop:"30px",

border:"none",

borderRadius:"12px",

background:"#16a34a",

color:"#fff",

fontSize:"16px",

cursor:"pointer"

};
