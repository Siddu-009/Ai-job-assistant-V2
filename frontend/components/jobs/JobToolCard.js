import Link from "next/link";

export default function JobToolCard({
  title,
  description,
  icon,
  href,
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 18,
        padding: 25,
        boxShadow: "0 10px 25px rgba(0,0,0,.06)",
      }}
    >
      <div
        style={{
          fontSize: 38,
          marginBottom: 15,
        }}
      >
        {icon}
      </div>

      <h2 style={{ marginBottom: 10 }}>
        {title}
      </h2>

      <p
        style={{
          color: "#6b7280",
          lineHeight: 1.7,
        }}
      >
        {description}
      </p>

      <Link href={href}>
        <button
          style={{
            marginTop: 20,
            padding: "10px 20px",
            border: "none",
            borderRadius: 10,
            background: "#2563eb",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Open
        </button>
      </Link>
    </div>
  );
}