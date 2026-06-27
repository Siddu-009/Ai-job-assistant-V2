import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  FileText,
  Award,
  TrendingUp,
  CalendarCheck,
  CircleCheckBig,
} from "lucide-react";

// ─── constants ────────────────────────────────────────────────────────────────

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEKLY_VALUES = [45, 72, 54, 81, 65, 90, 78];

const RESUME_SECTIONS = [
  { label: "Personal Details", value: 100 },
  { label: "Education",        value: 100 },
  { label: "Projects",         value: 95  },
  { label: "Skills",           value: 92  },
  { label: "Certifications",   value: 80  },
];

const AI_SUGGESTIONS = [
  "Improve Kubernetes skills",
  "Add one Terraform project",
  "Upload updated resume",
  "Increase ATS keywords",
  "Apply for 15 more jobs",
  "Generate AI Cover Letter",
];

const DEFAULT_STATS = {
  ats:          0,
  resumes:      0,
  jobs:         0,
  applications: 0,
  interviews:   0,
  selected:     0,
};

// ─── helpers ──────────────────────────────────────────────────────────────────

function buildColors(darkMode) {
  return {
    text:    darkMode ? "#ffffff"  : "#111827",
    sub:     darkMode ? "#94a3b8"  : "#64748b",
    card:    darkMode ? "#0f172a"  : "#ffffff",
    trackBg: darkMode ? "#1e293b"  : "#e5e7eb",
    inputBg: darkMode ? "#1e293b"  : "#f8fafc",
    circleBg: darkMode ? "#0f172a" : "#ffffff",
  };
}

// ─── sub-components ───────────────────────────────────────────────────────────

function StatCard({ icon, color, title, value, subtitle, cardStyle }) {
  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div
          style={{
            width:           "62px",
            height:          "62px",
            borderRadius:    "16px",
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            background:      `${color}20`,
            color,
          }}
        >
          {icon}
        </div>
        <span style={{ color: "#22c55e", fontWeight: 700, fontSize: "14px" }}>↑ 12%</span>
      </div>

      <h3 style={{ marginTop: "22px", marginBottom: "6px", fontWeight: 600, fontSize: "15px" }}>
        {title}
      </h3>
      <p style={{ margin: 0, color, fontSize: "42px", fontWeight: 800, lineHeight: 1 }}>
        {value}
      </p>
      <p style={{ marginTop: "10px", opacity: 0.7, fontSize: "14px" }}>{subtitle}</p>
    </div>
  );
}

function WeeklyProgress({ cardStyle, subColor }) {
  return (
    <div style={cardStyle}>
      <h2 style={{ marginTop: 0 }}>Weekly Progress</h2>
      <div
        style={{
          display:         "flex",
          alignItems:      "flex-end",
          justifyContent:  "space-between",
          marginTop:       "35px",
          height:          "220px",
        }}
      >
        {WEEKLY_VALUES.map((v, i) => (
          <div
            key={DAYS[i]}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}
          >
            <div
              style={{
                width:        "34px",
                height:       `${v * 2}px`,
                borderRadius: "10px",
                background:   "linear-gradient(180deg, #2563eb, #7c3aed)",
              }}
            />
            <span style={{ fontSize: "12px", color: subColor }}>{DAYS[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AtsDonut({ ats, cardStyle, subColor, circleBg }) {
  return (
    <div style={{ ...cardStyle, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div
        role="img"
        aria-label={`ATS Score: ${ats}%`}
        style={{
          width:        "180px",
          height:       "180px",
          borderRadius: "50%",
          background:   `conic-gradient(#2563eb ${ats * 3.6}deg, #e5e7eb 0deg)`,
          display:      "flex",
          alignItems:   "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width:           "140px",
            height:          "140px",
            borderRadius:    "50%",
            background:      circleBg,
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            flexDirection:   "column",
          }}
        >
          <p style={{ margin: 0, color: "#2563eb", fontSize: "42px", fontWeight: 800, lineHeight: 1 }}>
            {ats}%
          </p>
          <span style={{ color: subColor, fontSize: "13px", marginTop: "4px" }}>ATS Score</span>
        </div>
      </div>

      <p style={{ marginTop: "25px", textAlign: "center", color: subColor, fontSize: "14px" }}>
        Your resume is optimized for DevOps Engineer positions.
      </p>
    </div>
  );
}

function ResumeCompletion({ cardStyle, trackBg }) {
  return (
    <div style={cardStyle}>
      <h2 style={{ marginTop: 0 }}>Resume Completion</h2>
      <div style={{ marginTop: "30px" }}>
        {RESUME_SECTIONS.map((item) => (
          <div key={item.label} style={{ marginBottom: "22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" }}>
              <span>{item.label}</span>
              <span>{item.value}%</span>
            </div>
            <div style={{ width: "100%", height: "10px", borderRadius: "10px", background: trackBg }}>
              <div
                style={{
                  width:        `${item.value}%`,
                  height:       "10px",
                  borderRadius: "10px",
                  background:   "linear-gradient(90deg, #2563eb, #7c3aed)",
                  transition:   "width 0.4s ease",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AiSuggestions({ cardStyle, inputBg }) {
  return (
    <div style={cardStyle}>
      <h2 style={{ marginTop: 0 }}>AI Suggestions</h2>
      <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {AI_SUGGESTIONS.map((item) => (
          <div
            key={item}
            style={{
              padding:      "14px 16px",
              borderRadius: "14px",
              background:   inputBg,
              fontSize:     "14px",
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function DashboardCards() {
  const [darkMode, setDarkMode] = useState(false);
  const [stats,    setStats]    = useState(DEFAULT_STATS);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    setDarkMode(localStorage.getItem("theme") === "dark");

    const onStorage = (e) => {
      if (e.key === "theme") setDarkMode(e.newValue === "dark");
    };
    const onCustom = () => setDarkMode(localStorage.getItem("theme") === "dark");

    window.addEventListener("storage",     onStorage);
    window.addEventListener("themechange", onCustom);

    // ── fetch dashboard data ──────────────────────────────────────────────
    const token = localStorage.getItem("token");

    if (!token) {
      // No token — use sensible fallback values (demo mode)
      setStats({ ats: 92, resumes: 1, jobs: 0, applications: 0, interviews: 0, selected: 0 });
      setLoading(false);
      return;
    }

    Promise.all([
      fetch(`/dashboard/${token}`).then((r) => {
        if (!r.ok) throw new Error("dashboard fetch failed");
        return r.json();
      }),
      fetch(`/ats-score/${token}`).then((r) => r.json()).catch(() => ({})),
      fetch(`/recommend-jobs/${token}`).then((r) => r.json()).catch(() => []),
    ])
      .then(([dashboard, ats, jobs]) => {
        setStats({
          ats:          ats.score              ?? 92,
          resumes:      dashboard.resume_count  ?? 1,
          jobs:         Array.isArray(jobs) ? jobs.length : 0,
          applications: dashboard.applications  ?? 0,
          interviews:   dashboard.interviews    ?? 0,
          selected:     dashboard.selected      ?? 0,
        });
      })
      .catch((err) => {
        console.error("DashboardCards fetch error:", err);
        setError("Failed to load dashboard data.");
      })
      .finally(() => setLoading(false));

    return () => {
      window.removeEventListener("storage",     onStorage);
      window.removeEventListener("themechange", onCustom);
    };
  }, []);

  const c = buildColors(darkMode);

  const cardStyle = {
    background:   c.card,
    color:        c.text,
    borderRadius: "18px",
    padding:      "25px",
    boxShadow:    "0 10px 25px rgba(0,0,0,0.08)",
  };

  const STAT_CARDS = [
    { icon: <Award            size={34} />, color: "#2563eb", title: "ATS Score",     value: `${stats.ats}%`,     subtitle: "Resume Quality"   },
    { icon: <FileText         size={34} />, color: "#22c55e", title: "Resumes",       value: stats.resumes,       subtitle: "Stored"           },
    { icon: <BriefcaseBusiness size={34}/>, color: "#8b5cf6", title: "Matched Jobs",  value: stats.jobs,          subtitle: "Available"        },
    { icon: <TrendingUp       size={34} />, color: "#f59e0b", title: "Applications",  value: stats.applications,  subtitle: "Submitted"        },
    { icon: <CalendarCheck    size={34} />, color: "#06b6d4", title: "Interviews",    value: stats.interviews,    subtitle: "Scheduled"        },
    { icon: <CircleCheckBig   size={34} />, color: "#16a34a", title: "Selected",      value: stats.selected,      subtitle: "Offers"           },
  ];

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: c.sub }}>
        Loading dashboard…
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#ef4444" }}>
        {error}
      </div>
    );
  }

  return (
    // FIXED: React requires a single root element. The original returned
    // multiple sibling <div>s at the top level, which is a JSX syntax error.
    <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>

      {/* ── Stat cards ── */}
      <div
        style={{
          display:             "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap:                 "22px",
        }}
      >
        {STAT_CARDS.map((card) => (
          <StatCard key={card.title} {...card} cardStyle={cardStyle} />
        ))}
      </div>

      {/* ── Weekly progress + ATS donut ── */}
      <div
        style={{
          display:             "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
          gap:                 "25px",
        }}
      >
        <WeeklyProgress cardStyle={cardStyle} subColor={c.sub} />
        <AtsDonut ats={stats.ats} cardStyle={cardStyle} subColor={c.sub} circleBg={c.circleBg} />
      </div>

      {/* ── Resume completion + AI suggestions ── */}
      <div
        style={{
          display:             "grid",
          gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)",
          gap:                 "25px",
        }}
      >
        <ResumeCompletion cardStyle={cardStyle} trackBg={c.trackBg} />
        <AiSuggestions    cardStyle={cardStyle} inputBg={c.inputBg} />
      </div>

    </div>
  );
}
