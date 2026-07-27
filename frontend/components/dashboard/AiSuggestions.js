import { useTheme } from "../../context/ThemeContext";

const AI_SUGGESTIONS = [
  "Improve your ATS score by adding Kubernetes projects.",
  "Add Terraform and Helm certifications.",
  "Tailor your resume before every application.",
  "Complete your profile to reach 100%.",
  "Practice today's AI mock interview.",
];

export default function AiSuggestions() {
  const { colors } = useTheme();

  return (
    <div
      style={{
        background: colors.card,
        color: colors.text,
        border: colors.borderStyle,
        padding: "25px",
        borderRadius: "18px",
        boxShadow: "0 8px 25px rgba(0,0,0,.06)",
      }}
    >
      <h2 style={{ marginTop: 0 }}>AI Suggestions</h2>

      <ul style={{ marginTop: 16, lineHeight: 2, paddingLeft: 20 }}>
        {AI_SUGGESTIONS.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}