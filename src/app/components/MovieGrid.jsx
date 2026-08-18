'use client'
import React, { useState } from 'react';
import { IMAGE_BASE_URL, GENRE_MAP } from '../api/tmdb';

const SKELETON_COUNT = 12;

const SkeletonCard = () => (
  <div className="skeleton-card" aria-hidden="true">
    <div className="skeleton-poster" />
    <div className="skeleton-info">
      <div className="skeleton-line" style={{ width: '80%' }} />
      <div className="skeleton-line" style={{ width: '45%' }} />
      <div className="skeleton-line" style={{ width: '100%', height: 32, borderRadius: 8, marginTop: 6 }} />
    </div>
  </div>
);

const FastImage = ({ src, alt, isPriority }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="fast-image-wrapper">
      {!loaded && <div className="fast-image-shimmer" />}
      <img
        src={src}
        alt={alt}
        className={`card-image ${loaded ? 'loaded' : 'loading'}`}
        loading={isPriority ? "eager" : "lazy"}
        fetchPriority={isPriority ? "high" : "auto"}
        decoding="async"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};

const MovieGrid = ({
  movies,
  onSelectMovie,
  onPlayTrailer,
  onToggleWatchlist,
  isSaved,
  loading,
  loadingMore,
  onLoadMore,
  hasMore,
  onShowToast
}) => {
  if (loading) {
    return (
      <div className="movie-grid" aria-label="Loading movies" aria-busy="true">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="empty-state" role="status">
        <div className="empty-icon" aria-hidden="true">🎭</div>
        <h3 className="empty-title">No films found</h3>
        <p className="empty-sub">Try searching for another movie title, actor, or browse genres.</p>
      </div>
    );
  }

  return (
    <>
      <div className="movie-grid" role="list" aria-label="Movie catalog">
        {movies.map((movie, index) => {
          const posterPath = movie.poster_path
            ? `${IMAGE_BASE_URL}${movie.poster_path}`
            : null;

          const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
          const year = movie.release_date ? movie.release_date.slice(0, 4) : 'N/A';
          const saved = isSaved(movie.id);
          const primaryGenre = movie.genre_ids && movie.genre_ids[0] ? GENRE_MAP[movie.genre_ids[0]] : null;
          const isPriority = index < 6;

          return (
            <article
              key={movie.id}
              className="movie-card"
              role="listitem"
              onClick={() => onSelectMovie(movie)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectMovie(movie);
                }
              }}
              aria-label={`${movie.title} (${year})`}
            >
              {/* Poster Container */}
              <div className="movie-poster">
                {posterPath ? (
                  <FastImage
                    src={posterPath}
                    alt={`${movie.title} poster`}
                    isPriority={isPriority}
                  />
                ) : (
                  <div className="no-poster-placeholder">
                    <span className="no-poster-icon">🎬</span>
                    <span className="no-poster-text">No Poster</span>
                  </div>
                )}

                {/* Rating Badge */}
                {rating !== 'N/A' && (
                  <div className="rating-badge" aria-label={`Rating: ${rating} out of 10`}>
                    <span className="rating-star">★</span>
                    <span>{rating}</span>
                  </div>
                )}

                {/* Bookmark Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWatchlist(movie);
                    onShowToast?.(saved ? "Removed from Watchlist" : "Added to Watchlist ❤️");
                  }}
                  className={`card-bookmark-btn ${saved ? 'active' : ''}`}
                  title={saved ? "Remove from Watchlist" : "Add to Watchlist"}
                  aria-label={saved ? `Remove ${movie.title} from Watchlist` : `Add ${movie.title} to Watchlist`}
                >
                  <svg viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                </button>

                {/* Hover overlay with Quick Play */}
                <div className="card-overlay" aria-hidden="true">
                  <div className="play-btn-overlay">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <span className="card-hover-preview-text">Preview Film</span>
                </div>
              </div>

              {/* Card Meta & Info */}
              <div className="card-info">
                <div className="card-header-line">
                  <h3 className="card-title" title={movie.title}>
                    {movie.title}
                  </h3>
                </div>

                <div className="card-meta">
                  <span className="card-year">{year}</span>
                  {primaryGenre && (
                    <span className="card-genre-tag">{primaryGenre}</span>
                  )}
                </div>

                <div className="card-actions-row">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayTrailer(movie);
                    }}
                    className="watch-btn"
                    aria-label={`Watch official trailer for ${movie.title}`}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <span>Trailer</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectMovie(movie);
                    }}
                    className="info-btn"
                    title="Movie details & cast"
                    aria-label={`More info about ${movie.title}`}
                  >
                    ℹ
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Load More Pagination */}
      {hasMore && !loading && (
        <div className="load-more-container">
          <button
            onClick={onLoadMore}
            disabled={loadingMore}
            className="load-more-btn"
          >
            {loadingMore ? (
              <span className="loading-spinner-inline" />
            ) : (
              <span>Load More Titles ↓</span>
            )}
          </button>
        </div>
      )}
    </>
  );
};

export default MovieGrid;