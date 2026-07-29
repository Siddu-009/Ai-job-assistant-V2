export default function ResumeSections({ sections = [] }) {

    return (

        <div className="sections-card">

            <h2>📋 Resume Section Analysis</h2>

            {sections.map((section) => (

                <div
                    key={section.name}
                    className="section-item"
                >

                    <div>

                        <strong>{section.name}</strong>

                        <p>{section.message}</p>

                    </div>

                    <span
                        className={`status ${section.status.toLowerCase()}`}
                    >

                        {section.status}

                    </span>

                </div>

            ))}

        </div>

    );

}