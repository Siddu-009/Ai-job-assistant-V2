import { useTheme } from "../../context/ThemeContext";

const INTERVIEWS = [
  { date: "30 June", company: "Infosys",   type: "Technical Round" },
  { date: "02 July", company: "TCS",       type: "HR Interview"    },
  { date: "05 July", company: "Capgemini", type: "Coding Test"     },
];

export default function UpcomingInterviews() {
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
      <h2 style={{ marginTop: 0 }}>Upcoming Interviews</h2>
      <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
        {INTERVIEWS.map(({ date, company, type }) => (
          <div
            key={`${company}-${date}`}
            style={{
              display:      "flex",
              alignItems:   "center",
              gap:          "12px",
              padding:      "12px 16px",
              borderRadius: "12px",
              background: darkMode ? "#1e293b" : "#f8fafc",
              fontSize:     "14px",
            }}
          >
            <span aria-hidden="true">📅</span>
            <div>
              <span style={{ fontWeight: 600 }}>{company}</span>
              <span style={{ color: colors.subText }}> — {date} — {type}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}