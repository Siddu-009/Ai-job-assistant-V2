export default function WelcomeBanner(){

const hour=new Date().getHours();

let greeting="Good Evening";

if(hour<12){

greeting="Good Morning";

}

else if(hour<17){

greeting="Good Afternoon";

}

return(

<div

style={{

background:"linear-gradient(135deg,#2563eb,#4f46e5)",

color:"#fff",

padding:"35px",

borderRadius:"20px",

marginBottom:"30px"

}}

>

<h1>

{greeting}, Siddardha 👋

</h1>

<p>

Welcome back to your AI Job Assistant.

Continue improving your resume and applying for jobs.

</p>

</div>

);

}
