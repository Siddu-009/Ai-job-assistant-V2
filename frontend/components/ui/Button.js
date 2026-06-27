export default function Button({

  children,

  onClick,

  type = "button",

  variant = "primary",

  disabled = false,

  fullWidth = false,

  style = {}

}) {

  const colors = {

    primary: "#2563eb",

    success: "#16a34a",

    danger: "#dc2626",

    warning: "#f59e0b",

    secondary: "#6b7280",

    dark: "#111827"

  };

  return (

    <button

      type={type}

      onClick={onClick}

      disabled={disabled}

      style={{

        width: fullWidth ? "100%" : "auto",

        padding: "14px 24px",

        border: "none",

        borderRadius: "12px",

        background: disabled

          ? "#d1d5db"

          : colors[variant],

        color: "#ffffff",

        fontSize: "15px",

        fontWeight: "600",

        cursor: disabled

          ? "not-allowed"

          : "pointer",

        transition: "0.25s",

        ...style

      }}

    >

      {children}

    </button>

  );

}
