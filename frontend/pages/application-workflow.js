import { useEffect, useState } from "react";

export default function ApplicationWorkflow() {

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkflow();
  }, []);

  const loadWorkflow = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch("/api/application-workflow/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token
        })
      });

      const data = await response.json();

      if (Array.isArray(data.workflow)) {
        setApplications(data.workflow);
      } else {
        setApplications([]);
      }

    } catch (err) {

      console.log(err);
      alert("Unable to load workflow.");

    }

    setLoading(false);

  };

  const steps = [
    "Applied",
    "Resume Shortlisted",
    "Assessment",
    "HR Interview",
    "Technical Interview",
    "Manager Round",
    "Offer Released"
  ];

  return (

    <div
      style={{
        maxWidth: "1300px",
        margin: "40px auto",
        background: "#fff",
        padding: "35px",
        borderRadius: "20px",
        boxShadow: "0 15px 35px rgba(0,0,0,.08)"
      }}
    >

      <h1>Application Workflow</h1>

      <p style={{ color: "#6b7280" }}>
        Track every application through the recruitment pipeline.
      </p>

      {loading && <p>Loading...</p>}

      {!loading && applications.length === 0 && (
        <p>No Applications Found</p>
      )}

      {applications.map((job) => (

        <div
          key={job.application_id}
          style={{
            marginTop: "30px",
            padding: "25px",
            border: "1px solid #e5e7eb",
            borderRadius: "16px"
          }}
        >

          <h2>{job.title}</h2>

          <p>
            <strong>Company:</strong> {job.company}
          </p>

          <p>
            <strong>Status:</strong> {job.status}
          </p>

          <p>
            <strong>Applied:</strong> {job.applied_at}
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "30px",
              flexWrap: "wrap",
              gap: "15px"
            }}
          >

            {steps.map((step, i) => (

              <div
                key={i}
                style={{
                  flex: 1,
                  minWidth: "120px",
                  textAlign: "center"
                }}
              >

                <div
                  style={{
                    width: "45px",
                    height: "45px",
                    margin: "0 auto",
                    borderRadius: "50%",
                    background:
                      i <= job.current_step
                        ? "#16a34a"
                        : "#d1d5db",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold"
                  }}
                >
                  {i + 1}
                </div>

                <p
                  style={{
                    marginTop: "10px",
                    fontSize: "13px"
                  }}
                >
                  {step}
                </p>

              </div>

            ))}

          </div>

        </div>

      ))}

    </div>

  );

}