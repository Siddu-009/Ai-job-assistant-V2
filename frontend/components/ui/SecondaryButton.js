export default function SecondaryButton({
  children,
  onClick,
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        background: colors.card,
border: colors.borderStyle,
        color: "#2563eb",
        border: "1px solid #2563eb",
        borderRadius: 10,
        padding: "10px 18px",
        cursor: "pointer",
        fontWeight: 600,
      }}
    >
      {children}
    </button>
  );
}