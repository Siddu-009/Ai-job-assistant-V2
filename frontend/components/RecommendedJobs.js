import { useEffect, useState } from "react";

export default function RecommendedJobs() {

  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    loadJobs();

  }, []);

  const loadJobs = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "/api/recommend-jobs/",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            token
          })
        }
      );

      const data =
        await response.json();

      setJobs(
        data.recommended_jobs || []
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  const saveJob = async (jobId) => {

    const token =
      localStorage.getItem("token");

    const response = await fetch(
      "/api/saved-jobs/add",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          token,
          job_id: jobId
        })
      }
    );

    const data =
      await response.json();

    alert(
      data.message ||
      "Job Saved Successfully"
    );
  };

  const applyJob = async (jobId) => {

    const token =
      localStorage.getItem("token");

    const response = await fetch(
      "/api/applications/apply",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          token,
          job_id: jobId
        })
      }
    );

    const data =
      await response.json();

    alert(
      data.message ||
      "Application Submitted"
    );
  };

  return (

    <div
      style={{
        marginTop: "30px",
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        border: "1px solid #ddd"
      }}
    >

      <h2>
        Recommended Jobs
      </h2>

      {
        loading &&
        <p>
          Loading jobs...
        </p>
      }

      {
        jobs.length === 0 &&
        !loading &&
        (
          <p>
            No recommended jobs found.
          </p>
        )
      }

      {
        jobs.map((job) => (

          <div
            key={job.job_id}
            style={{
              border:
                "1px solid #ddd",
              borderRadius:
                "10px",
              padding:
                "15px",
              marginBottom:
                "15px"
            }}
          >

            <h3>
              {job.title}
            </h3>

            <p>
              <strong>Company:</strong>
              {" "}
              {job.company}
            </p>

            <p>
              <strong>Location:</strong>
              {" "}
              {job.location}
            </p>

            <p>
              <strong>Match Score:</strong>
              {" "}
              {job.score}%
            </p>

            <p>
              {job.reason}
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px"
              }}
            >

              <button
                onClick={() =>
                  saveJob(
                    job.job_id
                  )
                }
              >
                Save Job
              </button>

              <button
                onClick={() =>
                  applyJob(
                    job.job_id
                  )
                }
              >
                Apply Now
              </button>

            </div>

          </div>

        ))
      }

    </div>

  );

}
