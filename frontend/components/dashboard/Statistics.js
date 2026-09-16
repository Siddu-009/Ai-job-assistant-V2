import { useTheme } from "../../context/ThemeContext";
export default function Statistics() {
    const { colors } = useTheme();

const cards = [
  {
    title: "ATS Score",
    value: "92%",
    color: "#2563eb",
  },
  {
    title: "Applications",
    value: 48,
    color: "#22c55e",
  },
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

background: colors.card,

borderRadius:"18px",

padding:"25px",

boxShadow:"0 10px 30px rgba(0,0,0,.08)",

borderTop:`5px solid ${card.color}`

}}

>

<p

style={{

margin:0,

color: colors.subText

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
