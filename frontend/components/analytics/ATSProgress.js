export default function ATSProgress({ data }) {
  const scores = [70, 76, 82, 87, 91];

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "18px",
        padding: "25px",
        boxShadow: "0 10px 25px rgba(0,0,0,.06)",
      }}
    >
      <h2>ATS Progress</h2>

      <div style={{ marginTop: "25px" }}>
        {scores.map((score, index) => (
          <div
            key={index}
            style={{
              marginBottom: "18px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>Version {index + 1}</span>
              <strong>{score}%</strong>
            </div>

            <div
              style={{
                marginTop: "6px",
                height: "10px",
                background: "#e5e7eb",
                borderRadius: "20px",
              }}
            >
              <div
                style={{
                  width: `${score}%`,
                  height: "100%",
                  background: "#2563eb",
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