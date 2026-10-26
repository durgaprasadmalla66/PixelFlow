
import React, { useEffect } from "react";

export default function Toast({
  message,
  type = "success",
  onClose
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`toast ${type}`}
      role={type === "error" ? "alert" : "status"}
    >
      <span>{message}</span>

      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
}
