const colors = {
  card: "#ffffff",
};

export default function AnalyticsCard({
  title,
  value,
  color,
}) {
  return (
    <div
      style={{
        background: colors.card,
        padding: "25px",
        borderRadius: "18px",
        boxShadow: "0 10px 25px rgba(0,0,0,.06)",
        borderTop: `5px solid ${color}`,
      }}
    >
      <h3
        style={{
          margin: 0,
          color: "#6b7280",
          fontWeight: "500",
        }}
      >
        {title}
      </h3>

      <h1
        style={{
          marginTop: "20px",
          marginBottom: 0,
          fontSize: "38px",
          color,
        }}
      >
        {value}
      </h1>
    </div>
  );
}