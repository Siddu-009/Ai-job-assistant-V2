type Props = {
    open: boolean;
    onClose: () => void;
    onDownload: () => void;
};

export default function SuccessModal({
    open,
    onClose,
    onDownload
}: Props) {

    if (!open) return null;

    return (

        <div className="modal-overlay">

            <div className="success-modal">

                <div className="success-icon">

                    ✅

                </div>

                <h2>

                    Resume Generated Successfully

                </h2>

                <p>

                    Your ATS optimized resume is ready.

                </p>

                <div className="modal-buttons">

                    <button
                        className="download-btn"
                        onClick={onDownload}
                    >
                        ⬇ Download Resume
                    </button>

                    <button
                        className="secondary-btn"
                        onClick={onClose}
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>

    );

}