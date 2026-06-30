import { useEffect, useState } from "react";

export default function MockTest() {
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("Fresher");
  const [sessionId, setSessionId] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState("");
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const [history, setHistory] = useState([]);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    loadRoles();
  }, []);

  useEffect(() => {
    if (!sessionId || finished) return;

    if (timer <= 0) {
      submitAnswer(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, sessionId, finished]);

  const loadRoles = async () => {
    try {
      const response = await fetch("/api/interview-roles/");
      const data = await response.json();
      setRoles(data);
    } catch {
      setRoles([
        "DevOps Engineer",
        "Python Developer",
        "Java Developer",
        "React Developer",
        "Node.js Developer",
        "Mechanical Engineer",
      ]);
    }
  };

  const startTest = async () => {
    if (!role) {
      alert("Please select a role.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/mock-test/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          experience,
          session_id: "",
          answer: "",
        }),
      });

      const data = await response.json();

      if (data.success === false) {
        alert(data.message);
        setLoading(false);
        return;
      }

      setSessionId(data.session_id);
      setQuestion(data.question);
      setQuestionNumber(data.question_number);
      setTotalQuestions(data.total_questions);
      setAnswer("");
      setEvaluation("");
      setHistory([]);
      setFinished(false);
      setFinalScore(null);
      setTimer(60);
    } catch {
      alert("Unable to start interview.");
    }

    setLoading(false);
  };

  const submitAnswer = async (timeout = false) => {
    if (!timeout && !answer.trim()) {
      alert("Please enter your answer.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/mock-test/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          experience,
          session_id: sessionId,
          answer: timeout ? "No Answer" : answer,
        }),
      });

      const data = await response.json();

      if (data.finished) {
        setFinished(true);
        setFinalScore(data.final_score);
        setHistory(data.history || []);
        setQuestion("");
        setEvaluation("");
      } else {
        setEvaluation(data.evaluation);
        setQuestion(data.question);
        setQuestionNumber(data.question_number);
        setAnswer("");
        setTimer(60);
      }
    } catch {
      alert("Unable to submit answer.");
    }

    setLoading(false);
  };

  const restartTest = () => {
    setRole("");
    setExperience("Fresher");
    setSessionId("");
    setQuestion("");
    setAnswer("");
    setEvaluation("");
    setQuestionNumber(0);
    setTotalQuestions(10);
    setFinished(false);
    setFinalScore(null);
    setHistory([]);
    setTimer(60);
  };

  const progress = totalQuestions ? (questionNumber / totalQuestions) * 100 : 0;

  return (
    <div style={container}>
      <h1 style={title}>AI Mock Interview</h1>
      <p style={subtitle}>Practice interview questions with AI evaluation.</p>

      {!sessionId && (
        <>
          <select value={role} onChange={(e) => setRole(e.target.value)} style={input}>
            <option value="">Select Role</option>
            {roles.map((r, index) => (
              <option key={index} value={r}>
                {r}
              </option>
            ))}
          </select>

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

          <button onClick={startTest} disabled={loading} style={button}>
            {loading ? "Starting..." : "Start Mock Interview"}
          </button>
        </>
      )}

      {sessionId && !finished && (
        <>
          <div style={progressOuter}>
            <div
              style={{
                ...progressInner,
                width: `${progress}%`,
              }}
            />
          </div>

          <div style={topRow}>
            <div>
              <strong>Question {questionNumber}</strong> / {totalQuestions}
            </div>
            <div style={timerBox}>⏱ {timer}s</div>
          </div>

          <div style={questionCard}>
            <h2>Interview Question</h2>
            <p style={questionText}>{question}</p>
          </div>

          <textarea
            rows="8"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer..."
            style={textarea}
          />

          <button onClick={() => submitAnswer(false)} disabled={loading} style={greenButton}>
            {loading ? "Evaluating..." : "Submit Answer"}
          </button>

          {evaluation && (
            <div style={feedbackCard}>
              <h2>AI Feedback</h2>
              <textarea rows="12" value={evaluation} readOnly style={textarea} />
            </div>
          )}
        </>
      )}

      {finished && (
        <>
          <div style={resultCard}>
            <h2>Interview Completed</h2>
            <h1 style={scoreStyle}>{finalScore}%</h1>
            <p>Congratulations! You have completed the mock interview.</p>
          </div>

          {history.length > 0 && (
            <>
              <h2 style={{ marginTop: "40px" }}>Interview Summary</h2>
              {history.map((item, index) => (
                <div key={index} style={historyCard}>
                  <h3>Question {index + 1}</h3>
                  <p>
                    <strong>Question:</strong> {item.question}
                  </p>
                  <p>
                    <strong>Your Answer:</strong> {item.answer}
                  </p>
                  <p>
                    <strong>Score:</strong> {item.score}/10
                  </p>
                </div>
              ))}
            </>
          )}

          <button onClick={restartTest} style={button}>
            Start New Interview
          </button>
        </>
      )}
    </div>
  );
}

const container = {
  maxWidth: "1100px",
  margin: "40px auto",
  background: "#ffffff",
  padding: "35px",
  borderRadius: "20px",
  boxShadow: "0 15px 35px rgba(0,0,0,.08)",
};

const title = {
  textAlign: "center",
  marginBottom: "10px",
  color: "#1e293b",
};

const subtitle = {
  textAlign: "center",
  color: "#64748b",
  marginBottom: "30px",
};

const input = {
  width: "100%",
  padding: "14px",
  marginTop: "18px",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  fontSize: "15px",
};

const textarea = {
  width: "100%",
  padding: "15px",
  marginTop: "20px",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  fontSize: "15px",
  resize: "vertical",
  fontFamily: "inherit",
  lineHeight: "1.6",
};

const button = {
  width: "100%",
  padding: "16px",
  marginTop: "20px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "600",
};

const greenButton = {
  ...button,
  background: "#16a34a",
};

const progressOuter = {
  width: "100%",
  height: "10px",
  background: "#e5e7eb",
  borderRadius: "50px",
  marginTop: "30px",
  overflow: "hidden",
};

const progressInner = {
  height: "100%",
  background: "#2563eb",
  transition: "width .4s",
};

const topRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "20px",
  marginBottom: "20px",
};

const timerBox = {
  background: "#fee2e2",
  color: "#b91c1c",
  padding: "8px 16px",
  borderRadius: "10px",
  fontWeight: "700",
};

const questionCard = {
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  padding: "25px",
  borderRadius: "15px",
  marginTop: "15px",
};

const questionText = {
  fontSize: "18px",
  lineHeight: "1.8",
  color: "#334155",
};

const feedbackCard = {
  marginTop: "35px",
  background: "#f0fdf4",
  border: "1px solid #bbf7d0",
  padding: "20px",
  borderRadius: "15px",
};

const resultCard = {
  textAlign: "center",
  padding: "35px",
  background: "#eff6ff",
  borderRadius: "18px",
  border: "1px solid #bfdbfe",
  marginTop: "25px",
};

const scoreStyle = {
  color: "#16a34a",
  fontSize: "60px",
  margin: "15px 0",
};

const historyCard = {
  marginTop: "20px",
  padding: "20px",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  background: "#fafafa",
};
