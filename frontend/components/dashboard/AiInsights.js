import { useTheme } from "../../context/ThemeContext";

const AI_INSIGHTS = [
  "🚀 Your ATS score increased by 8% this week.",
  "💼 14 new DevOps jobs match your profile.",
  "📄 Resume tailoring can improve interview chances.",
  "🎯 Complete AWS certification for higher job matches.",
  "🤖 Practice one mock interview today.",
];

export default function AiInsights() {
  const { colors } = useTheme();
  return (
    <div
      style={{
        background: colors.card,
        color: colors.text,
        border: colors.borderStyle,
        padding: "25px",
        borderRadius: "18px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
        marginBottom: 0,
      }}
    >
      <h2 style={{ marginTop: 0 }}>Latest AI Insights</h2>
      <ul style={{ marginTop: "16px", lineHeight: 2, paddingLeft: "20px" }}>
        {AI_INSIGHTS.map((s) => <li key={s} style={{ fontSize: "14px" }}>{s}</li>)}
      </ul>
    </div>
  );
}