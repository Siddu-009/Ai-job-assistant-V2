import { useState } from "react";

export default function RecentApplications() {

  const [apps, setApps] =
    useState([]);

  const loadApps = async () => {

    const token =
      localStorage.getItem("token");

    const response =
      await fetch(
        "/api/applications/my-applications",
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

    setApps(data);

  };

  return (

    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow:
          "0 2px 10px rgba(0,0,0,0.1)",
        marginBottom: "30px"
      }}
    >

      <h2>
        Recent Applications
      </h2>

      <button
        onClick={loadApps}
      >
        Load Applications
      </button>

      <br />
      <br />

      {
        apps.slice(0,5).map(
          (app,index) => (

            <div
              key={index}
              style={{
                padding: "10px",
                borderBottom:
                  "1px solid #eee"
              }}
            >
              <strong>
                {app.title}
              </strong>

              <br />

              Status:
              {" "}
              {app.status}
            </div>

          )
        )
      }

    </div>

  );

}
