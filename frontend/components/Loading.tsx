export default function Loading() {
    return (
        <div className="loading-overlay">

            <div className="loading-card">

                <div className="loader-circle"></div>

                <h2>🤖 AI Resume Engine</h2>

                <p>Reading Resume...</p>

                <p>Extracting Skills...</p>

                <p>Matching ATS Keywords...</p>

                <p>Building Professional Resume...</p>

                <div className="progress-bar">

                    <div className="progress-fill"></div>

                </div>

                <span>Please wait a few seconds...</span>

            </div>

        </div>
    );
}