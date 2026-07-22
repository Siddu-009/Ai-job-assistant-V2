export default function RecentActivity({ darkMode }) {

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
        background: darkMode ? "#1e293b" : "#fff",
        color: darkMode ? "#fff" : "#111827",
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
                borderBottom: darkMode
                    ? "1px solid #334155"
                    : "1px solid #eee",
                color: darkMode ? "#e2e8f0" : "#374151"
            }}
        >
            ✅ {item}
        </div>
    ))}
</div>
);
}