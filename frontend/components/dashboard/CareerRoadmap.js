import { useTheme } from "../../context/ThemeContext";

const ROADMAP = [
  { done: true,  label: "Learn Linux Administration"  },
  { done: true,  label: "Master Docker"               },
  { done: true,  label: "Learn Kubernetes"            },
  { done: false, label: "Complete Terraform"          },
  { done: false, label: "AWS Solutions Architect"     },
  { done: false, label: "Build 5 Production Projects" },
];

export default function CareerRoadmap() {
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
    }}>
      <h2 style={{ marginTop: 0 }}>Career Roadmap</h2>
      <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {ROADMAP.map(({ done, label }) => (
          <div
            key={label}
            style={{
              display:    "flex",
              alignItems: "center",
              gap:        "10px",
              fontSize:   "14px",
              color: done ? colors.text : colors.subText,
            }}
          >
            <span aria-hidden="true">{done ? "✅" : "⏳"}</span>
            <span style={{ textDecoration: done ? "none" : "none" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}