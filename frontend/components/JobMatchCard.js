export default function JobMatchCard({ jobMatch }) {

    if (!jobMatch) return null;

    return (
        <div className="analysis-card">

            <h2>Job Match Analysis</h2>

            <h1>{jobMatch.match_score}%</h1>

            <div className="progress">

                <div
                    className="progress-fill"
                    style={{
                        width: `${jobMatch.match_score}%`
                    }}
                />

            </div>

            <div className="ats-stats">

                <div className="stat">
                    <h3>Matched</h3>
                    <p>{jobMatch.matched_count}</p>
                </div>

                <div className="stat">
                    <h3>Missing</h3>
                    <p>{jobMatch.missing_count}</p>
                </div>

                <div className="stat">
                    <h3>Total Keywords</h3>
                    <p>{jobMatch.total_keywords}</p>
                </div>

            </div>

        </div>
    );
}