import { useEffect } from "react";

export default function Toast({

message,

type="success",

onClose

}){

useEffect(()=>{

if(!message)return;

const timer=setTimeout(onClose,3000);

return()=>clearTimeout(timer);

},[message,onClose]);

if(!message)return null;

const colors={

success:"#16a34a",

error:"#dc2626",

warning:"#f59e0b",

info:"#2563eb"

};

return(

<div

style={{

position:"fixed",

top:"20px",

right:"20px",

padding:"15px 20px",

background:colors[type],

color:"#fff",

borderRadius:"10px",

zIndex:1000,

boxShadow:"0 10px 20px rgba(0,0,0,.15)"

}}

>

{message}

</div>

);

}
