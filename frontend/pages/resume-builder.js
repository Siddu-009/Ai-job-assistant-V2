import { useState } from "react";

export default function ResumeBuilder() {

  const [form, setForm] = useState({

    full_name:"",
    email:"",
    phone:"",
    location:"",
    summary:"",
    skills:"",
    education:"",
    experience:"",
    projects:""

  });

  const [loading,setLoading]=useState(false);

  const [message,setMessage]=useState("");

  const update=(key,value)=>{

    setForm(prev=>({

      ...prev,

      [key]:value

    }));

  };

  const generateResume=async()=>{

    setLoading(true);

    setMessage("");

    try{

      const response=await fetch(

        "/api/resume-builder/",

        {

          method:"POST",

          headers:{

            "Content-Type":"application/json"

          },

          body:JSON.stringify(form)

        }

      );

      const data=await response.json();

      setMessage(

        data.message ||

        "Resume Generated Successfully"

      );

    }

    catch{

      setMessage(

        "Resume Generation Failed"

      );

    }

    setLoading(false);

  };

  return(

<div

style={{

maxWidth:"1100px",

margin:"40px auto",

background:"#fff",

padding:"40px",

borderRadius:"20px",

boxShadow:"0 15px 35px rgba(0,0,0,.08)"

}}

>

<h1>

AI Resume Builder

</h1>

<p

style={{

color:"#6b7280"

}}

>

Create ATS Friendly Resume

</p>

<input

placeholder="Full Name"

value={form.full_name}

onChange={(e)=>update("full_name",e.target.value)}

style={input}

/>

<input

placeholder="Email"

value={form.email}

onChange={(e)=>update("email",e.target.value)}

style={input}

/>

<input

placeholder="Phone"

value={form.phone}

onChange={(e)=>update("phone",e.target.value)}

style={input}

/>

<input

placeholder="Location"

value={form.location}

onChange={(e)=>update("location",e.target.value)}

style={input}

/>

<textarea

rows="4"

placeholder="Professional Summary"

value={form.summary}

onChange={(e)=>update("summary",e.target.value)}

style={textarea}

/>

<textarea

rows="4"

placeholder="Skills"

value={form.skills}

onChange={(e)=>update("skills",e.target.value)}

style={textarea}

/>

<textarea

rows="5"

placeholder="Education"

value={form.education}

onChange={(e)=>update("education",e.target.value)}

style={textarea}

/>

<textarea

rows="6"

placeholder="Experience"

value={form.experience}

onChange={(e)=>update("experience",e.target.value)}

style={textarea}

/>

<textarea

rows="6"

placeholder="Projects"

value={form.projects}

onChange={(e)=>update("projects",e.target.value)}

style={textarea}

/>

<button

onClick={generateResume}

disabled={loading}

style={button}

>

{

loading

?

"Generating..."

:

"Generate Resume"

}

</button>

{

message &&

<div

style={{

marginTop:"20px",

padding:"15px",

background:"#dcfce7",

borderRadius:"12px",

color:"#166534"

}}

>

{message}

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
