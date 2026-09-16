import Link from "next/link";
import { useTheme } from "../../../context/ThemeContext";

export default function ResumeToolCard({
  title,
  description,
  icon,
  href,
}) {

  const { colors } = useTheme();

  return (
    <div
      style={{
        background: colors.card,
        border: colors.borderStyle,
        borderRadius: 18,
        padding: 25,
        boxShadow: "0 10px 25px rgba(0,0,0,.06)",
      }}
    >
      <div
        style={{
          fontSize: 38,
          marginBottom: 15,
        }}
      >
        {icon}
      </div>

      <h2
        style={{
          marginBottom: 10,
          color: colors.text,
        }}
      >
        {title}
      </h2>

      <p
        style={{
          color: colors.subText,
          lineHeight: 1.7,
        }}
      >
        {description}
      </p>

      <Link href={href}>
        <button
          style={{
            marginTop: 20,
            padding: "10px 20px",
            border: "none",
            borderRadius: 10,
            background: "#2563eb",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Open
        </button>
      </Link>
    </div>
  );
}