export default function KeywordAnalysis({

    matched = [],

    missing = [],

    recommendation = ""

}) {

    return (

        <div className="keyword-analysis">

            <div className="keyword-column">

                <h2>✅ Found Keywords</h2>

                <div className="chips">

                    {matched.map((item) => (

                        <span
                            key={item}
                            className="chip success"
                        >
                            {item}
                        </span>

                    ))}

                </div>

            </div>

            <div className="keyword-column">

                <h2>❌ Missing Keywords</h2>

                <div className="chips">

                    {missing.map((item) => (

                        <span
                            key={item}
                            className="chip danger"
                        >
                            {item}
                        </span>

                    ))}

                </div>

            </div>

            <div className="recommendation">

                <h2>💡 AI Recommendation</h2>

                <ul>
                    {(Array.isArray(recommendation)
                        ? recommendation
                        : [recommendation]
                    ).map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>

            </div>

        </div>

    );

}