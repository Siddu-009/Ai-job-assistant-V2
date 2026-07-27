import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ResumeToolCard from "../components/analytics/resume/ResumeToolCard";
import { getResumeList } from "../services/resume";
import { generateDocument } from "../services/documentGenerator";

const tools = [
  {
    title: "Upload Resume",
    description: "Upload your latest resume and keep it ready for ATS analysis.",
    icon: "📤",
    href: "/upload",
  },
  {
    title: "Resume Builder",
    description: "Create a professional ATS-friendly resume from scratch.",
    icon: "📝",
    href: "/resume-builder",
  },
  {
    title: "Resume Tailoring",
    description: "Tailor your resume according to a specific job description.",
    icon: "🎯",
    href: "/resume-tailoring",
  },
  {
    title: "Resume Enhancer",
    description: "Improve your resume using AI-powered suggestions.",
    icon: "✨",
    href: "/resume-enhancer",
  },
  {
    title: "Resume Compare",
    description: "Compare two resumes and identify improvements.",
    icon: "📊",
    href: "/resume-compare",
  },
  {
    title: "Resume Versions",
    description: "Manage and switch between different resume versions.",
    icon: "📁",
    href: "/resume-versions",
  },
  {
    title: "Resume History",
    description: "View previously uploaded and generated resumes.",
    icon: "🕒",
    href: "/resume-history",
  },
];

export default function ResumeCenterPage() {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const res = await getResumeList();

      if (res.data.success) {
        setResumes(res.data.resumes);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerate = async (documentType) => {
    if (!selectedResume) {
      alert("Please select a resume first.");
      return;
    }

    try {
      setLoading(true);

      const response = await generateDocument(
        selectedResume.id,
        documentType
      );

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${documentType}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      alert(`${documentType.replace(/_/g, " ")} generated successfully.`);
    } catch (err) {
      console.error(err);
      alert("Failed to generate document.");
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
        <h1 style={{ marginBottom: 10 }}>Resume Center</h1>

        <p
          style={{
            color: "#6b7280",
            marginBottom: 30,
          }}
        >
          Manage everything related to your resume from one place.
        </p>

        {selectedResume && (
          <div
            style={{
              background: "#ffffff",
              borderRadius: 10,
              padding: 25,
              marginBottom: 30,
              boxShadow: "0 2px 8px rgba(0,0,0,.08)",
            }}
          >
            <h2 style={{ marginBottom: 10 }}>
              ✅ Selected Resume
            </h2>

            <p
              style={{
                fontWeight: "bold",
                marginBottom: 25,
              }}
            >
              {selectedResume.filename}
            </p>

            <h3 style={{ marginBottom: 20 }}>
              🤖 AI Actions
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                gap: 20,
              }}
            >
              <button
                className="resume-action-btn"
                disabled={loading}
                onClick={() => handleGenerate("ats_resume")}
              >
                {loading ? "Generating..." : "📄 Generate ATS Resume"}
              </button>

              <button
                className="resume-action-btn"
                disabled={loading}
                onClick={() => handleGenerate("cover_letter")}
              >
                📨 Generate Cover Letter
              </button>

              <button
                className="resume-action-btn"
                disabled={loading}
                onClick={() => handleGenerate("ats_report")}
              >
                📊 Generate ATS Report
              </button>

              <button
                className="resume-action-btn"
                disabled={loading}
                onClick={() => handleGenerate("career_roadmap")}
              >
                🗺️ Career Roadmap
              </button>

              <button
                className="resume-action-btn"
                disabled={loading}
                onClick={() => handleGenerate("resume_enhancer")}
              >
                ✨ Resume Enhancer
              </button>

            </div>
          </div>
        )}

        <div
          style={{
            background: "#fff",
            borderRadius: 10,
            padding: 25,
            marginBottom: 40,
            boxShadow: "0 2px 8px rgba(0,0,0,.08)",
          }}
        >
          <h2 style={{ marginBottom: 20 }}>
            📂 My Uploaded Resumes
          </h2>

          {resumes.length === 0 ? (
            <p style={{ color: "#666" }}>
              No resumes uploaded yet.
            </p>
          ) : (
            resumes.map((resume) => (
              <div
                key={resume.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "15px",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  marginBottom: 15,
                }}
              >
                <div>
                  <strong>{resume.filename}</strong>
                  <br />
                  <small style={{ color: "#777" }}>
                    {resume.created_at}
                  </small>
                </div>

                <button
                  onClick={() => setSelectedResume(resume)}
                  style={{
                    background:
                      selectedResume?.id === resume.id
                        ? "#16a34a"
                        : "#2563eb",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "10px 18px",
                    cursor: "pointer",
                  }}
                >
                  {selectedResume?.id === resume.id
                    ? "Selected"
                    : "Select"}
                </button>
              </div>
            ))
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
            gap: "25px",
          }}
        >
          {tools.map((tool) => (
            <ResumeToolCard
              key={tool.title}
              title={tool.title}
              description={tool.description}
              icon={tool.icon}
              href={tool.href}
            />
          ))}
        </div>

        <style jsx>{`
          .resume-action-btn {
            background: #2563eb;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 15px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 600;
            transition: 0.3s;
          }

          .resume-action-btn:hover:not(:disabled) {
            background: #1d4ed8;
          }

          .resume-action-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `}</style>
      </div>
    </Layout>
  );
}