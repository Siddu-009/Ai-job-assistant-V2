import { useState } from "react";

export default function Admin() {

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loggedIn, setLoggedIn] =
    useState(false);

  const [stats, setStats] =
    useState(null);

  const [users, setUsers] =
    useState([]);

  const [jobs, setJobs] =
    useState([]);

  const [applications, setApplications] =
    useState([]);

  const login = async () => {

    const response = await fetch(
      "/api/admin/login",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      }
    );

    const data =
      await response.json();

    if (
      data.message
    ) {

      setLoggedIn(true);

      loadStats();

    } else {

      alert(
        "Invalid Login"
      );

    }

  };

  const loadStats = async () => {

    const response =
      await fetch(
        "/api/admin/stats"
      );

    const data =
      await response.json();

    setStats(data);
  };

  const loadUsers = async () => {

    const response =
      await fetch(
        "/api/admin/users"
      );

    const data =
      await response.json();

    setUsers(data);
  };

  const loadJobs = async () => {

    const response =
      await fetch(
        "/api/admin/jobs"
      );

    const data =
      await response.json();

    setJobs(data);
  };

  const loadApplications = async () => {

    const response =
      await fetch(
        "/api/admin/applications"
      );

    const data =
      await response.json();

    setApplications(data);
  };

  if (!loggedIn) {

    return (

      <div
        style={{
          maxWidth: "400px",
          margin: "50px auto",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px"
        }}
      >

        <h1>
          Admin Login
        </h1>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "10px"
          }}
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "10px"
          }}
        />

        <br />
        <br />

        <button
          onClick={login}
        >
          Login
        </button>

      </div>

    );

  }

  return (

    <div
      style={{
        padding: "20px",
        fontFamily: "Arial"
      }}
    >

      <h1>
        Admin Dashboard
      </h1>

      {
        stats && (

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(4,1fr)",
              gap: "20px",
              marginBottom: "30px"
            }}
          >

            <Card
              title="Users"
              value={
                stats.total_users
              }
            />

            <Card
              title="Jobs"
              value={
                stats.total_jobs
              }
            />

            <Card
              title="Saved Jobs"
              value={
                stats.total_saved_jobs
              }
            />

            <Card
              title="Applications"
              value={
                stats.total_applications
              }
            />

          </div>

        )
      }

      <button
        onClick={loadUsers}
      >
        Load Users
      </button>

      {" "}

      <button
        onClick={loadJobs}
      >
        Load Jobs
      </button>

      {" "}

      <button
        onClick={loadApplications}
      >
        Load Applications
      </button>

      <hr />

      <h2>
        Users
      </h2>

      {
        users.map(
          (user) => (

            <div
              key={user.id}
            >
              {user.name}
              {" - "}
              {user.email}
            </div>

          )
        )
      }

      <h2>
        Jobs
      </h2>

      {
        jobs.map(
          (job) => (

            <div
              key={job.id}
            >
              {job.title}
              {" - "}
              {job.company}
            </div>

          )
        )
      }

      <h2>
        Applications
      </h2>

      {
        applications.map(
          (app) => (

            <div
              key={
                app.application_id
              }
            >
              {app.user_name}
              {" - "}
              {app.job_title}
              {" - "}
              {app.status}
            </div>

          )
        )
      }

    </div>

  );

}

function Card({
  title,
  value
}) {

  return (

    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "20px",
        textAlign: "center",
        background: "white"
      }}
    >

      <h3>
        {title}
      </h3>

      <h1>
        {value}
      </h1>

    </div>

  );

}
