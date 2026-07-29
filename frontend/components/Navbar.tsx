import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Navbar() {
  return (
    <nav
      style={{
        background: "#fff",
        padding: "18px 40px",
        borderBottom: "1px solid #e2e8f0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontWeight: 700,
          fontSize: 24,
          color: "#2563eb",
        }}
      >
        <Sparkles size={28} />
        AI Job Assistant
      </div>

      <div
        style={{
          display: "flex",
          gap: 24,
          fontWeight: 500,
        }}
      >
        <Link href="/">Dashboard</Link>
        <Link href="/resume-converter">Resume</Link>
        <Link href="/ats-score">ATS Score</Link>
        <Link href="/jobs">Jobs</Link>
      </div>
    </nav>
  );
}