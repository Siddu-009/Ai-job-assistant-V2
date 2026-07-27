export default function CareerRecommendations({ data }) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "18px",
        padding: "25px",
        boxShadow: "0 10px 25px rgba(0,0,0,.06)",
        marginBottom: "30px",
      }}
    >
      <h2>🚀 Career Recommendations</h2>

      <ul
        style={{
          marginTop: "20px",
          paddingLeft: "20px",
          lineHeight: "2",
          color: "#4b5563",
        }}
      >
        <li>Complete AWS Solutions Architect Certification.</li>
        <li>Learn Helm and ArgoCD for Kubernetes deployments.</li>
        <li>Build more real-world DevOps projects.</li>
        <li>Improve ATS score above 95%.</li>
        <li>Apply to at least 5 matching jobs every week.</li>
      </ul>
    </div>
  );
}