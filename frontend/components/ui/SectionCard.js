import { useTheme } from "../context/ThemeContext";
export default function SectionCard({
  title,
  children,
  action,
}) {
  const { colors } = useTheme();
  return (
    <div
      style={{
        background: colors.card,
        border: colors.borderStyle,
        borderRadius: 16,
        padding: 24,
        boxShadow: "0 8px 24px rgba(0,0,0,.06)",
        marginBottom: 24,
      }}
    >
      {(title || action) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 20,
            }}
          >
            {title}
          </h2>

          {action}
        </div>
      )}

      {children}
    </div>
  );
}