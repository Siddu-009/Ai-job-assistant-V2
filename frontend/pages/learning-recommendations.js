import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function LearningRecommendations() {
  const { colors } = useTheme();

  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);

  const generateRecommendations = async () => {

    if (!role) {

      alert("Please enter target role.");

      return;

    }

    const token = localStorage.getItem("token");

    if (!token) {

      window.location.href = "/login";

      return;

    }

    setLoading(true);

    try {

      const response = await fetch(

        "/api/learning-recommendations/",

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json"

          },

          body: JSON.stringify({
	   
            role

          })

        }

      );

      const data = await response.json();

      console.log(data);

      setRecommendations(data);

    }

    catch (err) {

      console.error(err);

      alert("Unable to generate recommendations.");

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <div
      style={{
        maxWidth:"1200px",
        margin:"40px auto",
        padding:"35px",
        background: colors.card,
border: colors.borderStyle,
        borderRadius:"20px",
        boxShadow:"0 15px 35px rgba(0,0,0,.08)"
      }}
    >

      <h1>Learning Recommendations</h1>

      <input

        type="text"

        placeholder="Target Role"

        value={role}

        onChange={(e)=>setRole(e.target.value)}

        style={input}

      />

      <button

        onClick={generateRecommendations}

        disabled={loading}

        style={button}

      >

        {

          loading

            ? "Generating..."

            : "Generate Recommendations"

        }

      </button>

      {

        recommendations &&

        <div style={{marginTop:"40px"}}>

          <h2>Learning Plan</h2>

          <pre

            style={{

              background:"#f8fafc",

              padding:"20px",

              borderRadius:"10px",

              whiteSpace:"pre-wrap",

              wordBreak:"break-word",

              fontFamily:"inherit"

            }}

          >

            {

              recommendations.roadmap

                ? recommendations.roadmap

                : JSON.stringify(recommendations,null,2)

            }

          </pre>

        </div>

      }

    </div>

  );

}

const input={

  width:"100%",

  padding:"14px",

  marginTop:"20px",

  border:"1px solid #d1d5db",

  borderRadius:"10px"

};

const button={

  width:"100%",

  padding:"15px",

  marginTop:"20px",

  border:"none",

  borderRadius:"10px",

  background:"#2563eb",

  color:"#fff",

  fontSize:"16px",

  cursor:"pointer"

};
