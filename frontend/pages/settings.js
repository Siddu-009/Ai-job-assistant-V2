import { useEffect, useState } from "react";

export default function Settings() {

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {

      if (typeof window !== "undefined") {

          setDarkMode(
              localStorage.getItem("theme") === "dark"
          );

      }

  }, []);

  const [emailNotifications, setEmailNotifications] = useState(true);

  const [autoApply, setAutoApply] = useState(false);

  const saveSettings = () => {

    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );

    alert("Settings Saved");

  };

  return (

<div
style={{
maxWidth:"900px",
margin:"40px auto",
background:"#fff",
padding:"35px",
borderRadius:"20px",
boxShadow:"0 15px 35px rgba(0,0,0,.08)"
}}
>

<h1>

Settings

</h1>

<div
style={{
marginTop:"30px"
}}
>

<label>

<input

type="checkbox"

checked={darkMode}

onChange={()=>setDarkMode(!darkMode)}

/>

{" "}Dark Mode

</label>

</div>

<div
style={{
marginTop:"20px"
}}
>

<label>

<input

type="checkbox"

checked={emailNotifications}

onChange={()=>setEmailNotifications(!emailNotifications)}

/>

{" "}Email Notifications

</label>

</div>

<div
style={{
marginTop:"20px"
}}
>

<label>

<input

type="checkbox"

checked={autoApply}

onChange={()=>setAutoApply(!autoApply)}

/>

{" "}Auto Apply

</label>

</div>

<button

onClick={saveSettings}

style={{

marginTop:"30px",

padding:"14px 25px",

border:"none",

background:"#2563eb",

color:"#fff",

borderRadius:"10px",

cursor:"pointer"

}}

>

Save Settings

</button>

</div>

);

}
