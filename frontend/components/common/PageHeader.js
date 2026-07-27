export default function PageHeader({
  title,
  description,
}) {
  return (
    <div style={{ marginBottom: 30 }}>
      <h1 style={{ marginBottom: 10 }}>
        {title}
      </h1>

      <p
        style={{
          color: "#6b7280",
          fontSize: 16,
        }}
      >
        {description}
      </p>
    </div>
  );
}