import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { colors, darkMode } = useTheme();

  const navLinks = [
    {
      name: "Dashboard",
      href: "/",
    },
    {
      name: "Resume",
      href: "/resume-converter",
    },
    {
      name: "ATS Score",
      href: "/ats-score",
    },
    {
      name: "Jobs",
      href: "/jobs",
    },
  ];

  return (
    <nav
      style={{
        background: colors.card,

        borderBottom: darkMode
          ? "1px solid rgba(148, 163, 184, 0.18)"
          : "1px solid #e2e8f0",

        padding: "18px 40px",

        display: "flex",

        justifyContent: "space-between",

        alignItems: "center",

        minHeight: "72px",

        boxSizing: "border-box",

        transition:
          "background 0.3s ease, border-color 0.3s ease, color 0.3s ease",

        position: "relative",

        zIndex: 50,
      }}
    >
      {/* ================================================================
          LOGO
          ================================================================ */}

      <Link
        href="/"
        style={{
          display: "flex",

          alignItems: "center",

          gap: "10px",

          fontWeight: 700,

          fontSize: "24px",

          color: "#2563eb",

          textDecoration: "none",

          whiteSpace: "nowrap",

          transition:
            "opacity 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = "0.85";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "1";
        }}
      >
        <Sparkles
          size={28}
          strokeWidth={2.3}
        />

        <span>
          AI Job Assistant
        </span>
      </Link>

      {/* ================================================================
          NAVIGATION LINKS
          ================================================================ */}

      <div
        style={{
          display: "flex",

          alignItems: "center",

          gap: "8px",

          fontWeight: 500,
        }}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              color: darkMode
                ? "#e2e8f0"
                : "#334155",

              textDecoration: "none",

              padding:
                "9px 14px",

              borderRadius: "9px",

              fontSize: "15px",

              transition:
                "background 0.2s ease, color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                darkMode
                  ? "rgba(255,255,255,0.08)"
                  : "#f1f5f9";

              e.currentTarget.style.color =
                darkMode
                  ? "#ffffff"
                  : "#2563eb";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "transparent";

              e.currentTarget.style.color =
                darkMode
                  ? "#e2e8f0"
                  : "#334155";
            }}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}