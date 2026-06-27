export default function RecentActivity(){

const activity=[

"Resume Uploaded",

"ATS Score Improved",

"Applied to Infosys",

"Saved TCS Job",

"Generated Cover Letter"

];

return(

<div

style={{

background:"#fff",

padding:"25px",

borderRadius:"18px",

boxShadow:"0 8px 25px rgba(0,0,0,.06)"

}}

>

<h2>

Recent Activity

</h2>

{

activity.map((item,index)=>(

<div

key={index}

style={{

padding:"15px 0",

borderBottom:"1px solid #eee"

}}

>

✅ {item}

</div>

))

}

</div>

);

}
