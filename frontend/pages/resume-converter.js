import { useState } from "react";
import axios from "axios";

import Card from "../components/ui/Card";
import UploadBox from "../components/UploadBox";
import TemplateSelector from "../components/TemplateSelector";
import Loading from "../components/Loading";
import SuccessModal from "../components/SuccessModal";
import Layout from "../components/Layout";
import AIProgress from "../components/AIProgress";
import ATSScoreCard from "../components/ATSScoreCard";
import KeywordAnalysis from "../components/KeywordAnalysis";
import ResumeSections from "../components/ResumeSections";
import ResumeComparison from "../components/ResumeComparison";
import JobMatchCard from "../components/JobMatchCard";
import { useTheme } from "../context/ThemeContext";

export default function ResumeConverter() {
  const { colors, darkMode } = useTheme();

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [template, setTemplate] = useState("classic");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [comparison, setComparison] = useState(null);

  const cardShadow = darkMode
    ? "0 10px 25px rgba(0, 0, 0, 0.25)"
    : "0 10px 25px rgba(15, 23, 42, 0.06)";

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      window.location.href = "/login";
      return;
    }

    if (!resumeFile && resumeText.trim() === "") {
      alert("Upload a resume or paste resume text.");
      return;
    }

    const formData = new FormData();

    formData.append("token", token);

    if (resumeFile) {
      formData.append("resume_file", resumeFile);
    }

    formData.append("resume_text", resumeText);
    formData.append("job_description", jobDescription);
    formData.append("target_role", targetRole);
    formData.append("target_company", targetCompany);
    formData.append("template", template);

    try {
      setLoading(true);

      const response = await axios.post(
        "/api/resume-converter",
        formData,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const url = window.URL.createObjectURL(blob);

      setDownloadUrl(url);
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Resume conversion failed:", err);

      if (err.response) {
        console.error("Backend Response:", err.response.data);
      }

      alert("Resume conversion failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeFile && resumeText.trim() === "") {
      alert("Upload a resume or paste resume text.");
      return;
    }

    try {
      setAnalyzing(true);

      const formData = new FormData();

      if (resumeFile) {
        formData.append("resume_file", resumeFile);
      }

      formData.append("resume_text", resumeText);
      formData.append("job_description", jobDescription);
      formData.append("target_role", targetRole);
      formData.append("target_company", targetCompany);

      const response = await axios.post(
        "/api/resume-converter/analyze",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setAnalysis(response.data.analysis);
      console.log(response.data.analysis);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze resume.");
    } finally {
      setAnalyzing(false);
    }
  };

  const downloadResume = () => {
    if (!downloadUrl) {
      alert("Resume download is not available.");
      return;
    }

    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = "ATS_Resume.docx";

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(downloadUrl);

    setDownloadUrl("");
    setShowSuccessModal(false);
  };

  const atsBreakdown = analysis?.ats_breakdown || {};

  return (
    <Layout>
      {loading && <Loading />}

      <div
        className="resume-page"
        style={{
          backgroundColor: colors.background,
          color: colors.text,
          minHeight: "100vh",
          padding: "30px",
          transition:
            "background-color 0.3s ease, color 0.3s ease",
        }}
      >
        <Card
          title="AI Resume Converter"
          subtitle="Transform your resume into an ATS-optimized professional resume."
        >
          {/* RESUME UPLOAD */}
          <UploadBox onFileSelect={setResumeFile} />

          <div
            className="divider"
            style={{
              color: colors.subText,
              borderColor: colors.border,
            }}
          >
            <span>OR</span>
          </div>

          {/* RESUME TEXT */}
          <textarea
            rows={10}
            placeholder="Paste your resume here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            className="theme-input"
          />

          {/* JOB DESCRIPTION */}
          <div className="form-group">
            <label>Job Description</label>

            <textarea
              rows={8}
              placeholder="Paste the complete Job Description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="theme-input"
            />
          </div>

          {/* TARGET DETAILS */}
          <div className="two-column">
            <div>
              <label>Target Role</label>

              <input
                placeholder="Frontend Developer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="theme-input"
              />
            </div>

            <div>
              <label>Target Company</label>

              <input
                placeholder="Google"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                className="theme-input"
              />
            </div>
          </div>

          {/* ANALYSIS RESULTS */}
          {analysis && (
            <>
              <ATSScoreCard analysis={analysis} />

              {analysis?.strengths?.length > 0 && (
                <div className="analysis-card">
                  <h2>Strengths</h2>

                  <ul>
                    {analysis.strengths.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis?.weaknesses?.length > 0 && (
                <div className="analysis-card">
                  <h2>Areas to Improve</h2>

                  <ul>
                    {analysis.weaknesses.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis?.suggestions?.length > 0 && (
                <div className="analysis-card">
                  <h2>AI Suggestions</h2>

                  <ul>
                    {analysis.suggestions.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {/* JOB MATCH */}
          {analysis?.job_match && (
            <JobMatchCard jobMatch={analysis.job_match} />
          )}

          {/* MATCHED KEYWORDS */}
          {analysis?.job_match?.matched_keywords?.length > 0 && (
            <div className="analysis-card">
              <h2>Matched Keywords</h2>

              <div className="chips">
                {analysis.job_match.matched_keywords.map(
                  (skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="chip success"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>
          )}

          {/* MISSING KEYWORDS */}
          {analysis?.job_match?.missing_keywords?.length > 0 && (
            <div className="analysis-card">
              <h2>Missing Keywords</h2>

              <div className="chips">
                {analysis.job_match.missing_keywords.map(
                  (skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="chip danger"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>
          )}

          {/* KEYWORD ANALYSIS */}
          {analysis && (
            <KeywordAnalysis
              matched={analysis.job_match?.matched_keywords || []}
              missing={analysis.job_match?.missing_keywords || []}
              recommendation={analysis.suggestions || []}
            />
          )}

          {/* RESUME SECTIONS */}
          {analysis && (
            <ResumeSections
              sections={[
                {
                  name: "Summary",
                  status:
                    atsBreakdown.summary > 0
                      ? "Present"
                      : "Missing",
                  message:
                    atsBreakdown.summary > 0
                      ? "Professional summary found."
                      : "Professional summary missing.",
                },
                {
                  name: "Skills",
                  status:
                    atsBreakdown.skills > 0
                      ? "Present"
                      : "Missing",
                  message:
                    atsBreakdown.skills > 0
                      ? "Skills section found."
                      : "Skills section missing.",
                },
                {
                  name: "Experience",
                  status:
                    atsBreakdown.experience > 0
                      ? "Present"
                      : "Missing",
                  message:
                    atsBreakdown.experience > 0
                      ? "Experience section found."
                      : "Experience section missing.",
                },
                {
                  name: "Projects",
                  status:
                    atsBreakdown.projects > 0
                      ? "Present"
                      : "Missing",
                  message:
                    atsBreakdown.projects > 0
                      ? "Projects section found."
                      : "Projects section missing.",
                },
                {
                  name: "Education",
                  status:
                    atsBreakdown.education > 0
                      ? "Present"
                      : "Missing",
                  message:
                    atsBreakdown.education > 0
                      ? "Education section found."
                      : "Education section missing.",
                },
                {
                  name: "Certifications",
                  status:
                    atsBreakdown.certifications > 0
                      ? "Present"
                      : "Missing",
                  message:
                    atsBreakdown.certifications > 0
                      ? "Certifications found."
                      : "Certifications missing.",
                },
              ]}
            />
          )}

          {/* COMPARISON */}
          {comparison && (
            <ResumeComparison
              original={comparison.original}
              optimized={comparison.optimized}
            />
          )}

          {/* TEMPLATE SELECTOR */}
          <TemplateSelector
            value={template}
            onChange={setTemplate}
          />

          <AIProgress loading={loading} />

          {/* ACTION BUTTONS */}
          <div className="button-group">
            <button
              className="analyze-btn"
              onClick={handleAnalyze}
              disabled={analyzing}
            >
              {analyzing ? "Analyzing..." : "Analyze Resume"}
            </button>

            <button
              className="generate-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate ATS Resume"}
            </button>
          </div>
        </Card>
      </div>

      <SuccessModal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onDownload={downloadResume}
      />

      <style jsx>{`
        .resume-page {
          width: 100%;
          box-sizing: border-box;
        }

        .divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          margin: 25px 0;
          font-weight: 600;
        }

        .divider::before,
        .divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: ${colors.border};
        }

        .theme-input {
          width: 100%;
          box-sizing: border-box;
          padding: 14px;
          margin-top: 10px;
          margin-bottom: 20px;
          border: 1px solid ${colors.border};
          border-radius: 10px;
          background-color: ${colors.cardSecondary};
          color: ${colors.text};
          outline: none;
          resize: vertical;
          font-size: 15px;
          line-height: 1.6;
          transition: background-color 0.3s ease,
            color 0.3s ease, border-color 0.3s ease;
        }

        .theme-input::placeholder {
          color: ${colors.muted};
        }

        .theme-input:focus {
          border-color: ${colors.button};
        }

        .form-group {
          margin-top: 10px;
        }

        label {
          display: block;
          margin-top: 10px;
          margin-bottom: 5px;
          color: ${colors.text};
          font-weight: 600;
        }

        .two-column {
          display: grid;
          grid-template-columns: repeat(
            auto-fit,
            minmax(240px, 1fr)
          );
          gap: 20px;
        }

        .analysis-card {
          margin-top: 25px;
          padding: 22px;
          border: 1px solid ${colors.border};
          border-radius: 14px;
          background-color: ${colors.cardSecondary};
          color: ${colors.text};
          box-shadow: ${cardShadow};
          transition: background-color 0.3s ease,
            border-color 0.3s ease;
        }

        .analysis-card h2 {
          margin-top: 0;
          margin-bottom: 15px;
          color: ${colors.text};
          font-size: 19px;
        }

        .analysis-card ul {
          margin: 0;
          padding-left: 22px;
          color: ${colors.subText};
          line-height: 1.8;
        }

        .chips {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .chip {
          display: inline-block;
          padding: 8px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
        }

        .chip.success {
          background: ${colors.successBg};
          color: ${colors.successText};
        }

        .chip.danger {
          background: ${colors.dangerBg};
          color: ${colors.dangerText};
        }

        .button-group {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-top: 30px;
        }

        .analyze-btn,
        .generate-btn {
          flex: 1;
          min-width: 200px;
          border: none;
          border-radius: 10px;
          padding: 15px 20px;
          color: #ffffff;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease,
            transform 0.2s ease;
        }

        .analyze-btn {
          background: #7c3aed;
        }

        .analyze-btn:hover:not(:disabled) {
          background: #6d28d9;
          transform: translateY(-2px);
        }

        .generate-btn {
          background: ${colors.button};
        }

        .generate-btn:hover:not(:disabled) {
          background: ${colors.buttonHover};
          transform: translateY(-2px);
        }

        .analyze-btn:disabled,
        .generate-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 600px) {
          .resume-page {
            padding: 15px !important;
          }

          .button-group {
            flex-direction: column;
          }

          .analyze-btn,
          .generate-btn {
            width: 100%;
          }
        }
      `}</style>
    </Layout>
  );
}