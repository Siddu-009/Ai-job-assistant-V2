export default function WeeklyPerformance({ data }) {
  const items = [
    {
      name: "Resume Uploads",
      value: data?.uploaded_resumes || 0,
      color: "#2563eb",
    },
    {
      name: "Generated Resumes",
      value: data?.generated_resumes || 0,
      color: "#16a34a",
    },
    {
      name: "Applications",
      value: data?.applications || 0,
      color: "#7c3aed",
    },
    {
      name: "Saved Jobs",
      value: data?.saved_jobs || 0,
      color: "#f59e0b",
    },
  ];

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "18px",
        padding: "25px",
        boxShadow: "0 10px 25px rgba(0,0,0,.06)",
      }}
    >
      <h2>Weekly Performance</h2>

      <div style={{ marginTop: "25px" }}>
        {items.map((item, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span>{item.name}</span>
              <strong>{item.value}</strong>
            </div>

            <div
              style={{
                height: "10px",
                background: "#e5e7eb",
                borderRadius: "20px",
              }}
            >
              <div
                style={{
                  width: `${Math.min(item.value * 10, 100)}%`,
                  height: "100%",
                  background: item.color,
                  borderRadius: "20px",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}