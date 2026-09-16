import Layout from "../components/Layout";
import JobToolCard from "../components/jobs/JobToolCard";

const tools = [
  {
    title: "Live Jobs",
    description: "Browse the latest job opportunities matching your profile.",
    icon: "💼",
    href: "/jobs",
  },
  {
    title: "Saved Jobs",
    description: "View jobs you've saved for future applications.",
    icon: "⭐",
    href: "/saved-jobs",
  },
  {
    title: "Applications",
    description: "Track all of your submitted job applications.",
    icon: "📄",
    href: "/applications",
  },
  {
    title: "Job Tracker",
    description: "Monitor your application progress from applied to hired.",
    icon: "📈",
    href: "/job-tracker",
  },
  {
    title: "Job Alerts",
    description: "Manage personalized alerts for new job opportunities.",
    icon: "🔔",
    href: "/job-alerts",
  },
  {
    title: "Recommended Jobs",
    description: "Discover AI-powered job recommendations tailored to your skills.",
    icon: "🤖",
    href: "/recommended-jobs",
  },
];

export default function JobsCenterPage() {
  return (
    <Layout>
      <div
        style={{
          padding: 30,
          background: "#f5f7fb",
          minHeight: "100vh",
        }}
      >
        <h1 style={{ marginBottom: 10 }}>
          Jobs Center
        </h1>

        <p
          style={{
            color: colors.subText,
            marginBottom: 30,
          }}
        >
          Explore, save, and track all your job opportunities from one place.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(320px,1fr))",
            gap: 25,
          }}
        >
          {tools.map((tool) => (
            <JobToolCard
              key={tool.title}
              {...tool}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}