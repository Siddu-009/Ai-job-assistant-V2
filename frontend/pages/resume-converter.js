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

export default function ResumeConverter() {

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

    const handleSubmit = async () => {

        const token = localStorage.getItem("token");

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
                    responseType: "blob"
                }
            );

            const blob = new Blob(
                [response.data],
                {
                    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                }
            );

            const url = window.URL.createObjectURL(blob);

            setDownloadUrl(url);

            setShowSuccessModal(true);

        }
        catch (err) {

            console.error("Resume conversion failed:", err);

            if (err.response) {
                console.error("Backend Response:", err.response.data);
            }

            alert("Resume conversion failed.");

        }
        finally {

            setLoading(false);

        }

    };

    const handleAnalyze = async () => {
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

        } catch (error) {
            console.error(error);
            alert("Failed to analyze resume.");
        } finally {
            setAnalyzing(false);
        }
    };

    const downloadResume = () => {

        const link = document.createElement("a");

        link.href = downloadUrl;

        link.download = "ATS_Resume.docx";

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.URL.revokeObjectURL(downloadUrl);

        setShowSuccessModal(false);

    };

    return (
    <Layout>

        {loading && <Loading />}

        <div className="resume-page">

            <Card
                title="AI Resume Converter"
                subtitle="Transform your resume into an ATS-optimized professional resume."
            >

                <UploadBox
                    onFileSelect={setResumeFile}
                />

                <div className="divider">
                    <span>OR</span>
                </div>

                <textarea
                    rows={10}
                    placeholder="Paste your resume here..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                />

                <div className="form-group">

                    <label>Job Description</label>

                    <textarea
                        rows={8}
                        placeholder="Paste the complete Job Description here..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                    />

                </div>

                <div className="two-column">

                    <div>
                        <label>Target Role</label>

                        <input
                            placeholder="Frontend Developer"
                            value={targetRole}
                            onChange={(e) => setTargetRole(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Target Company</label>

                        <input
                            placeholder="Google"
                            value={targetCompany}
                            onChange={(e) => setTargetCompany(e.target.value)}
                        />
                    </div>

                </div>

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

                {analysis?.job_match && (
                    <JobMatchCard
                        jobMatch={analysis.job_match}
                    />
                )}

                {analysis?.job_match?.matched_keywords?.length > 0 && (
                    <div className="analysis-card">
                        <h2>Matched Keywords</h2>

                        <div className="chips">
                            {analysis.job_match.matched_keywords.map((skill) => (
                                <span
                                    key={skill}
                                    className="chip success"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {analysis?.job_match?.missing_keywords?.length > 0 && (
                    <div className="analysis-card">
                        <h2>Missing Keywords</h2>

                        <div className="chips">
                            {analysis.job_match.missing_keywords.map((skill) => (
                                <span
                                    key={skill}
                                    className="chip danger"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {analysis && (

                    <KeywordAnalysis

                        matched={analysis.matchedKeywords}

                        missing={analysis.missingKeywords}

                        recommendation={analysis.recommendation}

                    />

                )}

                {analysis && (

                    <ResumeSections

                        sections={analysis.sections}

                    />

                )}

                {comparison && (

                    <ResumeComparison

                        original={comparison.original}

                        optimized={comparison.optimized}

                    />

                )}

                <TemplateSelector
                    value={template}
                    onChange={setTemplate}
                />

                <AIProgress loading={loading} />

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

    </Layout>
);}