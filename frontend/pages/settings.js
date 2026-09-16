import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function Settings() {
  const { colors } = useTheme();

  const [darkMode, setDarkMode] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {

      if (typeof window !== "undefined") {

          setDarkMode(
              localStorage.getItem("theme") === "dark"
          );

          setEmailNotifications(
              JSON.parse(localStorage.getItem("emailNotifications") ?? "true")
          );

          setAutoApply(
              JSON.parse(localStorage.getItem("autoApply") ?? "false")
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

    localStorage.setItem(
        "emailNotifications",
        JSON.stringify(emailNotifications)
    );

    localStorage.setItem(
        "autoApply",
        JSON.stringify(autoApply)
    );

    setSuccess("Settings saved successfully.");

    window.dispatchEvent(new CustomEvent("themechange"));

    alert("Settings Saved");

  };

  return (

<div
style={{
maxWidth:"900px",
margin:"40px auto",
background: colors.card,
border: colors.borderStyle,
padding:"35px",
borderRadius:"20px",
boxShadow:"0 15px 35px rgba(0,0,0,.08)"
}}
>

<h1
style={{
    color: colors.text
}}
>

Settings

</h1>

<div
style={{
marginTop:"30px"
}}
>

<label
style={{
    color: colors.text
}}
>

<input

type="checkbox"

checked={darkMode}

onChange={() => setDarkMode(prev => !prev)}

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
