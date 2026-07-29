type Props = {
  open: boolean;
  content: string;
  onClose: () => void;
};

export default function ResumePreview({
  open,
  content,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="preview-modal">

        <div className="preview-header">
          <h2>📄 Resume Preview</h2>

          <button
            className="secondary-btn"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="preview-content">
          <pre>{content}</pre>
        </div>

      </div>
    </div>
  );
}