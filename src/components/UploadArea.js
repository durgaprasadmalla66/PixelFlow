
import React, {
  useEffect,
  useRef,
  useState
} from "react";

const FILE_TYPES = {
  ".jpg": ["image/jpeg"],
  ".jpeg": ["image/jpeg"],
  ".png": ["image/png"],
  ".webp": ["image/webp"],
  ".gif": ["image/gif"],
  ".heic": ["image/heic"],
  ".heif": ["image/heif"],
  ".mp4": ["video/mp4"],
  ".webm": ["video/webm"],
  ".mov": ["video/quicktime"]
};

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export default function UploadArea({
  category,
  notify
}) {
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);
  const filesRef = useRef([]);
  const mountedRef = useRef(true);

  // Keep a reference to the current files.
  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  // Clean up preview URLs when leaving this category.
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      filesRef.current.forEach((item) => {
        URL.revokeObjectURL(item.preview);
      });
    };
  }, []);

  function showNotification(
    message,
    type = "success"
  ) {
    // Prevent the runtime error if a prop
    // is accidentally missing.
    if (typeof notify === "function") {
      notify(message, type);
    } else {
      console.warn(
        "PixelFlow notification unavailable:",
        message
      );
    }
  }

  function validateFile(file) {
    const extensionMatch =
      file.name.toLowerCase().match(/\.[^.]+$/);

    const extension = extensionMatch
      ? extensionMatch[0]
      : "";

    const allowedMimeTypes =
      FILE_TYPES[extension];

    if (
      !allowedMimeTypes ||
      !allowedMimeTypes.includes(file.type)
    ) {
      return "Unsupported file format";
    }

    if (file.size === 0) {
      return "Empty files are not allowed";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "File exceeds 50 MB";
    }

    return null;
  }

  function handleFiles(fileList) {
    if (!fileList || fileList.length === 0) {
      return;
    }

    const accepted = [];
    const rejected = [];

    Array.from(fileList).forEach((file) => {
      const error = validateFile(file);

      if (error) {
        rejected.push({
          name: file.name,
          reason: error
        });
        return;
      }

      const preview = URL.createObjectURL(file);

      accepted.push({
        id:
          typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random()}`,
        file,
        preview
      });
    });

    if (accepted.length > 0) {
      setFiles((previous) => [
        ...previous,
        ...accepted
      ]);
    }

    if (rejected.length > 0) {
      const first = rejected[0];

      showNotification(
        `${rejected.length} file(s) rejected. ${first.name}: ${first.reason}`,
        "error"
      );
    } else if (accepted.length > 0) {
      showNotification(
        `${accepted.length} valid file(s) added successfully.`,
        "success"
      );
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();

    setDragging(false);

    handleFiles(event.dataTransfer.files);
  }

  function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();

    setDragging(true);
  }

  function handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();

    if (
      !event.currentTarget.contains(
        event.relatedTarget
      )
    ) {
      setDragging(false);
    }
  }

  function removeFile(id) {
    const selected = files.find(
      (item) => item.id === id
    );

    if (selected) {
      URL.revokeObjectURL(selected.preview);
    }

    setFiles((previous) =>
      previous.filter((item) => item.id !== id)
    );

    showNotification(
      "File removed from selection."
    );
  }

  function handleUpload() {
    if (files.length === 0) {
      showNotification(
        "Please select at least one file.",
        "error"
      );
      return;
    }

    if (loading) {
      return;
    }

    setLoading(true);

    const count = files.length;

    setTimeout(() => {
      if (!mountedRef.current) {
        return;
      }

      setLoading(false);

      showNotification(
        `${count} file(s) validated for ${category}. Demo only — no server upload occurred.`,
        "success"
      );
    }, 900);
  }

  function formatFileSize(bytes) {
    return (
      bytes / (1024 * 1024)
    ).toFixed(2);
  }

  return (
    <div className="upload-panel">
      <div className="upload-panel-header">
        <div>
          <h3>Add to {category}</h3>

          <p>
            Choose your favorite shots
            and footage.
          </p>
        </div>

        <span className="file-count">
          {files.length} selected
        </span>
      </div>

      <div
        className={`drop-zone ${
          dragging ? "dragging" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="upload-icon">
          ⇧
        </div>

        <h3>
          Drag photos & videos here
        </h3>

        <p>
          Or browse files from your device
        </p>

        <button
          type="button"
          className="browse-button"
          onClick={() =>
            inputRef.current?.click()
          }
          disabled={loading}
        >
          Browse files
        </button>

        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          accept=".jpg,.jpeg,.png,.webp,.gif,.heic,.heif,.mp4,.webm,.mov"
          onChange={(event) => {
            handleFiles(event.target.files);

            // Allows selecting the same file again.
            event.target.value = "";
          }}
        />

        <small>
          JPG, PNG, WEBP, GIF, HEIC,
          HEIF, MP4, WEBM, MOV
          <br />
          Maximum 50 MB per file
        </small>
      </div>

      {files.length > 0 && (
        <div className="selected-files-section">
          <div className="selected-files-heading">
            <h3>Selected files</h3>

            <span>
              {files.length} ready
            </span>
          </div>

          <div className="file-preview-grid">
            {files.map((item) => (
              <div
                className="file-preview-card"
                key={item.id}
              >
                {item.file.type.startsWith(
                  "image/"
                ) ? (
                  <img
                    src={item.preview}
                    alt={item.file.name}
                  />
                ) : (
                  <div className="video-placeholder">
                    <span>▶</span>
                    <small>VIDEO</small>
                  </div>
                )}

                <button
                  type="button"
                  className="remove-file"
                  aria-label={`Remove ${item.file.name}`}
                  onClick={() =>
                    removeFile(item.id)
                  }
                  disabled={loading}
                >
                  ×
                </button>

                <div className="file-info">
                  <strong title={item.file.name}>
                    {item.file.name}
                  </strong>

                  <small>
                    {formatFileSize(
                      item.file.size
                    )} MB
                  </small>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="primary-button confirm-button"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Validating files...
              </>
            ) : (
              "✓ Confirm selection"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
