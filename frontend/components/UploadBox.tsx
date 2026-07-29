import { useState } from "react";
import { UploadCloud, FileText, X } from "lucide-react";

type UploadBoxProps = {
    onFileSelect: (file: File) => void;
};

const MAX_SIZE = 5 * 1024 * 1024;

export default function UploadBox({
    onFileSelect
}: UploadBoxProps) {

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [dragging, setDragging] = useState(false);
    const [error, setError] = useState("");

    const validateFile = (file: File) => {

        const allowed = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        if (!allowed.includes(file.type)) {
            setError("Only PDF and DOCX files are allowed.");
            return false;
        }

        if (file.size > MAX_SIZE) {
            setError("Maximum file size is 5 MB.");
            return false;
        }

        setError("");
        return true;
    };

    const handleFile = (file: File) => {

        if (!validateFile(file)) return;

        setSelectedFile(file);

        onFileSelect(file);

    };

    return (

        <label
            className={`upload-box ${dragging ? "dragging" : ""}`}

            onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
            }}

            onDragLeave={() => setDragging(false)}

            onDrop={(e) => {

                e.preventDefault();

                setDragging(false);

                const file = e.dataTransfer.files?.[0];

                if (file) handleFile(file);

            }}

        >

            <input
                hidden
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {

                    const file = e.target.files?.[0];

                    if (file) handleFile(file);

                }}
            />

            {!selectedFile ? (

                <>

                    <UploadCloud
                        size={70}
                        color="#2563eb"
                    />

                    <h2>Upload Resume</h2>

                    <p>

                        Drag & Drop PDF/DOCX here

                    </p>

                    <span className="browse-btn">

                        Browse Files

                    </span>

                    <small>

                        Maximum file size: 5 MB

                    </small>

                    {error && (

                        <div className="upload-error">

                            {error}

                        </div>

                    )}

                </>

            ) : (

                <div className="selected-file">

                    <FileText
                        size={55}
                        color="#2563eb"
                    />

                    <h3>

                        {selectedFile.name}

                    </h3>

                    <p>

                        {(selectedFile.size / 1024).toFixed(1)} KB

                    </p>

                    <button
                        type="button"
                        className="remove-btn"
                        onClick={(e) => {

                            e.preventDefault();

                            setSelectedFile(null);

                        }}
                    >

                        <X size={18} />

                        Remove File

                    </button>

                </div>

            )}

        </label>

    );

}