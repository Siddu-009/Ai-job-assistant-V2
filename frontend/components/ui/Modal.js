export default function Modal({

open,

title,

children,

onClose

}){

if(!open)return null;

return(

<div

style={{

position:"fixed",

top:0,

left:0,

right:0,

bottom:0,

background:"rgba(0,0,0,.45)",

display:"flex",

justifyContent:"center",

alignItems:"center",

zIndex:999

}}

>

<div

style={{

width:"650px",

maxWidth:"95%",

background: colors.card,
border: colors.borderStyle,

borderRadius:"18px",

padding:"30px"

}}

>

<div

style={{

display:"flex",

justifyContent:"space-between",

marginBottom:"20px"

}}

>

<h2>{title}</h2>

<button

onClick={onClose}

style={{

background:"none",

border:"none",

fontSize:"24px",

cursor:"pointer"

}}

>

×

</button>

</div>

{children}

</div>

</div>

);

}
