export default function PrimaryButton({
  children,
  onClick,
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        background: "#2563eb",
        color: "#fff",
        border: "none",
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