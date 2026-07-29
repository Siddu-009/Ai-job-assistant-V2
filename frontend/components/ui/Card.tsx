import { ReactNode } from "react";

export default function Card({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      style={{
        maxWidth: 900,
        margin: "40px auto",
        background: "#fff",
        borderRadius: 20,
        padding: 40,
        boxShadow: "0 15px 40px rgba(0,0,0,.08)",
      }}
    >
      {children}
    </div>
  );
}