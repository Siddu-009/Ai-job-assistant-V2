export default function BarChart(){

const values=[40,65,85,70,92,55,80];

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

Weekly Applications

</h2>

<div

style={{

display:"flex",

alignItems:"flex-end",

height:"250px",

gap:"15px",

marginTop:"25px"

}}

>

{

values.map((value,index)=>(

<div

key={index}

style={{

flex:1,

display:"flex",

flexDirection:"column",

alignItems:"center"

}}

>

<div

style={{

width:"100%",

height:`${value*2}px`,

background:"#2563eb",

borderRadius:"10px 10px 0 0"

}}

>

</div>

<p>

{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][index]}

</p>

</div>

))

}

</div>

</div>

);

}
