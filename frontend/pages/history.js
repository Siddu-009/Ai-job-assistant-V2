import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function History() {
  const { colors } = useTheme();
  

  const [history, setHistory] = useState([]);

  useEffect(() => {

    loadHistory();

  }, []);

  const loadHistory = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(

        "/api/history/",

        {

          method:"POST",

          headers:{

            "Content-Type":"application/json"

          },

          body:JSON.stringify({

            token

          })

        }

      );

      const data = await response.json();

      setHistory(

        data.history ||

        data ||

        []

      );

    }

    catch{

      alert("Unable to load history.");

    }

  };

  return(

<div

style={{

maxWidth:"1200px",

margin:"40px auto",

background: colors.card,
border: colors.borderStyle,

padding:"35px",

borderRadius:"20px",

boxShadow:"0 15px 35px rgba(0,0,0,.08)"

}}

>

<h1>

Activity History

</h1>

{

history.map((item,index)=>(

<div

key={index}

style={{

padding:"20px",

borderBottom:"1px solid #eee"

}}

>

<h3>

{item.title}

</h3>

<p>

{item.description}

</p>

<small>

{item.created_at}

</small>

</div>

))

}

</div>

);

}
