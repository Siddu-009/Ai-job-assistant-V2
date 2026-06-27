export default function StatCard({
  icon,
  title,
  value,
  subtitle,
  color = "#2563eb",
  darkMode = false,
}) {
  const subColor = darkMode ? "#94a3b8" : "#64748b";
  const textColor = darkMode ? "#ffffff" : "#111827";
  const bgColor   = darkMode ? "#0f172a" : "#ffffff";

  return (
    <div
      style={{
        background:   bgColor,
        color:        textColor,
        padding:      "25px",
        borderRadius: "18px",
        boxShadow:    "0 8px 20px rgba(0,0,0,0.08)",
      }}
    >
      {/* Icon wrapper — gives the icon a tinted background pill */}
      <div
        aria-hidden="true"
        style={{
          display:         "inline-flex",
          alignItems:      "center",
          justifyContent:  "center",
          width:           "56px",
          height:          "56px",
          borderRadius:    "14px",
          background:      `${color}20`,
          color,
          marginBottom:    "16px",
        }}
      >
        {icon}
      </div>

      <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: subColor }}>
        {title}
      </p>

      <p
        style={{
          margin:     "8px 0 4px",
          fontSize:   "38px",
          fontWeight: 800,
          lineHeight: 1,
          color,
        }}
      >
        {value}
      </p>

      <p style={{ margin: 0, fontSize: "13px", color: subColor }}>
        {subtitle}
      </p>
    </div>
  );
}
