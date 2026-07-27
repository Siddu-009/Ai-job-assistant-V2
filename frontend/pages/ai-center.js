import Layout from "../components/Layout";
import AIToolCard from "../components/ai/AIToolCard";

const tools = [
  {
    title: "ATS Analyzer",
    description: "Analyze your resume against ATS standards and improve your score.",
    icon: "📄",
    href: "/ats-checker",
  },
  {
    title: "Resume Enhancer",
    description: "Improve wording, formatting, and impact using AI suggestions.",
    icon: "✨",
    href: "/resume-enhancer",
  },
  {
    title: "Resume Tailoring",
    description: "Customize your resume for a specific job description.",
    icon: "🎯",
    href: "/resume-tailoring",
  },
  {
    title: "Cover Letter Generator",
    description: "Generate professional cover letters in seconds.",
    icon: "✉️",
    href: "/cover-letter",
  },
  {
    title: "Mock Interview",
    description: "Practice interview questions with AI feedback.",
    icon: "🎤",
    href: "/mock-interview",
  },
  {
    title: "Career Coach",
    description: "Receive AI-powered career guidance and recommendations.",
    icon: "🤖",
    href: "/career-coach",
  },
];

export default function AICenterPage() {
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
          AI Center
        </h1>

        <p
          style={{
            color: "#6b7280",
            marginBottom: 30,
          }}
        >
          Access all AI-powered tools from one place.
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
            <AIToolCard
              key={tool.title}
              {...tool}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}