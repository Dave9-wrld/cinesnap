'use client'
import React from 'react';

const CATEGORIES = [
  { id: 'trending', label: '🔥 Trending', type: 'category' },
  { id: 'popular', label: '⚡ Popular', type: 'category' },
  { id: 'top_rated', label: '⭐ Top Rated', type: 'category' },
  { id: 'now_playing', label: '🎬 In Theaters', type: 'category' },
  { id: 'upcoming', label: '🚀 Upcoming', type: 'category' },
];

const POPULAR_GENRES = [
  { id: 28, label: 'Action' },
  { id: 878, label: 'Sci-Fi' },
  { id: 27, label: 'Horror' },
  { id: 35, label: 'Comedy' },
  { id: 18, label: 'Drama' },
  { id: 16, label: 'Animation' },
  { id: 53, label: 'Thriller' },
  { id: 12, label: 'Adventure' },
  { id: 14, label: 'Fantasy' },
  { id: 80, label: 'Crime' },
];

const FilterTabs = ({
  activeTab,
  onSelectTab,
  activeGenre,
  onSelectGenre,
  sortBy,
  onSelectSort,
  isSearching,
  searchQuery,
  onResetSearch
}) => {
  return (
    <div className="filters-wrapper">
      {/* Category Bar */}
      <div className="filter-categories-container">
        <div className="filter-scrollable-pills">
          {CATEGORIES.map((cat) => {
            const isActive = !isSearching && !activeGenre && activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectTab(cat.id)}
                className={`filter-pill-btn ${isActive ? 'active' : ''}`}
                aria-pressed={isActive}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Sort selector */}
        <div className="filter-sort-wrapper">
          <label htmlFor="sort-select" className="filter-sort-label">Sort by:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => onSelectSort(e.target.value)}
            className="filter-sort-select"
          >
            <option value="popularity.desc">Popularity</option>
            <option value="vote_average.desc">Rating (High to Low)</option>
            <option value="primary_release_date.desc">Release Date (Newest)</option>
          </select>
        </div>
      </div>

      {/* Genre Filter Bar */}
      <div className="filter-genres-container">
        <span className="filter-genre-label">GENRES:</span>
        <div className="filter-genres-scroll">
          <button
            onClick={() => onSelectGenre(null)}
            className={`filter-genre-pill ${!activeGenre && !isSearching ? 'active' : ''}`}
          >
            All Genres
          </button>
          {POPULAR_GENRES.map((g) => {
            const isSelected = activeGenre === g.id;
            return (
              <button
                key={g.id}
                onClick={() => onSelectGenre(g.id)}
                className={`filter-genre-pill ${isSelected ? 'active' : ''}`}
                aria-pressed={isSelected}
              >
                {g.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Searching status banner */}
      {isSearching && (
        <div className="filter-search-banner">
          <div className="filter-search-banner-info">
            <span>Showing search results for: <strong>"{searchQuery}"</strong></span>
          </div>
          <button
            onClick={onResetSearch}
            className="filter-search-clear-btn"
          >
            ✕ Clear Search
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterTabs;
