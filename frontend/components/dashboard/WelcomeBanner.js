import { useTheme } from "../../context/ThemeContext";

export default function WelcomeBanner() {

  const { colors } = useTheme();

  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 17) {
    greeting = "Good Afternoon";
  }

  return (
    <div
      style={{
        background: "linear-gradient(135deg,#2563eb,#4f46e5)",
        color: "#ffffff",
        padding: "35px",
        borderRadius: "20px",
        marginBottom: "30px",
        boxShadow: darkShadow(colors),
        border: colors.borderStyle
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: "32px",
          fontWeight: 700
        }}
      >
        {greeting}, Siddardha 👋
      </h1>

      <p
        style={{
          marginTop: "12px",
          fontSize: "16px",
          lineHeight: "1.7",
          color: "#e2e8f0"
        }}
      >
        Welcome back to your AI Job Assistant.
        <br />
        Continue improving your resume and applying for jobs.
      </p>
    </div>
  );
}

function darkShadow(colors) {
  return colors.background === "#020617"
    ? "0 15px 40px rgba(0,0,0,.35)"
    : "0 15px 35px rgba(37,99,235,.20)";
}