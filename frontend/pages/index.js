import Layout           from "../components/Layout";
import WelcomeBanner    from "../components/dashboard/WelcomeBanner";
import Statistics       from "../components/dashboard/Statistics";
import RecentActivity   from "../components/dashboard/RecentActivity";
import ProfileStrength  from "../components/dashboard/ProfileStrength";
import DashboardCards   from "../components/DashboardCards";
import ATSScore         from "../components/ATSScore";
import ResumeCenter     from "../components/ResumeCenter";
import RecommendedJobs  from "../components/RecommendedJobs";
import SavedJobs        from "../components/SavedJobs";
import Applications     from "../components/Applications";
import { useTheme }     from "../context/ThemeContext";

// ─── static data ──────────────────────────────────────────────────────────────

const AI_SUGGESTIONS = [
  "Improve your ATS score by adding Kubernetes projects.",
  "Add Terraform and Helm certifications.",
  "Tailor your resume before every application.",
  "Complete your profile to reach 100%.",
  "Practice today's AI mock interview.",
];

const AI_INSIGHTS = [
  "🚀 Your ATS score increased by 8% this week.",
  "💼 14 new DevOps jobs match your profile.",
  "📄 Resume tailoring can improve interview chances.",
  "🎯 Complete AWS certification for higher job matches.",
  "🤖 Practice one mock interview today.",
];

const WEEKLY_PROGRESS = [
  { label: "Resume Improvement", value: 90 },
  { label: "Job Applications",   value: 70 },
  { label: "Skill Learning",     value: 60 },
  { label: "Mock Interviews",    value: 45 },
];

const ROADMAP = [
  { done: true,  label: "Learn Linux Administration"  },
  { done: true,  label: "Master Docker"               },
  { done: true,  label: "Learn Kubernetes"            },
  { done: false, label: "Complete Terraform"          },
  { done: false, label: "AWS Solutions Architect"     },
  { done: false, label: "Build 5 Production Projects" },
];

const INTERVIEWS = [
  { date: "30 June", company: "Infosys",   type: "Technical Round" },
  { date: "02 July", company: "TCS",       type: "HR Interview"    },
  { date: "05 July", company: "Capgemini", type: "Coding Test"     },
];

// ─── sub-components ───────────────────────────────────────────────────────────

function AiSuggestions() {
  const { colors } = useTheme();
  return (
    <div 
    style={{
      background: colors.card,
      color: colors.text,
      border: colors.borderStyle,
      padding: "25px",
      borderRadius: "18px",
      boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
    }}>
      <h2 style={{ marginTop: 0 }}>AI Suggestions</h2>
      <ul style={{ marginTop: "16px", lineHeight: 2, paddingLeft: "20px" }}>
        {AI_SUGGESTIONS.map((s) => <li key={s} style={{ fontSize: "14px" }}>{s}</li>)}
      </ul>
    </div>
  );
}

function WeeklyProgress() {
  const { colors, darkMode } = useTheme();
  return (
    <div 
    style={{
      background: colors.card,
      color: colors.text,
      border: colors.borderStyle,
      padding: "25px",
      borderRadius: "18px",
      boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
    }}>
      <h2 style={{ marginTop: 0 }}>Weekly Progress</h2>
      <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {WEEKLY_PROGRESS.map(({ label, value }) => (
          <div key={label}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" }}>
              <span>{label}</span>
              <span style={{ fontWeight: 600 }}>{value}%</span>
            </div>
            {/* FIXED: native <progress> has inconsistent cross-browser styling and
                can't be themed to match the design system. Replaced with a
                custom bar that matches the rest of the codebase. */}
            <div style={{ width: "100%", height: "10px", borderRadius: "10px", background: darkMode ? "#334155" : "#e5e7eb" }}>
              <div
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={label}
                style={{
                  width:        `${value}%`,
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

function CareerRoadmap() {
  const { colors } = useTheme();
  return (
    <div 
    style={{
      background: colors.card,
      color: colors.text,
      border: colors.borderStyle,
      padding: "25px",
      borderRadius: "18px",
      boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
    }}>
      <h2 style={{ marginTop: 0 }}>Career Roadmap</h2>
      <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {ROADMAP.map(({ done, label }) => (
          <div
            key={label}
            style={{
              display:    "flex",
              alignItems: "center",
              gap:        "10px",
              fontSize:   "14px",
              color: done ? colors.text : colors.subText,
            }}
          >
            <span aria-hidden="true">{done ? "✅" : "⏳"}</span>
            <span style={{ textDecoration: done ? "none" : "none" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function UpcomingInterviews() {
  const { colors, darkMode } = useTheme();
  return (
    <div 
    style={{
      background: colors.card,
      color: colors.text,
      border: colors.borderStyle,
      padding: "25px",
      borderRadius: "18px",
      boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
    }}>
      <h2 style={{ marginTop: 0 }}>Upcoming Interviews</h2>
      <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
        {INTERVIEWS.map(({ date, company, type }) => (
          <div
            key={`${company}-${date}`}
            style={{
              display:      "flex",
              alignItems:   "center",
              gap:          "12px",
              padding:      "12px 16px",
              borderRadius: "12px",
              background: darkMode ? "#1e293b" : "#f8fafc",
              fontSize:     "14px",
            }}
          >
            <span aria-hidden="true">📅</span>
            <div>
              <span style={{ fontWeight: 600 }}>{company}</span>
              <span style={{ color: colors.subText }}> — {date} — {type}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AiInsights() {
  const { colors } = useTheme();
  return (
    <div
      style={{
        background: colors.card,
        color: colors.text,
        border: colors.borderStyle,
        padding: "25px",
        borderRadius: "18px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
        marginBottom: 0,
      }}
    >
      <h2 style={{ marginTop: 0 }}>Latest AI Insights</h2>
      <ul style={{ marginTop: "16px", lineHeight: 2, paddingLeft: "20px" }}>
        {AI_INSIGHTS.map((s) => <li key={s} style={{ fontSize: "14px" }}>{s}</li>)}
      </ul>
    </div>
  );
}

// ─── two-column grid helper ───────────────────────────────────────────────────

function TwoCol({ children, style }) {
  return (
    <div
      style={{
        display:             "grid",
        // FIXED: "1fr 1fr" and "2fr 1fr" grids had no minmax(), causing
        // overflow on narrow screens. Added minmax(0, ...) on all columns.
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
        gap:                 "25px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {

  return (
    <Layout dashboard={true}>
      {/* FIXED: padding & background on the inner wrapper duplicated what
          Layout already provides. Kept a single wrapper just for the gap
          between sections; Layout owns the outer background. */}
      <div
        style={{
          display:       "flex",
          flexDirection: "column",
          gap:           "28px",
        }}
      >
        <WelcomeBanner />

        <Statistics />

        {/* Recent activity + profile strength */}
        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
            gap:                 "25px",
          }}
        >
          <RecentActivity />
          <ProfileStrength />
        </div>

        <DashboardCards />

        {/* ATS + Resume Center */}
        <TwoCol>
          <ATSScore />
          <ResumeCenter />
        </TwoCol>

        {/* Recommended jobs (full width) */}
        {/* FIXED: wrapping a single component in a 1-column grid is
            pointless — removed the unnecessary grid wrapper. */}
        <RecommendedJobs />

        {/* Saved jobs + Applications */}
        <TwoCol>
          <SavedJobs />
          <Applications />
        </TwoCol>

        {/* AI Suggestions + Weekly Progress */}
        <TwoCol>
          <AiSuggestions />
          <WeeklyProgress />
        </TwoCol>

        {/* Career Roadmap + Upcoming Interviews */}
        <TwoCol>
          <CareerRoadmap />
          <UpcomingInterviews />
        </TwoCol>

        {/* AI Insights — full width */}
        <AiInsights />
      </div>
    </Layout>
  );
}
