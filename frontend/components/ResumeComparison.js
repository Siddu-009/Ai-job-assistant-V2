export default function ResumeComparison({

    original = "",

    optimized = ""

}) {

    return (

        <div className="comparison-card">

            <h2>📄 Resume Comparison</h2>

            <div className="comparison-grid">

                <div className="comparison-column">

                    <h3>Original Resume</h3>

                    <pre>{original}</pre>

                </div>

                <div className="comparison-column">

                    <h3>AI Optimized Resume</h3>

                    <pre>{optimized}</pre>

                </div>

            </div>

        </div>

    );

}