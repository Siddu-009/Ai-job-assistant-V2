import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function InterviewQuestions() {
  const { colors } = useTheme();
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("Fresher");
  const [questions, setQuestions] = useState("");
  const [loading, setLoading] = useState(false);

  const generateQuestions = async () => {
    if (!role.trim()) {
      alert("Please enter role.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/interview-questions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          role,
          experience,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to generate interview questions.");
        return;
      }

      setQuestions(
        data.questions ||
        data.result ||
        JSON.stringify(data, null, 2)
      );
    } catch (err) {
      console.error(err);
      alert("Unable to generate interview questions.");
    } finally {
      setLoading(false);
    }
  };

  const copyQuestions = () => {
    navigator.clipboard.writeText(questions);
    alert("Copied Successfully");
  };

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "40px auto",
        background: colors.card,
border: colors.borderStyle,
        padding: "35px",
        borderRadius: "20px",
        boxShadow: "0 15px 35px rgba(0,0,0,.08)",
      }}
    >
      <h1>AI Interview Questions</h1>

      <input
        placeholder="Role (Example: DevOps Engineer)"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        style={input}
      />

      <select
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
        style={input}
      >
        <option>Fresher</option>
        <option>1-3 Years</option>
        <option>3-5 Years</option>
        <option>5+ Years</option>
      </select>

      <button
        onClick={generateQuestions}
        disabled={loading}
        style={button}
      >
        {loading ? "Generating..." : "Generate Interview Questions"}
      </button>

      {questions && (
        <>
          <h2 style={{ marginTop: "35px" }}>
            Interview Questions
          </h2>

          <textarea
            rows="25"
            value={questions}
            readOnly
            style={textarea}
          />

          <button
            onClick={copyQuestions}
            style={greenButton}
          >
            Copy
          </button>
        </>
      )}
    </div>
  );
}

const input = {
  width: "100%",
  padding: "14px",
  marginTop: "20px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "15px",
};

const textarea = {
  width: "100%",
  padding: "15px",
  marginTop: "20px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
  fontSize: "15px",
};

const button = {
  width: "100%",
  padding: "15px",
  marginTop: "20px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "16px",
};

const greenButton = {
  width: "100%",
  padding: "15px",
  marginTop: "20px",
  background: "#16a34a",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "16px",
};