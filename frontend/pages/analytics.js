import { useEffect, useState } from "react";

import Layout from "../components/Layout";
import Loader from "../components/ui/Loader";

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
    console.log("Full URI:", error.config?.baseURL + error.config?.url);
    console.log("================================");

    console.error(error);

    alert("Unable to load analytics.");
  } finally {
    setLoading(false);
  }
};

  return (
    <Layout>
      <div
        style={{
          padding: "30px",
          background: "#f5f7fb",
          minHeight: "100vh",
        }}
      >
        <h1 style={{ marginBottom: "10px" }}>
          Analytics Dashboard
        </h1>

        <p
          style={{
            color: "#6b7280",
            marginBottom: "30px",
          }}
        >
          Track your resume performance and job search analytics.
        </p>

        {loading && (
          <Loader text="Loading Analytics Dashboard..." />
        )}

        {data && (
          <>
            {/* Top Cards */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(220px,1fr))",
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
            </div>

            {/* Weekly Performance + Profile */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(350px,1fr))",
                gap: "25px",
                marginBottom: "30px",
              }}
            >
              <WeeklyPerformance data={data} />

              <ProfileScore data={data} />
            </div>

                        {/* ATS Progress + AI Insights */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(350px,1fr))",
                gap: "25px",
                marginBottom: "30px",
              }}
            >
              <ATSProgress data={data} />

              <AiInsights />
            </div>

            {/* Weekly Goals */}

            <WeeklyGoals data={data} />

            {/* AI Suggestions + Career Roadmap */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(350px,1fr))",
                gap: "25px",
                marginBottom: "30px",
              }}
            >
              <AiSuggestions />

              <CareerRoadmap />
            </div>

            {/* Upcoming Interviews */}

            <div
              style={{
                marginBottom: "30px",
              }}
            >
              <UpcomingInterviews />
            </div>

            {/* Career Recommendations */}

            <CareerRecommendations data={data} />
          </>
        )}
      </div>
    </Layout>
  );
}