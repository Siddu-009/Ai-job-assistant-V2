import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";

export default function ResumeBuilder() {

  const { colors } = useTheme();

  const input={

  width:"100%",

  padding:"14px",

  marginTop:"20px",

  borderRadius:"10px",

  border: colors.borderStyle,
  background: colors.card,
  color: colors.text,

  };

  const textarea={

  width:"100%",

  padding:"14px",

  marginTop:"20px",

  borderRadius:"10px",

  border: colors.borderStyle,
  background: colors.card,
  color: colors.text,

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
  
  const [viewUrl, setViewUrl] = useState("");

  const [downloadUrl, setDownloadUrl] = useState("");

  const update=(key,value)=>{

    setForm(prev=>({

      ...prev,

      [key]:value

    }));

  };

  const generateResume=async()=>{

    setLoading(true);

    setMessage("");

    if (
        !form.full_name ||
        !form.email ||
        !form.phone
    ) {
        setMessage("Please fill all required fields.");
        return;
    }

    try{

      const { data } = await api.post(
          "/resume-builder",
          form
      );
      
      setMessage(data.message);

      setViewUrl(data.view_url);

      setDownloadUrl(data.download_url);

    }

    catch(error){

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

background: colors.card,

border: colors.borderStyle,

padding:"40px",

borderRadius:"20px",

boxShadow:"0 15px 35px rgba(0,0,0,.08)"

}}

>

<h1
style={{
color: colors.text
}}
>
AI Resume Builder
</h1>

<p

style={{

color: colors.subText

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
padding:"20px",
background: colors.successBg || "#dcfce7",
borderRadius:"12px"
}}
>

<div
style={{
fontWeight:"600",
color: colors.successText || "#166534",
marginBottom:"15px"
}}
>

{message}

</div>

<div
style={{
display:"flex",
gap:"15px"
}}
>

<a
href={viewUrl}
target="_blank"
rel="noopener noreferrer"
style={{
padding:"12px 24px",
background:"#2563eb",
color:"#fff",
borderRadius:"10px",
textDecoration:"none",
fontWeight:"600"
}}
>

View Resume

</a>

<a
href={downloadUrl}
download
style={{
padding:"12px 24px",
background:"#16a34a",
color:"#fff",
borderRadius:"10px",
textDecoration:"none",
fontWeight:"600"
}}
>

Download Resume

</a>

</div>

</div>

}

</div>

);

}