import { useEffect, useState } from "react";

export default function ActivityTimeline() {

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    loadActivities();

  }, []);

  const loadActivities = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(

        "/api/activity/",

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

      setActivities(

        data.activities || data || []

      );

    }

    catch{

      alert("Unable to load activity.");

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

Activity Timeline

</h1>

<p

style={{

color:"#6b7280"

}}

>

Track everything you've done in AI Job Assistant.

</p>

{

loading &&

<p>

Loading...

</p>

}

{

!loading && activities.length===0 &&

<p>

No activities available.

</p>

}

<div

style={{

marginTop:"30px"

}}

>

{

activities.map((item,index)=>(

<div

key={index}

style={{

display:"flex",

gap:"20px",

marginBottom:"25px"

}}

>

<div

style={{

width:"18px",

height:"18px",

borderRadius:"50%",

background:"#2563eb",

marginTop:"8px"

}}

></div>

<div

style={{

flex:1,

borderLeft:"3px solid #2563eb",

paddingLeft:"20px",

paddingBottom:"20px"

}}

>

<h3>

{item.title || item.action}

</h3>

<p>

{item.description}

</p>

<p

style={{

color:"#6b7280",

fontSize:"14px"

}}

>

{item.created_at || item.time}

</p>

</div>

</div>

))

}

</div>

</div>

);

}
