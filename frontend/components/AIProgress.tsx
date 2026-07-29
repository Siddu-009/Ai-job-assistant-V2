type Props = {
    loading: boolean;
};

const steps = [
    "Reading Resume",
    "Extracting Skills",
    "Matching ATS Keywords",
    "Optimizing Resume",
    "Building DOCX"
];

export default function AIProgress({
    loading
}: Props) {

    if (!loading) return null;

    return (

        <div className="ai-progress">

            <h3>🤖 AI Resume Engine</h3>

            {steps.map((step, index) => (

                <div
                    key={index}
                    className="progress-step"
                >

                    <span className="progress-dot"></span>

                    {step}

                </div>

            ))}

        </div>

    );

}