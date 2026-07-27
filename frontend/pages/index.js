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
import AiSuggestions from "../components/dashboard/AiSuggestions";
import WeeklyProgress from "../components/dashboard/WeeklyProgress";
import CareerRoadmap from "../components/dashboard/CareerRoadmap";
import UpcomingInterviews from "../components/dashboard/UpcomingInterviews";
import AiInsights from "../components/dashboard/AiInsights";

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

      </div>
    </Layout>
  );
}
