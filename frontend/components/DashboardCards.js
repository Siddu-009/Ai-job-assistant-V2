import { useEffect, useState } from "react";

export default function DashboardCards() {

  const [darkMode, setDarkMode] =
    useState(false);

  const [stats, setStats] =
    useState({
      applications: 0,
      interviews: 0,
      selected: 0,
      rejected: 0
    });

  useEffect(() => {

    const theme =
      localStorage.getItem("theme");

    setDarkMode(
      theme === "dark"
    );

    const token =
      localStorage.getItem("token");

    fetch(
      `/api/dashboard/${token}`
    )
      .then(
        res => res.json()
      )
      .then(data => {

        setStats({
          applications:
            data.applications || 0,

          interviews:
            data.interviews || 0,

          selected:
            data.selected || 0,

          rejected:
            data.rejected || 0
        });

      });

  }, []);

  return (

    <div
      style={{
        display: "grid",

        gridTemplateColumns:
          "repeat(auto-fit,minmax(220px,1fr))",

        gap: "20px",

        marginBottom: "30px"
      }}
    >

      <StatCard
        icon="📄"
        title="Applications"
        value={stats.applications}
        darkMode={darkMode}
      />

      <StatCard
        icon="🎯"
        title="Interviews"
        value={stats.interviews}
        darkMode={darkMode}
      />

      <StatCard
        icon="✅"
        title="Selected"
        value={stats.selected}
        darkMode={darkMode}
      />

      <StatCard
        icon="❌"
        title="Rejected"
        value={stats.rejected}
        darkMode={darkMode}
      />

    </div>

  );

}

function StatCard({
  icon,
  title,
  value,
  darkMode
}) {

  return (

    <div
      style={{
        background:
          darkMode
            ? "#1e293b"
            : "#ffffff",

        color:
          darkMode
            ? "#ffffff"
            : "#111827",

        padding: "20px",

        borderRadius: "12px",

        boxShadow:
          "0 2px 10px rgba(0,0,0,0.1)"
      }}
    >

      <div
        style={{
          fontSize: "30px"
        }}
      >
        {icon}
      </div>

      <h3>
        {title}
      </h3>

      <h1
        style={{
          color: "#3b82f6"
        }}
      >
        {value}
      </h1>

    </div>

  );

}
