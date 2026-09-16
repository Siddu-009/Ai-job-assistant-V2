import { useTheme } from "../../context/ThemeContext";

export default function RecentActivity() {
    const { colors, darkMode } = useTheme();

const activity = [
    "Resume Uploaded",
    "ATS Score Improved",
    "Applied to Infosys",
    "Saved TCS Job",
    "Generated Cover Letter"
];

return (
<div
    style={{
        background: colors.card,
        color: colors.text,
        padding: "25px",
        borderRadius: "18px",
        boxShadow: "0 8px 25px rgba(0,0,0,.06)"
    }}
>
    <h2 style={{ color: darkMode ? "#fff" : "#111827" }}>
        Recent Activity
    </h2>

    {activity.map((item,index)=>(
        <div
            key={index}
            style={{
                padding:"15px 0",
                borderBottom: colors.borderStyle,
                color: colors.subText
            }}
        >
            ✅ {item}
        </div>
    ))}
</div>
);
}