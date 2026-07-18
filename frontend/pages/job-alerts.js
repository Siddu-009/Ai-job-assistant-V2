import { useEffect, useState } from "react";

export default function JobAlerts() {

  const [alerts, setAlerts] = useState([]);

  const [role, setRole] = useState("");

  const [location, setLocation] = useState("");

  const [salary, setSalary] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {

    loadAlerts();

  }, []);

  const loadAlerts = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(

        "/api/job-alerts/",

        {

          method:"POST",

          headers:{

            "Content-Type":"application/json"

          },

          body:JSON.stringify({

            token

          })

        }

      );

      const data = await response.json();

      if (Array.isArray(data.alerts)) {
          setAlerts(data.alerts);
      } else {
          setAlerts([]);
      }
          }

    catch{

      console.log("Unable to load alerts");

    }

  };

  const createAlert = async () => {

    if(!role){

      alert("Enter Job Role");

      return;

    }

    setLoading(true);

    try{

      const token = localStorage.getItem("token");

      const response = await fetch(

        "/api/job-alerts/create",

        {

          method:"POST",

          headers:{

            "Content-Type":"application/json"

          },

          body:JSON.stringify({

            token,

            role,

            location,

            salary

          })

        }

      );

      const data = await response.json();

      alert(

        data.message ||

        "Alert Created Successfully"

      );

      setRole("");

      setLocation("");

      setSalary("");

      loadAlerts();

    }

    catch{

      alert("Unable to create alert.");

    }

    setLoading(false);

  };

  const deleteAlert = async(id)=>{

    await fetch(

      "/api/job-alerts/delete",

      {

        method:"POST",

        headers:{

          "Content-Type":"application/json"

        },

        body:JSON.stringify({

          id

        })

      }

    );

    loadAlerts();

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

Job Alerts

</h1>

<p

style={{

color:"#6b7280"

}}

>

Receive notifications whenever matching jobs are available.

</p>

<input

placeholder="Job Role"

value={role}

onChange={(e)=>setRole(e.target.value)}

style={input}

/>

<input

placeholder="Preferred Location"

value={location}

onChange={(e)=>setLocation(e.target.value)}

style={input}

/>

<input

placeholder="Minimum Salary"

value={salary}

onChange={(e)=>setSalary(e.target.value)}

style={input}

/>

<button

onClick={createAlert}

disabled={loading}

style={button}

>

{

loading

?

"Creating..."

:

"Create Alert"

}

</button>

<hr

style={{

margin:"35px 0"

}}

/>

<h2>

My Alerts

</h2>

{

alerts.length===0 &&

<p>

No Alerts Created.

</p>

}

{

alerts.map((alert,index)=>(

<div

key={index}

style={{

padding:"20px",

marginTop:"20px",

border:"1px solid #e5e7eb",

borderRadius:"12px"

}}

>

<h3>

{alert.role}

</h3>

<p>

📍 {alert.location}

</p>

<p>

💰 {alert.salary}

</p>

<button

onClick={()=>deleteAlert(alert.id)}

style={deleteButton}

>

Delete Alert

</button>

</div>

))

}

</div>

);

}

const input={

width:"100%",

padding:"14px",

marginTop:"15px",

borderRadius:"10px",

border:"1px solid #d1d5db"

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

const deleteButton={

marginTop:"15px",

padding:"10px 20px",

background:"#dc2626",

color:"#fff",

border:"none",

borderRadius:"8px",

cursor:"pointer"

};
