import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ResumeToolCard from "../components/analytics/resume/ResumeToolCard";
import { getResumeList } from "../services/resume";
import { generateDocument } from "../services/documentGenerator";
import { useTheme } from "../context/ThemeContext";

const tools = [
  {
    title: "Upload Resume",
    description:
      "Upload your latest resume and keep it ready for ATS analysis.",
    icon: "📤",
    href: "/upload",
  },
  {
    title: "Resume Builder",
    description:
      "Create a professional ATS-friendly resume from scratch.",
    icon: "📝",
    href: "/resume-builder",
  },
  {
    title: "Resume Tailoring",
    description:
      "Tailor your resume according to a specific job description.",
    icon: "🎯",
    href: "/resume-tailoring",
  },
  {
    title: "Resume Enhancer",
    description:
      "Improve your resume using AI-powered suggestions.",
    icon: "✨",
    href: "/resume-enhancer",
  },
  {
    title: "Resume Compare",
    description:
      "Compare two resumes and identify improvements.",
    icon: "📊",
    href: "/resume-compare",
  },
  {
    title: "Resume Versions",
    description:
      "Manage and switch between different resume versions.",
    icon: "📁",
    href: "/resume-versions",
  },
  {
    title: "Resume History",
    description:
      "View previously uploaded and generated resumes.",
    icon: "🕒",
    href: "/resume-history",
  },
];

export default function ResumeCenterPage() {
  const { colors, darkMode } = useTheme();

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
        setResumes(res.data.resumes || []);
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

      alert(
        `${documentType.replace(/_/g, " ")} generated successfully.`
      );
    } catch (err) {
      console.error(err);
      alert("Failed to generate document.");
    } finally {
      setLoading(false);
    }
  };

  const cardShadow = darkMode
    ? "0 10px 25px rgba(0, 0, 0, 0.25)"
    : "0 10px 25px rgba(15, 23, 42, 0.06)";

  return (
    <Layout>
      <div
        style={{
          padding: "30px",
          backgroundColor: colors.background,
          color: colors.text,
          minHeight: "100vh",
          transition:
            "background-color 0.3s ease, color 0.3s ease",
        }}
      >
        {/* PAGE HEADER */}
        <h1
          style={{
            marginTop: 0,
            marginBottom: "10px",
            color: colors.text,
            fontSize: "30px",
            fontWeight: 700,
          }}
        >
          Resume Center
        </h1>

        <p
          style={{
            color: colors.subText,
            marginBottom: "30px",
            lineHeight: 1.6,
          }}
        >
          Manage everything related to your resume from one place.
        </p>

        {/* SELECTED RESUME AND AI ACTIONS */}
        {selectedResume && (
          <div
            style={{
              backgroundColor: colors.card,
              color: colors.text,
              border: `1px solid ${colors.border}`,
              borderRadius: "16px",
              padding: "25px",
              marginBottom: "30px",
              boxShadow: cardShadow,
              transition:
                "background-color 0.3s ease, border-color 0.3s ease",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: "10px",
                color: colors.text,
                fontSize: "21px",
              }}
            >
              ✅ Selected Resume
            </h2>

            <p
              style={{
                fontWeight: "bold",
                color: colors.text,
                marginBottom: "25px",
              }}
            >
              {selectedResume.filename}
            </p>

            <h3
              style={{
                marginBottom: "20px",
                color: colors.text,
                fontSize: "17px",
              }}
            >
              🤖 AI Actions
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "20px",
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

        {/* UPLOADED RESUMES */}
        <div
          style={{
            backgroundColor: colors.card,
            color: colors.text,
            border: `1px solid ${colors.border}`,
            borderRadius: "16px",
            padding: "25px",
            marginBottom: "40px",
            boxShadow: cardShadow,
            transition:
              "background-color 0.3s ease, border-color 0.3s ease",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: "20px",
              color: colors.text,
              fontSize: "21px",
            }}
          >
            📂 My Uploaded Resumes
          </h2>

          {resumes.length === 0 ? (
            <p
              style={{
                color: colors.subText,
                marginBottom: 0,
              }}
            >
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
                  gap: "15px",
                  padding: "15px",
                  border: `1px solid ${colors.border}`,
                  borderRadius: "10px",
                  marginBottom: "15px",
                  backgroundColor: colors.cardSecondary,
                  transition:
                    "background-color 0.3s ease, border-color 0.3s ease",
                }}
              >
                <div
                  style={{
                    minWidth: 0,
                    overflowWrap: "anywhere",
                  }}
                >
                  <strong
                    style={{
                      color: colors.text,
                    }}
                  >
                    {resume.filename}
                  </strong>

                  <br />

                  <small
                    style={{
                      color: colors.subText,
                    }}
                  >
                    {resume.created_at}
                  </small>
                </div>

                <button
                  onClick={() => setSelectedResume(resume)}
                  style={{
                    backgroundColor:
                      selectedResume?.id === resume.id
                        ? "#16a34a"
                        : colors.button,
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 18px",
                    cursor: "pointer",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
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

        {/* RESUME TOOLS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(320px, 1fr))",
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

        {/* ACTION BUTTON STYLES */}
        <style jsx>{`
          .resume-action-btn {
            background: ${colors.button};
            color: #ffffff;
            border: none;
            border-radius: 10px;
            padding: 15px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 600;
            transition: background-color 0.3s ease,
              transform 0.2s ease;
          }

          .resume-action-btn:hover:not(:disabled) {
            background: ${colors.buttonHover};
            transform: translateY(-2px);
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