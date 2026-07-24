import { useTheme } from "../../context/ThemeContext";

export default function ProfileStrength() {

  const { colors } = useTheme();

  return (

    <div
      style={{
        background: colors.card,
        color: colors.text,
        border: colors.borderStyle,
        padding: "25px",
        borderRadius: "18px",
        boxShadow: "0 8px 25px rgba(0,0,0,.06)"
      }}
    >

      <h2
        style={{
          marginTop: 0,
          color: colors.text
        }}
      >
        Profile Completion
      </h2>

      <div
        style={{
          marginTop: "20px",
          height: "12px",
          background: colors.background,
          borderRadius: "20px"
        }}
      >
        <div
          style={{
            width: "92%",
            height: "100%",
            background: "#16a34a",
            borderRadius: "20px"
          }}
        />
      </div>

      <h3
        style={{
          marginTop: "18px",
          color: colors.text
        }}
      >
        92%
      </h3>

      <p
        style={{
          color: colors.subText
        }}
      >
        Complete Certifications to reach 100%.
      </p>

    </div>

  );
}