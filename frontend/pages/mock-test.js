import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function MockTest() {
  const { colors, darkMode } = useTheme();

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

    if (timer === 0) {
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

      setRoles(Array.isArray(data) ? data : []);
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

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        alert(data.message || data.detail || "Something went wrong.");
        return;
      }

      if (data.success === false) {
        alert(data.message);
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
    } catch (error) {
      console.error(error);
      alert("Unable to start interview.");
    } finally {
      setLoading(false);
    }
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

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        alert(data.message || data.detail || "Something went wrong.");
        return;
      }

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
    } catch (error) {
      console.error(error);
      alert("Unable to submit answer.");
    } finally {
      setLoading(false);
    }
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

  const progress = totalQuestions
    ? (questionNumber / totalQuestions) * 100
    : 0;

  const containerStyle = {
    ...styles.container,
    backgroundColor: colors.card,
    color: colors.text,
    border: `1px solid ${colors.border}`,
    boxShadow: darkMode
      ? "0 15px 35px rgba(0, 0, 0, 0.25)"
      : "0 15px 35px rgba(0, 0, 0, 0.08)",
  };

  const inputStyle = {
    ...styles.input,
    backgroundColor: colors.cardSecondary,
    color: colors.text,
    border: `1px solid ${colors.border}`,
  };

  const textareaStyle = {
    ...styles.textarea,
    backgroundColor: colors.cardSecondary,
    color: colors.text,
    border: `1px solid ${colors.border}`,
  };

  const buttonStyle = {
    ...styles.button,
    backgroundColor: colors.button,
    opacity: loading ? 0.7 : 1,
  };

  const greenButtonStyle = {
    ...styles.greenButton,
    opacity: loading ? 0.7 : 1,
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ ...styles.title, color: colors.text }}>
        AI Mock Interview
      </h1>

      <p style={{ ...styles.subtitle, color: colors.subText }}>
        Practice interview questions with AI evaluation.
      </p>

      {!sessionId && (
        <>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={inputStyle}
          >
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
            style={inputStyle}
          >
            <option>Fresher</option>
            <option>1-3 Years</option>
            <option>3-5 Years</option>
            <option>5+ Years</option>
          </select>

          <button
            onClick={startTest}
            disabled={loading || !role}
            style={{
              ...buttonStyle,
              cursor: loading || !role ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Starting..." : "Start Mock Interview"}
          </button>
        </>
      )}

      {sessionId && !finished && (
        <>
          <div
            style={{
              ...styles.progressOuter,
              backgroundColor: darkMode ? "#334155" : "#e5e7eb",
            }}
          >
            <div
              style={{
                ...styles.progressInner,
                width: `${progress}%`,
              }}
            />
          </div>

          <div style={styles.topRow}>
            <div style={{ color: colors.text }}>
              <strong>Question {questionNumber}</strong> / {totalQuestions}
            </div>

            <div
              style={{
                ...styles.timerBox,
                backgroundColor: darkMode ? "#7f1d1d" : "#fee2e2",
                color: darkMode ? "#fecaca" : "#b91c1c",
              }}
            >
              ⏱ {timer}s
            </div>
          </div>

          <div
            style={{
              ...styles.questionCard,
              backgroundColor: colors.cardSecondary,
              border: `1px solid ${colors.border}`,
            }}
          >
            <h2 style={{ color: colors.text }}>Interview Question</h2>

            <p
              style={{
                ...styles.questionText,
                color: colors.text,
              }}
            >
              {question}
            </p>
          </div>

          <textarea
            rows="8"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer..."
            style={textareaStyle}
          />

          <button
            onClick={() => submitAnswer(false)}
            disabled={loading || !answer.trim()}
            style={{
              ...greenButtonStyle,
              cursor:
                loading || !answer.trim() ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Evaluating..." : "Submit Answer"}
          </button>

          {evaluation && (
            <div
              style={{
                ...styles.feedbackCard,
                backgroundColor: darkMode ? "#052e16" : "#f0fdf4",
                border: `1px solid ${
                  darkMode ? "#166534" : "#bbf7d0"
                }`,
              }}
            >
              <h2 style={{ color: colors.text }}>AI Feedback</h2>

              <textarea
                rows="12"
                value={evaluation}
                readOnly
                style={textareaStyle}
              />
            </div>
          )}
        </>
      )}

      {finished && (
        <>
          <div
            style={{
              ...styles.resultCard,
              backgroundColor: darkMode ? "#172554" : "#eff6ff",
              border: `1px solid ${
                darkMode ? "#1e40af" : "#bfdbfe"
              }`,
            }}
          >
            <h2 style={{ color: colors.text }}>Interview Completed</h2>

            <h1 style={styles.scoreStyle}>{finalScore}%</h1>

            <p style={{ color: colors.subText }}>
              Congratulations! You have completed the mock interview.
            </p>
          </div>

          {history.length > 0 && (
            <>
              <h2
                style={{
                  ...styles.summaryTitle,
                  color: colors.text,
                }}
              >
                Interview Summary
              </h2>

              {history.map((item, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.historyCard,
                    backgroundColor: colors.cardSecondary,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <h3 style={{ color: colors.text }}>
                    Question {index + 1}
                  </h3>

                  <p style={{ color: colors.text }}>
                    <strong>Question:</strong> {item.question}
                  </p>

                  <p style={{ color: colors.text }}>
                    <strong>Your Answer:</strong> {item.answer}
                  </p>

                  <p style={{ color: colors.text }}>
                    <strong>Score:</strong> {item.score}/10
                  </p>
                </div>
              ))}
            </>
          )}

          <button onClick={restartTest} style={buttonStyle}>
            Start New Interview
          </button>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1100px",
    margin: "40px auto",
    padding: "35px",
    borderRadius: "20px",
    transition:
      "background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease",
    boxSizing: "border-box",
  },

  title: {
    textAlign: "center",
    marginBottom: "10px",
    fontSize: "32px",
    fontWeight: "700",
  },

  subtitle: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "16px",
  },

  input: {
    width: "100%",
    padding: "14px",
    marginTop: "18px",
    borderRadius: "10px",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",
    padding: "15px",
    marginTop: "20px",
    borderRadius: "10px",
    fontSize: "15px",
    resize: "vertical",
    fontFamily: "inherit",
    lineHeight: "1.6",
    outline: "none",
    boxSizing: "border-box",
  },

  button: {
    width: "100%",
    padding: "16px",
    marginTop: "20px",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "opacity 0.2s ease",
  },

  greenButton: {
    width: "100%",
    padding: "16px",
    marginTop: "20px",
    backgroundColor: "#16a34a",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "opacity 0.2s ease",
  },

  progressOuter: {
    width: "100%",
    height: "10px",
    borderRadius: "50px",
    marginTop: "30px",
    overflow: "hidden",
  },

  progressInner: {
    height: "100%",
    backgroundColor: "#2563eb",
    transition: "width 0.4s ease",
  },

  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20px",
    marginBottom: "20px",
    gap: "15px",
  },

  timerBox: {
    padding: "8px 16px",
    borderRadius: "10px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  questionCard: {
    padding: "25px",
    borderRadius: "15px",
    marginTop: "15px",
  },

  questionText: {
    fontSize: "18px",
    lineHeight: "1.8",
  },

  feedbackCard: {
    marginTop: "35px",
    padding: "20px",
    borderRadius: "15px",
  },

  resultCard: {
    textAlign: "center",
    padding: "35px",
    borderRadius: "18px",
    marginTop: "25px",
  },

  scoreStyle: {
    color: "#16a34a",
    fontSize: "60px",
    margin: "15px 0",
  },

  summaryTitle: {
    marginTop: "40px",
  },

  historyCard: {
    marginTop: "20px",
    padding: "20px",
    borderRadius: "12px",
    lineHeight: "1.7",
  },
};