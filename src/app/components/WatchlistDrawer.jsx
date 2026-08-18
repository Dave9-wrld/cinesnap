'use client'
import React, { useEffect } from 'react';
import { IMAGE_BASE_URL } from '../api/tmdb';

const WatchlistDrawer = ({
  isOpen,
  onClose,
  watchlist,
  onRemoveFromWatchlist,
  onClearWatchlist,
  onSelectMovie,
  onPlayTrailer
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="watchlist-overlay" role="dialog" aria-modal="true" aria-label="Your Watchlist">
      <div className="watchlist-backdrop" onClick={onClose} aria-hidden="true" />

      <aside className="watchlist-drawer">
        {/* Drawer Header */}
        <div className="watchlist-header">
          <div className="watchlist-header-title-wrap">
            <span className="watchlist-icon">🔖</span>
            <div>
              <h2 className="watchlist-title">Your Watchlist</h2>
              <p className="watchlist-subtitle">
                {watchlist.length} {watchlist.length === 1 ? 'saved film' : 'saved films'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="watchlist-close-btn"
            aria-label="Close watchlist drawer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="watchlist-body">
          {watchlist.length === 0 ? (
            <div className="watchlist-empty">
              <div className="watchlist-empty-icon">🍿</div>
              <h3>Your watchlist is empty</h3>
              <p>Click the bookmark icon on any movie card or detail view to save films you want to watch later.</p>
              <button
                onClick={onClose}
                className="watchlist-browse-btn"
              >
                Browse Popular Movies
              </button>
            </div>
          ) : (
            <div className="watchlist-list">
              {watchlist.map((movie) => {
                const posterPath = movie.poster_path
                  ? `${IMAGE_BASE_URL}${movie.poster_path}`
                  : null;
                const year = movie.release_date?.slice(0, 4) || 'N/A';
                const rating = movie.vote_average?.toFixed(1) || 'N/A';

                return (
                  <div key={movie.id} className="watchlist-item">
                    <div
                      className="watchlist-item-poster"
                      onClick={() => {
                        onSelectMovie(movie);
                        onClose();
                      }}
                    >
                      {posterPath ? (
                        <img src={posterPath} alt={movie.title} />
                      ) : (
                        <div className="watchlist-item-fallback">🎬</div>
                      )}
                    </div>

                    <div className="watchlist-item-info">
                      <h4
                        className="watchlist-item-title"
                        onClick={() => {
                          onSelectMovie(movie);
                          onClose();
                        }}
                      >
                        {movie.title}
                      </h4>
                      <div className="watchlist-item-meta">
                        <span className="gold-text">★ {rating}</span>
                        <span>•</span>
                        <span>{year}</span>
                      </div>

                      <div className="watchlist-item-actions">
                        <button
                          onClick={() => {
                            onPlayTrailer(movie);
                            onClose();
                          }}
                          className="watchlist-play-btn"
                          title="Watch Trailer"
                        >
                          ▶ Trailer
                        </button>
                        <button
                          onClick={() => onRemoveFromWatchlist(movie.id)}
                          className="watchlist-remove-btn"
                          title="Remove from Watchlist"
                        >
                          ✕ Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {watchlist.length > 0 && (
          <div className="watchlist-footer">
            <button
              onClick={onClearWatchlist}
              className="watchlist-clear-all-btn"
            >
              Clear Entire Watchlist
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};

export default WatchlistDrawer;
