export default function ATSScoreCard({ analysis }) {

    if (!analysis) return null;

    return (
        <div className="ats-card">

            <div className="ats-header">
                <h2>ATS Resume Analysis</h2>
                <h1>{analysis.ats_score}%</h1>
            </div>

            <div className="progress">
                <div
                    className="progress-fill"
                    style={{ width: `${analysis.ats_score}%` }}
                />
            </div>

            <div className="ats-stats">

                <div className="stat">
                    <h3>Overall Score</h3>
                    <p>{analysis.overall_score}</p>
                </div>

                <div className="stat">
                    <h3>Strengths</h3>
                    <p>{analysis.strengths?.length || 0}</p>
                </div>

                <div className="stat">
                    <h3>Weaknesses</h3>
                    <p>{analysis.weaknesses?.length || 0}</p>
                </div>

            </div>

        </div>
    );
}