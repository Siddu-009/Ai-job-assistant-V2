import { useEffect, useState } from "react";

import Layout from "../components/Layout";
import Loader from "../components/ui/Loader";
import { useTheme } from "../context/ThemeContext";

import AnalyticsCard from "../components/analytics/AnalyticsCard";
import WeeklyPerformance from "../components/analytics/WeeklyPerformance";
import ProfileScore from "../components/analytics/ProfileScore";
import ATSProgress from "../components/analytics/ATSProgress";
import WeeklyGoals from "../components/analytics/WeeklyGoals";
import CareerRecommendations from "../components/analytics/CareerRecommendations";

import AiSuggestions from "../components/dashboard/AiSuggestions";
import CareerRoadmap from "../components/dashboard/CareerRoadmap";
import UpcomingInterviews from "../components/dashboard/UpcomingInterviews";
import AiInsights from "../components/dashboard/AiInsights";

import { getAnalytics } from "../services/analytics";

export default function Analytics() {
  const { colors } = useTheme();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      console.log("getAnalytics()", getAnalytics);

      const response = await getAnalytics();

      setData(response.data);
    } catch (error) {
      console.log("========== AXIOS DEBUG ==========");

      console.log("Base URL:", error.config?.baseURL);
      console.log("URL:", error.config?.url);
      console.log(
        "Full URI:",
        error.config?.baseURL + error.config?.url
      );

      console.log("================================");

      console.error("Analytics Error:", error);

      alert("Unable to load analytics.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <main
        style={{
          width: "100%",
          minHeight: "100vh",
          padding: "30px",

          backgroundColor: colors.background,
          color: colors.text,

          transition:
            "background-color 0.3s ease, color 0.3s ease",
        }}
      >
        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <header
          style={{
            marginBottom: "30px",
          }}
        >
          <h1
            style={{
              marginBottom: "10px",

              color: colors.text,

              fontSize: "28px",
              fontWeight: 700,

              transition: "color 0.3s ease",
            }}
          >
            Analytics Dashboard
          </h1>

          <p
            style={{
              color: colors.subText,

              fontSize: "14px",
              lineHeight: 1.6,

              transition: "color 0.3s ease",
            }}
          >
            Track your resume performance and job search analytics.
          </p>
        </header>

        {/* =================================================
            LOADING STATE
        ================================================= */}

        {loading && (
          <div
            style={{
              color: colors.text,
              backgroundColor: colors.card,

              border: colors.borderStyle,
              borderRadius: "16px",

              padding: "30px",

              transition:
                "background-color 0.3s ease, color 0.3s ease",
            }}
          >
            <Loader text="Loading Analytics Dashboard..." />
          </div>
        )}

        {/* =================================================
            ANALYTICS CONTENT
        ================================================= */}

        {!loading && data && (
          <>
            {/* =================================================
                TOP ANALYTICS CARDS
            ================================================= */}

            <section
              style={{
                display: "grid",

                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",

                gap: "20px",

                marginBottom: "30px",
              }}
            >
              <AnalyticsCard
                title="Uploaded Resumes"
                value={data.uploaded_resumes || 0}
                color="#2563eb"
              />

              <AnalyticsCard
                title="Generated Resumes"
                value={data.generated_resumes || 0}
                color="#16a34a"
              />

              <AnalyticsCard
                title="Saved Jobs"
                value={data.saved_jobs || 0}
                color="#f59e0b"
              />

              <AnalyticsCard
                title="Applications"
                value={data.applications || 0}
                color="#7c3aed"
              />
            </section>

            {/* =================================================
                WEEKLY PERFORMANCE + PROFILE SCORE
            ================================================= */}

            <section
              style={{
                display: "grid",

                gridTemplateColumns:
                  "repeat(auto-fit, minmax(350px, 1fr))",

                gap: "25px",

                marginBottom: "30px",
              }}
            >
              <WeeklyPerformance data={data} />

              <ProfileScore data={data} />
            </section>

            {/* =================================================
                ATS PROGRESS + AI INSIGHTS
            ================================================= */}

            <section
              style={{
                display: "grid",

                gridTemplateColumns:
                  "repeat(auto-fit, minmax(350px, 1fr))",

                gap: "25px",

                marginBottom: "30px",
              }}
            >
              <ATSProgress data={data} />

              <AiInsights />
            </section>

            {/* =================================================
                WEEKLY GOALS
            ================================================= */}

            <section
              style={{
                marginBottom: "30px",
              }}
            >
              <WeeklyGoals data={data} />
            </section>

            {/* =================================================
                AI SUGGESTIONS + CAREER ROADMAP
            ================================================= */}

            <section
              style={{
                display: "grid",

                gridTemplateColumns:
                  "repeat(auto-fit, minmax(350px, 1fr))",

                gap: "25px",

                marginBottom: "30px",
              }}
            >
              <AiSuggestions />

              <CareerRoadmap />
            </section>

            {/* =================================================
                UPCOMING INTERVIEWS
            ================================================= */}

            <section
              style={{
                marginBottom: "30px",
              }}
            >
              <UpcomingInterviews />
            </section>

            {/* =================================================
                CAREER RECOMMENDATIONS
            ================================================= */}

            <section
              style={{
                marginBottom: "30px",
              }}
            >
              <CareerRecommendations data={data} />
            </section>
          </>
        )}

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {!loading && !data && (
          <div
            style={{
              padding: "30px",

              backgroundColor: colors.card,
              color: colors.text,

              border: colors.borderStyle,
              borderRadius: "16px",

              textAlign: "center",
            }}
          >
            No analytics data available.
          </div>
        )}
      </main>
    </Layout>
  );
}