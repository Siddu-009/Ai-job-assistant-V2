import { useTheme } from "../../context/ThemeContext";

export default function ProfileScore({ data }) {
  const { colors, darkMode } = useTheme();

  const profileScore = 92;

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
      {/* Heading */}

      <h2
        style={{
          margin: 0,

          color: colors.text,

          fontSize: "18px",

          fontWeight: 700,

          transition: "color 0.3s ease",
        }}
      >
        Profile Score
      </h2>

      {/* Score */}

      <h1
        style={{
          color: "#16a34a",

          marginTop: "25px",
          marginBottom: 0,

          fontSize: "38px",
          fontWeight: 700,
        }}
      >
        {profileScore}%
      </h1>

      {/* Progress Track */}

      <div
        style={{
          width: "100%",

          height: "12px",

          backgroundColor: darkMode
            ? "#334155"
            : "#e5e7eb",

          borderRadius: "20px",

          marginTop: "15px",

          overflow: "hidden",

          transition:
            "background-color 0.3s ease",
        }}
      >
        {/* Progress Bar */}

        <div
          style={{
            width: `${profileScore}%`,

            height: "100%",

            backgroundColor: "#16a34a",

            borderRadius: "20px",

            transition: "width 0.4s ease",
          }}
        />
      </div>

      {/* Description */}

      <p
        style={{
          marginTop: "15px",
          marginBottom: 0,

          color: colors.subText,

          fontSize: "14px",
          lineHeight: 1.6,

          transition: "color 0.3s ease",
        }}
      >
        Your profile is nearly complete.
      </p>
    </div>
  );
}