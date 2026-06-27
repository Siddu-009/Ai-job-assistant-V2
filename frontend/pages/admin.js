import { useEffect, useState } from "react";

export default function AdminDashboard() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        "/api/admin/dashboard",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            token
          })
        }
      );

      const result = await response.json();

      setData(result);

    } catch {

      alert("Unable to load admin dashboard.");

    }

    setLoading(false);

  };

  if (loading)
    return <h2 style={{padding:"40px"}}>Loading...</h2>;

  return (

<div
style={{
maxWidth:"1300px",
margin:"40px auto",
padding:"35px",
background:"#fff",
borderRadius:"20px",
boxShadow:"0 15px 35px rgba(0,0,0,.08)"
}}
>

<h1>Admin Dashboard</h1>

<div
style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",
gap:"20px",
marginTop:"30px"
}}
>

<Card
title="Users"
value={data?.users || 0}
color="#2563eb"
/>

<Card
title="Resumes"
value={data?.resumes || 0}
color="#16a34a"
/>

<Card
title="Applications"
value={data?.applications || 0}
color="#f59e0b"
/>

<Card
title="Jobs"
value={data?.jobs || 0}
color="#7c3aed"
/>

</div>

<div
style={{
marginTop:"40px"
}}
>

<h2>Recent Activity</h2>

{
(data?.recent_activity || []).map((item,index)=>(

<div
key={index}
style={{
padding:"15px",
borderBottom:"1px solid #eee"
}}
>

<strong>{item.user}</strong>

<p>{item.action}</p>

<small>{item.time}</small>

</div>

))
}

</div>

</div>

);

}

function Card({title,value,color}){

return(

<div
style={{
padding:"25px",
borderRadius:"15px",
background:"#fff",
border:"1px solid #e5e7eb"
}}
>

<h3
style={{
margin:0,
color:"#6b7280"
}}
>
{title}
</h3>

<h1
style={{
marginTop:"15px",
color
}}
>
{value}
</h1>

</div>

);

}
