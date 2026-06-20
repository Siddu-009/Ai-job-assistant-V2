import { useState } from "react";

export default function Applications() {

  const [applications, setApplications] =
    useState([]);

  const loadApplications = async () => {

    const token =
      localStorage.getItem("token");

    const response = await fetch(
      "/api/applications/my-applications",
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

    const data =
      await response.json();

    setApplications(data);
  };

  return (
    <div
      style={{
        marginTop: "30px",
        border: "1px solid #ddd",
        padding: "20px",
        borderRadius: "10px",
        background: "white"
      }}
    >
      <h2>
        My Applications
      </h2>

      <button
        onClick={
          loadApplications
        }
      >
        Load My Applications
      </button>

      <br />
      <br />

      {
        applications.length === 0 &&
        (
          <p>
            No applications found
          </p>
        )
      }

      {
        applications.map(
          (app, index) => (

            <div
              key={index}
              style={{
                border:
                  "1px solid #ccc",
                padding:
                  "15px",
                marginBottom:
                  "15px",
                borderRadius:
                  "10px"
              }}
            >
              <h3>
                {app.title}
              </h3>

              <p>
                Company:
                {" "}
                {app.company}
              </p>

              <p>
                Status:
                {" "}
                {app.status}
              </p>

              <p>
                Applied On:
                {" "}
                {app.created_at}
              </p>

            </div>

          )
        )
      }

    </div>
  );
}
