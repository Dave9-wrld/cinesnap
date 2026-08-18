'use client'
import React from 'react';

const Toast = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="toast-notification" role="status" aria-live="polite">
      <div className="toast-content">
        <span className="toast-message">{message}</span>
        <button
          onClick={onClose}
          className="toast-close-btn"
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Toast;
