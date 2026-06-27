import { useEffect, useState } from "react";

import Button from "./ui/Button";
import Loader from "./ui/Loader";

export default function RecommendedJobs() {

  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    loadJobs();

  }, []);

  const loadJobs = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(

        "/api/recommend-jobs/",

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json"

          },

          body: JSON.stringify({

            token

          })

        }

      );

      const data = await response.json();

      setJobs(

        data.recommended_jobs || []

      );

    }

    catch (error) {

      console.error(error);

      alert("Unable to load recommended jobs.");

    }

    finally {

      setLoading(false);

    }

  };

  const saveJob = async (jobId) => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(

        "/api/saved-jobs/add",

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json"

          },

          body: JSON.stringify({

            token,

            job_id: jobId

          })

        }

      );

      const data = await response.json();

      alert(

        data.message ||

        "Job Saved Successfully"

      );

    }

    catch (error) {

      console.error(error);

      alert("Unable to save the job.");

    }

  };

  const applyJob = async (jobId) => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(

        "/api/applications/apply",

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json"

          },

          body: JSON.stringify({

            token,

            job_id: jobId

          })

        }

      );

      const data = await response.json();

      alert(

        data.message ||

        "Application Submitted"

      );

    }

    catch (error) {

      console.error(error);

      alert("Unable to submit application.");

    }

  };

  return (

    <div

      style={{

        marginTop: "30px",

        background: "#ffffff",

        borderRadius: "18px",

        padding: "30px",

        boxShadow: "0 10px 30px rgba(0,0,0,.08)"

      }}

    >

      <h2

        style={{

          marginTop: 0

        }}

      >

        Recommended Jobs

      </h2>

      <p

        style={{

          color: "#6b7280"

        }}

      >

        AI recommended jobs based on your resume and skills.

      </p>

	        {

        loading &&

        <Loader

          text="Loading Recommended Jobs..."

        />

      }

      {

        !loading && jobs.length === 0 && (

          <div

            style={{

              marginTop: "25px",

              padding: "25px",

              background: "#f8fafc",

              borderRadius: "12px",

              textAlign: "center",

              color: "#6b7280"

            }}

          >

            No recommended jobs found.

          </div>

        )

      }

      {

        jobs.map((job) => (

          <div

            key={job.job_id}

            style={{

              marginTop: "25px",

              border: "1px solid #e5e7eb",

              borderRadius: "16px",

              padding: "20px",

              background: "#ffffff",

              boxShadow: "0 5px 15px rgba(0,0,0,.05)"

            }}

          >

            <div

              style={{

                display: "flex",

                justifyContent: "space-between",

                alignItems: "center",

                flexWrap: "wrap",

                gap: "15px"

              }}

            >

              <div>

                <h3

                  style={{

                    margin: 0

                  }}

                >

                  {job.title}

                </h3>

                <p

                  style={{

                    marginTop: "8px",

                    color: "#6b7280"

                  }}

                >

                  {job.company}

                </p>

              </div>

              <div

                style={{

                  background: "#dbeafe",

                  color: "#1d4ed8",

                  padding: "8px 15px",

                  borderRadius: "20px",

                  fontWeight: "600"

                }}

              >

                {job.score || 0}% Match

              </div>

            </div>

            <div

              style={{

                display: "flex",

                gap: "12px",

                flexWrap: "wrap",

                marginTop: "15px"

              }}

            >

              <span

                style={{

                  background: "#f3f4f6",

                  padding: "8px 14px",

                  borderRadius: "20px",

                  fontSize: "14px"

                }}

              >

                📍 {job.location || "Location Not Available"}

              </span>

              <span

                style={{

                  background: "#dcfce7",

                  color: "#166534",

                  padding: "8px 14px",

                  borderRadius: "20px",

                  fontSize: "14px"

                }}

              >

                💼 Recommended

              </span>

            </div>

            <div

              style={{

                marginTop: "18px"

              }}

            >

              <strong>

                Why this job?

              </strong>

              <p

                style={{

                  color: "#4b5563",

                  marginTop: "8px",

                  lineHeight: "1.7"

                }}

              >

                {

                  job.reason ||

                  "Recommended based on your profile."

                }

              </p>

            </div>

            <div

              style={{

                display: "flex",

                gap: "10px",

                flexWrap: "wrap",

                marginTop: "20px"

              }}

            >

		              <Button

                variant="secondary"

                onClick={() => saveJob(job.job_id)}

              >

                Save Job

              </Button>

              <Button

                variant="primary"

                onClick={() => applyJob(job.job_id)}

              >

                Apply Now

              </Button>

            </div>

          </div>

        ))

      }

      {

        !loading && jobs.length > 0 && (

          <div

            style={{

              marginTop: "30px",

              padding: "20px",

              background: "#f8fafc",

              borderRadius: "12px",

              border: "1px solid #e5e7eb"

            }}

          >

            <h3

              style={{

                marginTop: 0,

                color: "#2563eb"

              }}

            >

              💡 Job Search Tips

            </h3>

            <ul

              style={{

                margin: 0,

                paddingLeft: "20px",

                lineHeight: "1.9",

                color: "#4b5563"

              }}

            >

              <li>

                Tailor your resume before applying.

              </li>

              <li>

                Apply to jobs with a match score above 80%.

              </li>

              <li>

                Include the missing skills from the ATS report.

              </li>

              <li>

                Update your LinkedIn profile before applying.

              </li>

              <li>

                Apply consistently every day.

              </li>

            </ul>

          </div>

        )

      }

    </div>

  );

}
