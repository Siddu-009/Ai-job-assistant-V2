export default function ATSHistory(){

const history=[

82,

84,

86,

88,

90,

91

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

ATS Progress

</h2>

<div

style={{

display:"flex",

alignItems:"flex-end",

gap:"15px",

height:"220px",

marginTop:"25px"

}}

>

{

history.map((score,index)=>(

<div

key={index}

style={{

flex:1,

textAlign:"center"

}}

>

<div

style={{

height:`${score*2}px`,

background:"#7c3aed",

borderRadius:"10px 10px 0 0"

}}

>

</div>

<p>

V{index+1}

</p>

</div>

))

}

</div>

</div>

);

}
