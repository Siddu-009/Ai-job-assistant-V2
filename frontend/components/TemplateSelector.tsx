type Props = {
    value: string;
    onChange: (template: string) => void;
};

const templates = [
    {
        id: "classic",
        title: "Classic",
        description: "Best for all companies"
    },
    {
        id: "modern",
        title: "Modern",
        description: "Clean & professional"
    },
    {
        id: "executive",
        title: "Executive",
        description: "Senior-level resumes"
    },
    {
        id: "minimal",
        title: "Minimal",
        description: "Simple ATS friendly"
    }
];

export default function TemplateSelector({
    value,
    onChange
}: Props) {

    return (

        <>

            <h3
                style={{
                    marginTop: 35,
                    marginBottom: 20
                }}
            >
                Select Resume Template
            </h3>

            <div className="template-grid">

                {templates.map((template) => (

                    <div
                        key={template.id}
                        onClick={() => onChange(template.id)}
                        className={
                            value === template.id
                                ? "template-card active"
                                : "template-card"
                        }
                    >

                        <h4>{template.title}</h4>

                        <p>{template.description}</p>

                    </div>

                ))}

            </div>

        </>

    );

}