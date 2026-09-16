import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useTheme } from "../context/ThemeContext";

// ─── constants ────────────────────────────────────────────────────────────────

const STAT_CARDS = [
  { label: "ATS Score",     value: "92%", color: "#2563eb", note: "Excellent Resume"       },
  { label: "Applications",  value: "48",  color: "#22c55e", note: "Total Applications"     },
  { label: "Interviews",    value: "12",  color: "#f59e0b", note: "Upcoming Interviews"    },
  { label: "AI Score",      value: "98%", color: "#8b5cf6", note: "AI Optimization"        },
];

const RECENT_ACTIVITY = [
  "Resume uploaded successfully",
  "ATS Score improved to 92%",
  "5 New Jobs Matched",
  "Resume Tailored for DevOps Engineer",
  "Career Roadmap Generated",
];

const AI_SUGGESTIONS = [
  "Improve Docker Skills",
  "Add Kubernetes Project",
  "Upload Latest Resume",
  "Complete Profile",
];

// ─── sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, color, note, colors }) {
  return (
    <div
      style={{
        background:   colors.card,
        color:        colors.text,
        borderRadius: "18px",
        padding:      "24px",
        border:       colors.borderStyle,
        boxShadow:    "0 10px 25px rgba(0,0,0,0.08)",
      }}
    >
      <h3 style={{ margin: 0, color: colors.subText, fontSize: "14px", fontWeight: 600 }}>
        {label}
      </h3>
      <p style={{ marginTop: "15px", fontSize: "42px", fontWeight: 800, color, margin: "15px 0 0" }}>
        {value}
      </p>
      <p style={{ color: colors.subText, marginTop: "8px", fontSize: "13px" }}>
        {note}
      </p>
    </div>
  );
}

function RecentActivity({ colors }) {
  return (
    <div
      style={{
        background:   colors.card,
        border:       colors.borderStyle,
        borderRadius: "18px",
        padding:      "25px",
        color:        colors.text,
        boxShadow:    "0 10px 25px rgba(0,0,0,0.08)",
      }}
    >
      <h2 style={{ marginTop: 0 }}>Recent Activity</h2>

      <div style={{ marginTop: "10px" }}>
        {RECENT_ACTIVITY.map((item) => (
          <div
            key={item}
            style={{
              padding:        "16px 0",
              borderBottom:   colors.borderStyle,
              display:        "flex",
              justifyContent: "space-between",
              alignItems:     "center",
            }}
          >
            <span style={{ fontSize: "14px" }}>{item}</span>
            <span style={{ color: colors.subText, fontSize: "13px" }}>Today</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AISuggestions({ colors }) {
  return (
    <div
      style={{
        background:   colors.card,
        border:       colors.borderStyle,
        borderRadius: "18px",
        padding:      "22px",
        color:        colors.text,
        boxShadow:    "0 10px 25px rgba(0,0,0,0.08)",
      }}
    >
      <h3 style={{ marginTop: 0 }}>AI Suggestions</h3>
      <ul style={{ paddingLeft: "20px", color: colors.subText, lineHeight: "2", margin: 0 }}>
        {AI_SUGGESTIONS.map((s) => (
          <li key={s} style={{ fontSize: "14px" }}>{s}</li>
        ))}
      </ul>
    </div>
  );
}

function ResumeStrengthCard() {
  return (
    <div
      style={{
        background:   "linear-gradient(135deg, #2563eb, #7c3aed)",
        borderRadius: "18px",
        padding:      "25px",
        color:        "#ffffff",
      }}
    >
      <h2 style={{ marginTop: 0, fontSize: "18px" }}>Resume Strength</h2>
      <p style={{ fontSize: "55px", fontWeight: 800, margin: "15px 0", lineHeight: 1 }}>92%</p>
      <p style={{ fontSize: "14px", margin: 0, opacity: 0.9 }}>
        Your resume is highly optimized for DevOps Engineer roles.
      </p>
    </div>
  );
}

// ─── main Layout ──────────────────────────────────────────────────────────────

export default function Layout({
  children,
  onLogout,
  title    = "Dashboard",
  subtitle = "Welcome back to AI Job Assistant",
  dashboard = false
}) {

  const { colors, darkMode, toggleTheme } = useTheme();

  const [collapsed, setCollapsed] = useState(false);

  // Avoid SSR / hydration mismatch

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: colors.background }}>
      <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onLogout={onLogout}
      />

      <main
        style={{
          flex:          1,
          display:       "flex",
          flexDirection: "column",
          background:    colors.background,
          minWidth:      0, // prevents flex overflow
        }}
      >
        <Navbar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            title={title}
            subtitle={subtitle}
        />

        <div style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* ── Stat cards ── */}
          <div
            style={{
              display:             "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap:                 "20px",
            }}
          >
            {STAT_CARDS.map((card) => (
              <StatCard key={card.label} {...card} colors={colors} />
            ))}
          </div>

          {/* ── Activity + Sidebar widgets ── */}
          <div
            style={{
              display:             "grid",
              gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
              gap:                 "20px",
            }}
          >
            <RecentActivity colors={colors} />

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <AISuggestions   colors={colors} />
              <ResumeStrengthCard />
            </div>
          </div>

          {/* ── Page content (children) ── */}
	  {dashboard ? (

    	children && (

	  <div
	  style={{
	  background: colors.card,
	  border: colors.borderStyle,
	  borderRadius: "18px",
	  padding: "25px",
	  color: colors.text,
	  boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
	  }}
	  >

	  <h2 style={{marginTop:0}}>Workspace</h2>
      {children}
	  </div>

	  )

	  ) : (

	  children

	  )}

        </div>
      </main>
    </div>
  );
}
