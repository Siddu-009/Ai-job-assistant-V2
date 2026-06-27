import { useState } from "react";

export default function CareerRoadmap() {

  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateRoadmap = async () => {

    if (!role || !skills) {

      alert("Please enter your target role and current skills.");

      return;

    }

    setLoading(true);

    try {

      const response = await fetch(

        "/api/career-roadmap/",

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json"

          },

          body: JSON.stringify({

            role,

            skills

          })

        }

      );

      const data = await response.json();

      setRoadmap(data);

    }

    catch {

      alert("Unable to generate roadmap.");

    }

    setLoading(false);

  };

  return (

    <div
      style={{
        maxWidth: "1200px",
        margin: "40px auto",
        background: "#fff",
        padding: "35px",
        borderRadius: "20px",
        boxShadow: "0 15px 35px rgba(0,0,0,.08)"
      }}
    >

      <h1>AI Career Roadmap</h1>

      <p
        style={{
          color: "#6b7280"
        }}
      >
        Generate your personalized learning roadmap.
      </p>

      <input
        placeholder="Target Role (Example: DevOps Engineer)"
        value={role}
        onChange={(e)=>setRole(e.target.value)}
        style={input}
      />

      <textarea
        rows="6"
        placeholder="Current Skills (comma separated)"
        value={skills}
        onChange={(e)=>setSkills(e.target.value)}
        style={textarea}
      />

      <button
        onClick={generateRoadmap}
        disabled={loading}
        style={button}
      >
        {loading ? "Generating..." : "Generate Roadmap"}
      </button>

      {roadmap && (

        <div
          style={{
            marginTop: "35px"
          }}
        >

          <h2>Your Career Roadmap</h2>

          <div
            style={{
              marginTop: "20px",
              background: "#f8fafc",
              padding: "20px",
              borderRadius: "12px"
            }}
          >

            <pre
              style={{
                whiteSpace: "pre-wrap",
                fontFamily: "inherit"
              }}
            >
              {JSON.stringify(roadmap, null, 2)}
            </pre>

          </div>

        </div>

      )}

    </div>

  );

}

const input = {

  width: "100%",

  padding: "14px",

  marginTop: "20px",

  borderRadius: "10px",

  border: "1px solid #d1d5db"

};

const textarea = {

  width: "100%",

  padding: "14px",

  marginTop: "20px",

  borderRadius: "10px",

  border: "1px solid #d1d5db"

};

const button = {

  width: "100%",

  padding: "16px",

  marginTop: "25px",

  border: "none",

  borderRadius: "12px",

  background: "#2563eb",

  color: "#fff",

  fontSize: "17px",

  cursor: "pointer"

};
