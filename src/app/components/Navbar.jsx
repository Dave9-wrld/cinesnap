'use client'
import React, { useState, useEffect, useRef } from 'react';

const Navbar = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onOpenWatchlist,
  watchlistCount,
  onLogoClick
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-inner">
        {/* Top bar row for mobile / integrated flex for desktop */}
        <div className="navbar-top-row">
          {/* Brand Logo */}
          <div
            onClick={onLogoClick}
            className="logo"
            role="button"
            tabIndex={0}
            aria-label="CineScope Home"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onLogoClick();
            }}
          >
            <div className="logo-icon-glow">
              <span className="logo-emoji">🎬</span>
            </div>
            <div className="logo-text-group">
              <span className="logo-text">CINE<span className="logo-accent">SCOPE</span></span>
              <span className="logo-tagline">ULTRA HD</span>
            </div>
          </div>

          {/* Watchlist Navigation Trigger */}
          <div className="navbar-actions">
            <button
              onClick={onOpenWatchlist}
              className="navbar-watchlist-btn"
              title="Open Watchlist"
              aria-label={`Open Watchlist (${watchlistCount} items)`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              <span className="hide-mobile">Watchlist</span>
              {watchlistCount > 0 && (
                <span className="navbar-watchlist-badge">{watchlistCount}</span>
              )}
            </button>
          </div>
        </div>

        {/* Global Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearchSubmit(searchQuery);
          }}
          className="search-form"
          role="search"
        >
          <div className="search-input-wrap">
            <span className="search-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              ref={inputRef}
              type="search"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
              aria-label="Search movies"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="search-clear-btn"
                aria-label="Clear search query"
              >
                ✕
              </button>
            )}
          </div>
          <button type="submit" className="search-btn">
            Search
          </button>
        </form>
      </div>
    </header>
  );
};

export default Navbar;
