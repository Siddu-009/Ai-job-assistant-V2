export default function WeeklyGoals({ data }) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "18px",
        padding: "25px",
        boxShadow: "0 10px 25px rgba(0,0,0,.06)",
        marginBottom: "30px",
      }}
    >
      <h2>🎯 Weekly Goals</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div>
          <strong>Apply to Jobs</strong>

          <div
            style={{
              marginTop: "8px",
              height: "10px",
              background: "#e5e7eb",
              borderRadius: "20px",
            }}
          >
            <div
              style={{
                width: "75%",
                height: "100%",
                background: "#16a34a",
                borderRadius: "20px",
              }}
            />
          </div>
        </div>

        <div>
          <strong>Resume Updates</strong>

          <div
            style={{
              marginTop: "8px",
              height: "10px",
              background: "#e5e7eb",
              borderRadius: "20px",
            }}
          >
            <div
              style={{
                width: "90%",
                height: "100%",
                background: "#2563eb",
                borderRadius: "20px",
              }}
            />
          </div>
        </div>

        <div>
          <strong>Mock Interviews</strong>

          <div
            style={{
              marginTop: "8px",
              height: "10px",
              background: "#e5e7eb",
              borderRadius: "20px",
            }}
          >
            <div
              style={{
                width: "60%",
                height: "100%",
                background: "#f59e0b",
                borderRadius: "20px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}