import { useTheme } from "../../context/ThemeContext";

export default function AnalyticsCard({
  title,
  value,
  color,
}) {
  const { colors } = useTheme();

  return (
    <div
      style={{
        backgroundColor: colors.card,

        padding: "25px",

        borderRadius: "18px",

        border: `1px solid ${colors.border}`,

        borderTop: `5px solid ${color}`,

        boxShadow: colors.darkMode
          ? "0 10px 25px rgba(0, 0, 0, 0.25)"
          : "0 10px 25px rgba(15, 23, 42, 0.06)",

        transition:
          "background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",

        minHeight: "150px",
      }}
    >
      {/* Card Title */}

      <h3
        style={{
          margin: 0,

          color: colors.text,

          fontWeight: 500,

          fontSize: "14px",

          lineHeight: 1.5,

          transition: "color 0.3s ease",
        }}
      >
        {title}
      </h3>

      {/* Card Value */}

      <h1
        style={{
          marginTop: "20px",

          marginBottom: 0,

          fontSize: "38px",

          fontWeight: 700,

          color: color,

          lineHeight: 1.2,
        }}
      >
        {value}
      </h1>
    </div>
  );
}