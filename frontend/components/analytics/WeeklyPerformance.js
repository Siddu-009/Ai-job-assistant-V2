import { useTheme } from "../../context/ThemeContext";

export default function WeeklyPerformance({ data }) {
  const { colors, darkMode } = useTheme();

  const items = [
    {
      name: "Resume Uploads",
      value: data?.uploaded_resumes || 0,
      color: "#2563eb",
    },
    {
      name: "Generated Resumes",
      value: data?.generated_resumes || 0,
      color: "#16a34a",
    },
    {
      name: "Applications",
      value: data?.applications || 0,
      color: "#7c3aed",
    },
    {
      name: "Saved Jobs",
      value: data?.saved_jobs || 0,
      color: "#f59e0b",
    },
  ];

  return (
    <div
      style={{
        backgroundColor: colors.card,

        color: colors.text,

        border: `1px solid ${colors.border}`,

        borderRadius: "18px",

        padding: "25px",

        boxShadow: darkMode
          ? "0 10px 25px rgba(0, 0, 0, 0.25)"
          : "0 10px 25px rgba(15, 23, 42, 0.06)",

        transition:
          "background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease",
      }}
    >
      {/* Heading */}

      <h2
        style={{
          margin: 0,

          color: colors.text,

          fontSize: "18px",

          fontWeight: 700,

          transition: "color 0.3s ease",
        }}
      >
        Weekly Performance
      </h2>

      {/* Performance Items */}

      <div
        style={{
          marginTop: "25px",
        }}
      >
        {items.map((item, index) => {
          const percentage = Math.min(item.value * 10, 100);

          return (
            <div
              key={index}
              style={{
                marginBottom:
                  index === items.length - 1 ? 0 : "20px",
              }}
            >
              {/* Label and Value */}

              <div
                style={{
                  display: "flex",

                  justifyContent: "space-between",

                  alignItems: "center",

                  marginBottom: "8px",

                  gap: "12px",
                }}
              >
                <span
                  style={{
                    color: colors.text,

                    fontSize: "13px",

                    fontWeight: 500,

                    transition: "color 0.3s ease",
                  }}
                >
                  {item.name}
                </span>

                <strong
                  style={{
                    color: colors.text,

                    fontSize: "13px",

                    fontWeight: 600,

                    transition: "color 0.3s ease",
                  }}
                >
                  {item.value}
                </strong>
              </div>

              {/* Progress Track */}

              <div
                style={{
                  width: "100%",

                  height: "10px",

                  backgroundColor: darkMode
                    ? "#334155"
                    : "#e5e7eb",

                  borderRadius: "20px",

                  overflow: "hidden",

                  transition:
                    "background-color 0.3s ease",
                }}
              >
                {/* Progress Bar */}

                <div
                  style={{
                    width: `${percentage}%`,

                    height: "100%",

                    backgroundColor: item.color,

                    borderRadius: "20px",

                    transition:
                      "width 0.4s ease",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}