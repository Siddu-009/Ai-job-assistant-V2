import { useTheme } from "../../context/ThemeContext";

const WEEKLY_PROGRESS = [
  { label: "Resume Improvement", value: 90 },
  { label: "Job Applications",   value: 70 },
  { label: "Skill Learning",     value: 60 },
  { label: "Mock Interviews",    value: 45 },
];

export default function WeeklyProgress() {
  const { colors, darkMode } = useTheme();
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
      <h2 style={{ marginTop: 0 }}>Weekly Progress</h2>
      <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {WEEKLY_PROGRESS.map(({ label, value }) => (
          <div key={label}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" }}>
              <span>{label}</span>
              <span style={{ fontWeight: 600 }}>{value}%</span>
            </div>
            {/* FIXED: native <progress> has inconsistent cross-browser styling and
                can't be themed to match the design system. Replaced with a
                custom bar that matches the rest of the codebase. */}
            <div style={{ width: "100%", height: "10px", borderRadius: "10px", background: darkMode ? "#334155" : "#e5e7eb" }}>
              <div
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={label}
                style={{
                  width:        `${value}%`,
                  height:       "10px",
                  borderRadius: "10px",
                  background:   "linear-gradient(90deg, #2563eb, #7c3aed)",
                  transition:   "width 0.4s ease",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}