export default function CardGrid({ children }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(320px,1fr))",
        gap: 25,
      }}
    >
      {children}
    </div>
  );
}