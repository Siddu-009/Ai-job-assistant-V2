export default function EmptyState({
  title,
  description,
}) {
  return (
    <div
      style={{
        padding: 60,
        textAlign: "center",
        background: colors.card,
border: colors.borderStyle,
        borderRadius: 16,
      }}
    >
      <h2>{title}</h2>

      <p
        style={{
          color: colors.subText,
        }}
      >
        {description}
      </p>
    </div>
  );
}