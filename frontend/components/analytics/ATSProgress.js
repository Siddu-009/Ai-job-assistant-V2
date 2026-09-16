import { useTheme } from "../../context/ThemeContext";

export default function ATSProgress({ data }) {
  const { colors, darkMode } = useTheme();

  const scores = [70, 76, 82, 87, 91];

  return (
    <div
      style={{
        backgroundColor: colors.card,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        borderRadius: "18px",
        padding: "25px",
        boxShadow: darkMode
          ? "0 10px 25px rgba(0, 0, 0, 0.25)"
          : "0 10px 25px rgba(15, 23, 42, 0.06)",
        transition:
          "background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease",
      }}
    >
      <h2
        style={{
          margin: 0,
          color: colors.text,
          fontSize: "18px",
          fontWeight: 700,
        }}
      >
        ATS Progress
      </h2>

      <div style={{ marginTop: "25px" }}>
        {scores.map((score, index) => (
          <div
            key={index}
            style={{
              marginBottom: "18px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: colors.text,
                fontSize: "14px",
              }}
            >
              <span>Version {index + 1}</span>

              <strong
                style={{
                  color: colors.text,
                  fontWeight: 700,
                }}
              >
                {score}%
              </strong>
            </div>

            <div
              style={{
                marginTop: "6px",
                height: "10px",
                backgroundColor: darkMode ? "#334155" : "#e5e7eb",
                borderRadius: "20px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${score}%`,
                  height: "100%",
                  backgroundColor: "#2563eb",
                  borderRadius: "20px",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}