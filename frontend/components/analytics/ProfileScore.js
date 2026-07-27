export default function ProfileScore({ data }) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "18px",
        padding: "25px",
        boxShadow: "0 10px 25px rgba(0,0,0,.06)",
      }}
    >
      <h2>Profile Score</h2>

      <h1
        style={{
          color: "#16a34a",
          marginTop: "25px",
        }}
      >
        92%
      </h1>

      <div
        style={{
          height: "12px",
          background: "#e5e7eb",
          borderRadius: "20px",
          marginTop: "15px",
        }}
      >
        <div
          style={{
            width: "92%",
            height: "100%",
            background: "#16a34a",
            borderRadius: "20px",
          }}
        />
      </div>

      <p
        style={{
          marginTop: "15px",
          color: "#6b7280",
        }}
      >
        Your profile is nearly complete.
      </p>
    </div>
  );
}