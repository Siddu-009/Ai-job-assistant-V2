export default function EmptyState({
  title,
  description,
}) {
  return (
    <div
      style={{
        padding: 60,
        textAlign: "center",
        background: "#fff",
        borderRadius: 16,
      }}
    >
      <h2>{title}</h2>

      <p
        style={{
          color: "#6b7280",
        }}
      >
        {description}
      </p>
    </div>
  );
}