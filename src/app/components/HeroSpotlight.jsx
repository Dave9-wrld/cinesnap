'use client'
import React, { useState, useEffect } from 'react';
import { BACKDROP_BASE_URL, GENRE_MAP } from '../api/tmdb';

const HeroSpotlight = ({ movies, onPlayTrailer, onOpenDetails, onToggleWatchlist, isSaved }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const featured = movies?.slice(0, 6) || [];
  const currentMovie = featured[currentIndex];

  useEffect(() => {
    if (isHovered || featured.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [featured.length, isHovered]);

  if (!currentMovie) return null;

  const backdropUrl = currentMovie.backdrop_path
    ? `${BACKDROP_BASE_URL}${currentMovie.backdrop_path}`
    : currentMovie.poster_path
    ? `${BACKDROP_BASE_URL}${currentMovie.poster_path}`
    : null;

  const rating = currentMovie.vote_average?.toFixed(1);
  const releaseYear = currentMovie.release_date?.slice(0, 4) || 'N/A';
  const genres = currentMovie.genre_ids?.map((id) => GENRE_MAP[id]).filter(Boolean).slice(0, 3) || [];
  const saved = isSaved(currentMovie.id);

  return (
    <div 
      className="hero-spotlight-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Backdrop with cinematic layered gradients */}
      <div className="hero-spotlight-backdrop-wrapper">
        {backdropUrl && (
          <img
            key={currentMovie.id}
            src={backdropUrl}
            alt={currentMovie.title}
            className="hero-spotlight-backdrop-img"
          />
        )}
        <div className="hero-gradient-overlay" />
        <div className="hero-vignette-overlay" />
      </div>

      {/* Content Container */}
      <div className="hero-spotlight-content">
        <div className="hero-spotlight-badge-row">
          <span className="hero-spotlight-badge">
            <span className="hero-pulse-dot" />
            SPOTLIGHT FEATURE
          </span>
          <span className="hero-meta-pill rating-gold">★ {rating} TMDB</span>
          <span className="hero-meta-pill">{releaseYear}</span>
          {currentMovie.adult ? <span className="hero-meta-pill age-tag">18+</span> : <span className="hero-meta-pill age-tag">PG-13</span>}
        </div>

        <h1 className="hero-spotlight-title" title={currentMovie.title}>
          {currentMovie.title}
        </h1>

        {genres.length > 0 && (
          <div className="hero-genres-list">
            {genres.map((genre) => (
              <span key={genre} className="hero-genre-chip">
                {genre}
              </span>
            ))}
          </div>
        )}

        <p className="hero-spotlight-overview">
          {currentMovie.overview || "No overview available for this featured title. Discover the trailer and full details below."}
        </p>

        {/* Action Buttons */}
        <div className="hero-actions-row">
          <button
            onClick={() => onPlayTrailer(currentMovie)}
            className="hero-btn-primary"
            aria-label={`Watch trailer for ${currentMovie.title}`}
          >
            <svg className="hero-btn-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span>Watch Trailer</span>
          </button>

          <button
            onClick={() => onOpenDetails(currentMovie)}
            className="hero-btn-secondary"
            aria-label={`View movie details for ${currentMovie.title}`}
          >
            <svg className="hero-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            <span>Details & Cast</span>
          </button>

          <button
            onClick={() => onToggleWatchlist(currentMovie)}
            className={`hero-btn-icon-only ${saved ? 'active' : ''}`}
            title={saved ? "Remove from Watchlist" : "Add to Watchlist"}
            aria-label={saved ? "Remove from Watchlist" : "Add to Watchlist"}
          >
            <svg viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Slide Thumbnails / Indicators */}
      {featured.length > 1 && (
        <div className="hero-slides-selector">
          {featured.map((movie, index) => (
            <button
              key={movie.id}
              onClick={() => setCurrentIndex(index)}
              className={`hero-slide-thumb ${index === currentIndex ? 'active' : ''}`}
              title={movie.title}
              aria-label={`Go to slide ${index + 1}: ${movie.title}`}
            >
              <div className="hero-slide-thumb-bar" />
              <span className="hero-slide-thumb-title">{movie.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSpotlight;
