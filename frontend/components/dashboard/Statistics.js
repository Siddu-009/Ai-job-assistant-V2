export default function Statistics() {

const cards=[

{

title:"ATS Score",

value:"91%",

color:"#2563eb"

},

{

title:"Applications",

value:"24",

color:"#16a34a"

},

{

title:"Saved Jobs",

value:"18",

color:"#f59e0b"

},

{

title:"Interviews",

value:"4",

color:"#7c3aed"

},

{

title:"Profile",

value:"96%",

color:"#dc2626"

},

{

title:"AI Matches",

value:"42",

color:"#0891b2"

}

];

return(

<div

style={{

display:"grid",

gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",

gap:"20px",

marginBottom:"30px"

}}

>

{

cards.map((card,index)=>(

<div

key={index}

style={{

background:"#fff",

borderRadius:"18px",

padding:"25px",

boxShadow:"0 8px 25px rgba(0,0,0,.06)",

borderTop:`5px solid ${card.color}`

}}

>

<p

style={{

margin:0,

color:"#6b7280"

}}

>

{card.title}

</p>

<h1

style={{

marginTop:"15px",

color:card.color

}}

>

{card.value}

</h1>

</div>

))

}

</div>

);

}
