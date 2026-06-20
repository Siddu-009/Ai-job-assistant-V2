import { useState } from "react";

export default function SavedJobs() {

  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(false);

  const loadSavedJobs = async () => {

    setLoading(true);

    const token =
      localStorage.getItem("token");

    const response = await fetch(
      `/api/saved-jobs/${token}`
    );

    const data = await response.json();

    setJobs(data);

    setLoading(false);
  };

  const deleteJob = async (savedId) => {

    await fetch(
      `/api/saved-jobs/${savedId}`,
      {
        method: "DELETE"
      }
    );

    loadSavedJobs();
  };

  return (
    <div
      style={{
        marginTop: "30px",
        border: "1px solid #ddd",
        padding: "20px",
        borderRadius: "10px"
      }}
    >
      <h2>
        Saved Jobs
      </h2>

      <button
        onClick={loadSavedJobs}
      >
        Load Saved Jobs
      </button>

      <br />
      <br />

      {
        loading &&
        <p>
          Loading...
        </p>
      }

      {
        jobs.map((job) => (

          <div
            key={job.saved_id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "8px"
            }}
          >
            <h3>
              {job.title}
            </h3>

            <p>
              Company:
              {" "}
              {job.company}
            </p>

            <p>
              Location:
              {" "}
              {job.location}
            </p>

            <a
              href={job.apply_url}
              target="_blank"
              rel="noreferrer"
            >
              Apply
            </a>

            <br />
            <br />

            <button
              onClick={() =>
                deleteJob(
                  job.saved_id
                )
              }
            >
              Remove
            </button>
          </div>

        ))
      }
    </div>
  );
}

