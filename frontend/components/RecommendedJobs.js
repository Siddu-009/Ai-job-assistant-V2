
import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "./ui/Button";
import Loader from "./ui/Loader";
import { useTheme } from "../context/ThemeContext";

export default function RecommendedJobs() {
  const { colors } = useTheme();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatedResume, setGeneratedResume] = useState("");
  const [processingJobId, setProcessingJobId] = useState(null);
  const [savingJobId, setSavingJobId] = useState(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  };

  const loadJobs = async () => {
    try {
      setLoading(true);

      const token = getToken();

      if (!token) {
        alert("Please login to view recommended jobs.");
        setJobs([]);
        return;
      }

      const response = await fetch("/api/recommend-jobs/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Recommendation API error:", data);
        alert(data.detail || "Unable to load recommended jobs.");
        setJobs([]);
        return;
      }

      setJobs(
        Array.isArray(data.recommended_jobs)
          ? data.recommended_jobs
          : []
      );
    } catch (error) {
      console.error("Load jobs error:", error);
      alert("Unable to load recommended jobs.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const saveJob = async (jobId) => {
    if (!jobId) {
      alert("Job ID is missing.");
      return;
    }

    try {
      setSavingJobId(jobId);

      const token = getToken();

      if (!token) {
        alert("Please login first.");
        return;
      }

      const response = await fetch("/api/saved-jobs/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          job_id: jobId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || data.message || "Unable to save the job.");
        return;
      }

      alert(data.message || "Job saved successfully.");
    } catch (error) {
      console.error("Save job error:", error);
      alert("Unable to save the job.");
    } finally {
      setSavingJobId(null);
    }
  };

  /*
   * This function does not claim that an external application
   * was submitted.
   *
   * The backend stores the job in the application tracker.
   * Then the official job application page is opened.
   */
  const applyJob = async (job) => {
    const jobId = job?.job_id;
    const applyUrl = job?.apply_url;

    if (!jobId) {
      alert("This job does not have a valid job ID.");
      return;
    }

    if (!applyUrl) {
      alert(
        "The official application link is unavailable for this job."
      );
      return;
    }

    if (processingJobId === jobId) return;

    try {
      setProcessingJobId(jobId);

      const token = getToken();

      if (!token) {
        alert("Please login first.");
        return;
      }

      const response = await fetch("/api/applications/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          job_id: jobId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.detail ||
            data.message ||
            "Unable to save this job to your application tracker."
        );
        return;
      }

      /*
       * The backend response should indicate that the job
       * was saved/tracked, not that an external application
       * was submitted.
       */
      const trackerMessage =
        data.message ||
        "Job saved to your application tracker.";

      alert(
        `${trackerMessage}\n\nYou will now be redirected to the official application page.`
      );

      window.open(applyUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Apply job error:", error);
      alert(
        "Unable to save the job to your tracker. Please try again."
      );
    } finally {
      setProcessingJobId(null);
    }
  };

  const tailorResume = async (job) => {
    try {
      const token = getToken();

      if (!token) {
        alert("Please login first.");
        return;
      }

      const response = await fetch("/api/resume-tailor/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          job,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Unable to tailor resume.");
        return;
      }

      setGeneratedResume(data.resume || "");
      alert("Resume generated successfully.");
    } catch (error) {
      console.error("Resume generation error:", error);
      alert("Unable to generate resume.");
    }
  };

  const getJobKey = (job, index) => {
    return job?.job_id || job?.id || job?.apply_url || index;
  };

  return (
    <div
      style={{
        marginTop: "30px",
        background: colors.card,
        color: colors.text,
        border: colors.borderStyle,
        borderRadius: "18px",
        padding: "30px",
        boxShadow: "0 10px 30px rgba(0,0,0,.08)",
      }}
    >
      <h2
        className="jobs-title"
        style={{
          color: colors.text,
          marginTop: 0,
        }}
      >
        Recommended Jobs
      </h2>

      <p
        style={{
          color: colors.subText,
          lineHeight: "1.6",
        }}
      >
        AI-recommended jobs based on your resume and skills.
      </p>

      {loading && <Loader text="Loading Recommended Jobs..." />}

      {!loading && jobs.length === 0 && (
        <div
          style={{
            marginTop: "25px",
            padding: "25px",
            background: colors.card,
            border: colors.borderStyle,
            borderRadius: "12px",
            textAlign: "center",
            color: colors.text,
          }}
        >
          No recommended jobs found.
        </div>
      )}

      {!loading &&
        jobs.map((job, index) => {
          const jobId = job.job_id || job.id;
          const isApplying = processingJobId === jobId;
          const isSaving = savingJobId === jobId;

          return (
            <div
              key={getJobKey(job, index)}
              style={{
                marginTop: "25px",
                border: colors.borderStyle,
                borderRadius: "16px",
                padding: "20px",
                background: colors.card,
                boxShadow: "0 5px 15px rgba(0,0,0,.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "15px",
                }}
              >
                <div>
                  {jobId ? (
                    <Link
                      href={`/job/${jobId}`}
                      style={{
                        textDecoration: "none",
                        color: colors.text,
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          color: colors.text,
                        }}
                      >
                        {job.title || "Untitled Job"}
                      </h3>
                    </Link>
                  ) : (
                    <h3
                      style={{
                        margin: 0,
                        color: colors.text,
                      }}
                    >
                      {job.title || "Untitled Job"}
                    </h3>
                  )}

                  <p
                    style={{
                      marginTop: "8px",
                      color: colors.text,
                    }}
                  >
                    {job.company || "Company not available"}
                  </p>
                </div>

                <div
                  style={{
                    background: colors.infoBg,
                    color: colors.infoText,
                    padding: "8px 15px",
                    borderRadius: "20px",
                    fontWeight: "600",
                  }}
                >
                  ⭐ {job.score ?? 0}% Match
                </div>

                <div
                  style={{
                    marginTop: "10px",
                    display: "inline-block",
                    background: colors.successBg,
                    padding: "8px 14px",
                    borderRadius: "20px",
                    fontWeight: "600",
                    color: colors.successText,
                  }}
                >
                  📄 ATS Score: {job.ats_score ?? 0}%
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                  marginTop: "15px",
                }}
              >
                <span
                  style={{
                    background: colors.surface,
                    color: colors.text,
                    border: colors.borderStyle,
                    padding: "8px 14px",
                    borderRadius: "20px",
                    fontSize: "14px",
                  }}
                >
                  📍 {job.location || "Location Not Available"}
                </span>

                <span
                  style={{
                    background: colors.surface,
                    color: colors.text,
                    border: colors.borderStyle,
                    padding: "8px 14px",
                    borderRadius: "20px",
                    fontSize: "14px",
                  }}
                >
                  💼 Recommended
                </span>
              </div>

              <div
                style={{
                  marginTop: "18px",
                  color: colors.text,
                }}
              >
                <strong>Why this job?</strong>

                <div style={{ marginTop: "15px" }}>
                  <strong>Matched Skills</strong>

                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                      marginTop: "10px",
                    }}
                  >
                    {(job.matched_skills || []).map((skill, skillIndex) => (
                      <span
                        key={`${skill}-${skillIndex}`}
                        style={{
                          background: colors.successBg,
                          color: colors.successText,
                          padding: "6px 12px",
                          borderRadius: "20px",
                          fontSize: "13px",
                        }}
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: "18px" }}>
                  <strong>Missing Skills</strong>

                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                      marginTop: "10px",
                    }}
                  >
                    {(job.missing_skills || []).map(
                      (skill, skillIndex) => (
                        <span
                          key={`${skill}-${skillIndex}`}
                          style={{
                            background: colors.dangerBg,
                            color: colors.dangerText,
                            padding: "6px 12px",
                            borderRadius: "20px",
                            fontSize: "13px",
                          }}
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div style={{ marginTop: "18px" }}>
                  <strong>Missing Resume Keywords</strong>

                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                      marginTop: "10px",
                    }}
                  >
                    {(job.ats_missing || []).map(
                      (skill, skillIndex) => (
                        <span
                          key={`${skill}-${skillIndex}`}
                          style={{
                            background: colors.dangerBg,
                            color: colors.dangerText,
                            padding: "6px 12px",
                            borderRadius: "20px",
                            fontSize: "13px",
                          }}
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "18px",
                    padding: "15px",
                    background: colors.surface,
                    borderRadius: "10px",
                  }}
                >
                  <strong>📚 AI Recommendation</strong>

                  <p
                    style={{
                      marginTop: "10px",
                      color: colors.text,
                      lineHeight: "1.7",
                    }}
                  >
                    {job.recommendation ||
                      "Recommended based on your profile."}
                  </p>
                </div>

                <p
                  style={{
                    color: colors.text,
                    marginTop: "15px",
                    lineHeight: "1.7",
                  }}
                >
                  {job.reason ||
                    "Recommended based on your profile."}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  marginTop: "20px",
                }}
              >
                <Button
                  variant="secondary"
                  disabled={isSaving}
                  onClick={() => saveJob(jobId)}
                >
                  {isSaving ? "Saving..." : "Save Job"}
                </Button>

                <Button
                  variant="primary"
                  disabled={isApplying}
                  onClick={() => applyJob(job)}
                >
                  {isApplying ? "Processing..." : "Track & Apply"}
                </Button>

                {job.apply_url ? (
                  <a
                    href={job.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      padding: "10px 18px",
                      background: colors.successBg,
                      color: colors.successText,
                      borderRadius: "8px",
                      textDecoration: "none",
                      fontWeight: "600",
                    }}
                  >
                    🔗 View Original Job
                  </a>
                ) : (
                  <span
                    style={{
                      padding: "10px 18px",
                      background: colors.surface,
                      color: colors.subText,
                      borderRadius: "8px",
                    }}
                  >
                    Application link unavailable
                  </span>
                )}

                <Button
                  variant="primary"
                  onClick={() => tailorResume(job)}
                >
                  ✨ Generate Resume
                </Button>
              </div>
            </div>
          );
        })}

      {!loading && jobs.length > 0 && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            background: colors.card,
            borderRadius: "12px",
            border: colors.borderStyle,
          }}
        >
          <h3
            style={{
              marginTop: 0,
              color: colors.text,
            }}
          >
            💡 Job Search Tips
          </h3>

          <ul
            style={{
              margin: 0,
              paddingLeft: "20px",
              lineHeight: "1.9",
              color: colors.text,
            }}
          >
            <li>Tailor your resume before applying.</li>
            <li>Apply to jobs with a strong match score.</li>
            <li>Include missing skills from the ATS report.</li>
            <li>Update your LinkedIn profile.</li>
            <li>Apply consistently every day.</li>
          </ul>
        </div>
      )}

      {generatedResume && (
        <div
          style={{
            marginTop: "40px",
            background: colors.card,
            padding: "30px",
            borderRadius: "15px",
            border: colors.borderStyle,
          }}
        >
          <h2 style={{ color: colors.text }}>
            Generated Resume
          </h2>

          <pre
            style={{
              whiteSpace: "pre-wrap",
              fontFamily: "inherit",
              color: colors.text,
              lineHeight: "1.7",
            }}
          >
            {generatedResume}
          </pre>
        </div>
      )}
    </div>
  );
}