import { useEffect, useState } from "react";

export default function ResumeVersions() {

  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVersions();
  }, []);

  const loadVersions = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(

        "/api/resume-versions/",

        {

          method: "POST",

          headers: {
            "Content-Type":"application/json"
          },

          body: JSON.stringify({
            token
          })

        }

      );

      const data = await response.json();

      setVersions(data.versions || data || []);

    }

    catch{

      alert("Unable to load resume versions.");

    }

    setLoading(false);

  };

  const restoreVersion = async(id)=>{

    try{

      const token=localStorage.getItem("token");

      const response=await fetch(

        "/api/resume-versions/restore",

        {

          method:"POST",

          headers:{

            "Content-Type":"application/json"

          },

          body:JSON.stringify({

            token,

            version_id:id

          })

        }

      );

      const data=await response.json();

      alert(data.message||"Resume Restored");

    }

    catch{

      alert("Restore Failed");

    }

  };

  const downloadVersion=(id)=>{

    window.open(

      `/api/download/resume-version/${id}`,

      "_blank"

    );

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

Resume Versions

</h1>

<p

style={{

color:"#6b7280"

}}

>

Manage previous resume versions.

</p>

{

loading &&

<p>

Loading...

</p>

}

{

!loading && versions.length===0 &&

<p>

No versions available.

</p>

}

{

versions.map((item)=>(

<div

key={item.id}

style={{

marginTop:"20px",

padding:"20px",

border:"1px solid #e5e7eb",

borderRadius:"15px"

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

<h3>

Version {item.version}

</h3>

<p>

Created:

{" "}

{item.created_at}

</p>

</div>

<div

style={{

display:"flex",

gap:"12px"

}}

>

<button

onClick={()=>

downloadVersion(item.id)

}

style={{

padding:"10px 18px",

background:"#2563eb",

color:"#fff",

border:"none",

borderRadius:"10px",

cursor:"pointer"

}}

>

Download

</button>

<button

onClick={()=>

restoreVersion(item.id)

}

style={{

padding:"10px 18px",

background:"#16a34a",

color:"#fff",

border:"none",

borderRadius:"10px",

cursor:"pointer"

}}

>

Restore

</button>

</div>

</div>

</div>

))

}

</div>

);

}
