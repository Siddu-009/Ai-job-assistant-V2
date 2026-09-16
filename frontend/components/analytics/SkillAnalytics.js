export default function SkillAnalytics(){

const skills=[

{

name:"AWS",

value:95

},

{

name:"Docker",

value:90

},

{

name:"Kubernetes",

value:82

},

{

name:"Terraform",

value:75

},

{

name:"Linux",

value:92

},

{

name:"Python",

value:65

}

];

return(

<div

style={{

background: colors.card,
border: colors.borderStyle,

padding:"25px",

borderRadius:"18px",

boxShadow:"0 8px 25px rgba(0,0,0,.06)"

}}

>

<h2>

Skill Strength

</h2>

{

skills.map(skill=>(

<div

key={skill.name}

style={{

marginTop:"18px"

}}

>

<div

style={{

display:"flex",

justifyContent:"space-between"

}}

>

<b>

{skill.name}

</b>

<span>

{skill.value}%

</span>

</div>

<div

style={{

height:"10px",

background:"#eee",

borderRadius:"20px",

marginTop:"8px"

}}

>

<div

style={{

width:`${skill.value}%`,

height:"100%",

background:"#16a34a",

borderRadius:"20px"

}}

>

</div>

</div>

</div>

))

}

</div>

);

}
