import { useEffect, useState } from "react";

export default function Notifications() {

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {

    setNotifications([
      {
        title:"Resume Generated",
        message:"Your ATS Resume is ready."
      },
      {
        title:"Interview Scheduled",
        message:"Google interview tomorrow."
      }
    ]);

  },[]);

  return(

<div
style={{
maxWidth:"900px",
margin:"40px auto",
background:"#fff",
padding:"35px",
borderRadius:"20px",
boxShadow:"0 15px 35px rgba(0,0,0,.08)"
}}
>

<h1>

Notifications

</h1>

{

notifications.map((item,index)=>(

<div

key={index}

style={{

padding:"20px",

marginTop:"20px",

border:"1px solid #eee",

borderRadius:"12px"

}}

>

<h3>

{item.title}

</h3>

<p>

{item.message}

</p>

</div>

))

}

</div>

);

}
