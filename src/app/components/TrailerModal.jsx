'use client'
import React, { useEffect } from 'react'

const TrailerModal = ({ trailerKey, movieTitle, onClose }) => {
  // Prevent body scroll while modal open
  useEffect(() => {
    if (trailerKey) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [trailerKey]);

  if (!trailerKey) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Trailer for ${movieTitle}`}
    >
      {/* Backdrop click to close */}
      <div
        className="modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-icon" aria-hidden="true">🎬</div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div className="modal-title">{movieTitle}</div>
            <div className="modal-sub">Official Trailer Preview</div>
          </div>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close trailer"
            title="Close (Esc)"
          >
            ✕
          </button>
        </div>

        {/* Video */}
        <div className="modal-video">
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
            title={`${movieTitle} Official Trailer`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

export default TrailerModal