'use client'
import React, { useState, useEffect } from 'react';
import { fetchMovieDetails, fetchMovieTrailer, PROFILE_BASE_URL, IMAGE_BASE_URL } from '../api/tmdb';

const MovieDetailsModal = ({
  movie,
  initialTrailerKey,
  initialTab = 'trailer',
  onClose,
  onToggleWatchlist,
  isSaved,
  onSelectMovie,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [details, setDetails] = useState(null);
  const [trailerKey, setTrailerKey] = useState(initialTrailerKey || null);
  const [loadingTrailer, setLoadingTrailer] = useState(!initialTrailerKey);
  const [loadingDetails, setLoadingDetails] = useState(true);

  const movieId = movie?.id;

  // Sync when initialTrailerKey prop updates from parent
  useEffect(() => {
    if (initialTrailerKey) {
      setTrailerKey(initialTrailerKey);
      setLoadingTrailer(false);
    }
  }, [initialTrailerKey]);

  // Sync initial tab when changed
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Fetch Trailer & Movie Details
  useEffect(() => {
    if (!movieId) return;
    document.body.style.overflow = 'hidden';

    let isMounted = true;

    const loadAll = async () => {
      // 1. Fetch Trailer if not already provided
      if (!initialTrailerKey) {
        setLoadingTrailer(true);
        try {
          const key = await fetchMovieTrailer(movieId);
          if (isMounted) {
            setTrailerKey(key);
            setLoadingTrailer(false);
          }
        } catch (err) {
          console.error("Error fetching trailer:", err);
          if (isMounted) setLoadingTrailer(false);
        }
      }

      // 2. Fetch Full Details (Credits, Recommendations, Runtime, Tagline)
      setLoadingDetails(true);
      try {
        const fullData = await fetchMovieDetails(movieId);
        if (isMounted) {
          setDetails(fullData);
          // Fallback check: if trailerKey is still not found, check fullData videos
          if (!trailerKey && fullData?.videos?.results) {
            const vids = fullData.videos.results.filter(v => v.site === 'YouTube');
            const found =
              vids.find(v => v.type === 'Trailer' && v.official) ||
              vids.find(v => v.type === 'Trailer') ||
              vids.find(v => v.type === 'Teaser') ||
              vids[0];
            if (found) setTrailerKey(found.key);
          }
        }
      } catch (err) {
        console.error("Error fetching details:", err);
      } finally {
        if (isMounted) setLoadingDetails(false);
      }
    };

    loadAll();

    return () => {
      isMounted = false;
      document.body.style.overflow = '';
    };
  }, [movieId, initialTrailerKey]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!movie) return null;

  const saved = isSaved(movie.id);
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const releaseYear = movie.release_date ? movie.release_date.slice(0, 4) : 'N/A';
  const runtime = details?.runtime ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m` : null;
  const cast = details?.credits?.cast?.slice(0, 10) || [];
  const similar = details?.recommendations?.results?.slice(0, 6) || details?.similar?.results?.slice(0, 6) || [];

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      onShowToast?.("✨ Link copied to clipboard!");
    } else {
      onShowToast?.("Movie link saved.");
    }
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${movie.title}`}
    >
      <div className="modal-backdrop" onClick={onClose} aria-hidden="true" />

      <div className="modal-container-extended">
        {/* Modal Header Bar */}
        <div className="modal-header-extended">
          <div className="modal-title-box">
            <div className="modal-badge-pill">OFFICIAL CINEMA PREVIEW</div>
            <h2 className="modal-header-title">{movie.title}</h2>
            <div className="modal-header-meta">
              <span className="gold-text">★ {rating}</span>
              <span>•</span>
              <span>{releaseYear}</span>
              {runtime && (
                <>
                  <span>•</span>
                  <span>{runtime}</span>
                </>
              )}
              {details?.genres && (
                <>
                  <span>•</span>
                  <span className="modal-genres-text">
                    {details.genres.map(g => g.name).slice(0, 3).join(', ')}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="modal-header-actions">
            <button
              onClick={() => {
                onToggleWatchlist(movie);
                onShowToast?.(saved ? "Removed from Watchlist" : "Added to Watchlist ❤️");
              }}
              className={`modal-action-btn ${saved ? 'active-saved' : ''}`}
              title={saved ? "Remove from Watchlist" : "Save to Watchlist"}
            >
              <svg viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              <span className="hide-mobile">{saved ? "In Watchlist" : "Watchlist"}</span>
            </button>

            <button
              onClick={handleShare}
              className="modal-action-btn"
              title="Share Movie"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              <span className="hide-mobile">Share</span>
            </button>

            <button
              onClick={onClose}
              className="modal-close-btn"
              aria-label="Close modal"
              title="Close (Esc)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="modal-tabs-nav">
          <button
            onClick={() => setActiveTab('trailer')}
            className={`modal-tab-btn ${activeTab === 'trailer' ? 'active' : ''}`}
          >
            🎬 Watch Trailer
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`modal-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          >
            📖 Story & Info
          </button>
          <button
            onClick={() => setActiveTab('cast')}
            className={`modal-tab-btn ${activeTab === 'cast' ? 'active' : ''}`}
          >
            👥 Cast & Crew {cast.length > 0 && `(${cast.length})`}
          </button>
          {similar.length > 0 && (
            <button
              onClick={() => setActiveTab('similar')}
              className={`modal-tab-btn ${activeTab === 'similar' ? 'active' : ''}`}
            >
              🍿 More Like This
            </button>
          )}
        </div>

        {/* Tab Content Panels */}
        <div className="modal-body-content">
          {/* TAB 1: Trailer Player */}
          {activeTab === 'trailer' && (
            <div className="modal-tab-pane">
              {loadingTrailer ? (
                <div className="modal-loading-trailer-box">
                  <div className="loading-spinner-large" />
                  <p>Loading official trailer...</p>
                </div>
              ) : trailerKey ? (
                <div className="modal-video-aspect">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
                    title={`${movie.title} Trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="modal-iframe"
                  />
                </div>
              ) : (
                <div className="modal-no-trailer-box">
                  <div className="modal-no-trailer-icon">🎥</div>
                  <h3>No trailer is available for this title</h3>
                  <p>Check the storyline synopsis and top cast in the tabs above.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Story & Overview */}
          {activeTab === 'overview' && (
            <div className="modal-tab-pane modal-overview-layout">
              <div className="modal-overview-left">
                {movie.poster_path ? (
                  <img
                    src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                    alt={movie.title}
                    className="modal-overview-poster"
                  />
                ) : (
                  <div className="modal-overview-poster-fallback">🎬</div>
                )}
              </div>

              <div className="modal-overview-right">
                {details?.tagline && (
                  <p className="modal-tagline">"{details.tagline}"</p>
                )}

                <h3 className="modal-section-heading">Synopsis</h3>
                <p className="modal-synopsis-text">
                  {movie.overview || details?.overview || "No synopsis available for this title."}
                </p>

                <div className="modal-stats-grid">
                  <div className="modal-stat-card">
                    <span className="modal-stat-label">User Rating</span>
                    <span className="modal-stat-value gold-text">★ {rating} / 10</span>
                    <span className="modal-stat-sub">({details?.vote_count?.toLocaleString() || '1,000+'} votes)</span>
                  </div>

                  <div className="modal-stat-card">
                    <span className="modal-stat-label">Release Date</span>
                    <span className="modal-stat-value">{movie.release_date || 'TBA'}</span>
                  </div>

                  <div className="modal-stat-card">
                    <span className="modal-stat-label">Original Language</span>
                    <span className="modal-stat-value">{details?.original_language?.toUpperCase() || 'EN'}</span>
                  </div>

                  <div className="modal-stat-card">
                    <span className="modal-stat-label">Status</span>
                    <span className="modal-stat-value">{details?.status || 'Released'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Cast & Crew */}
          {activeTab === 'cast' && (
            <div className="modal-tab-pane">
              {loadingDetails ? (
                <div className="modal-loading-trailer-box">
                  <div className="loading-spinner-large" />
                  <p>Loading cast information...</p>
                </div>
              ) : cast.length === 0 ? (
                <p className="text-zinc-400 text-center py-10">No cast information available.</p>
              ) : (
                <div className="modal-cast-grid">
                  {cast.map((actor) => (
                    <div key={actor.id} className="modal-cast-card">
                      <div className="modal-cast-avatar">
                        {actor.profile_path ? (
                          <img
                            src={`${PROFILE_BASE_URL}${actor.profile_path}`}
                            alt={actor.name}
                            className="modal-cast-img"
                          />
                        ) : (
                          <div className="modal-cast-fallback">👤</div>
                        )}
                      </div>
                      <div className="modal-cast-info">
                        <p className="modal-cast-name">{actor.name}</p>
                        <p className="modal-cast-character">{actor.character || 'Actor'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Similar Titles */}
          {activeTab === 'similar' && (
            <div className="modal-tab-pane">
              <div className="modal-similar-grid">
                {similar.map((simMovie) => (
                  <div
                    key={simMovie.id}
                    className="modal-similar-card"
                    onClick={() => {
                      onSelectMovie(simMovie);
                    }}
                  >
                    <div className="modal-similar-poster">
                      {simMovie.poster_path ? (
                        <img
                          src={`${IMAGE_BASE_URL}${simMovie.poster_path}`}
                          alt={simMovie.title}
                          className="modal-similar-img"
                        />
                      ) : (
                        <div className="modal-similar-fallback">🎬</div>
                      )}
                      <span className="modal-similar-rating">★ {simMovie.vote_average?.toFixed(1)}</span>
                    </div>
                    <p className="modal-similar-title">{simMovie.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsModal;
