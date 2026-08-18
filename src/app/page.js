'use client'
import React, { useEffect, useState, useCallback } from "react";
import {
  fetchTrendingMovies,
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchUpcomingMovies,
  fetchNowPlayingMovies,
  fetchMoviesByGenre,
  searchMovies,
  fetchMovieTrailer
} from "./api/tmdb";
import Navbar from "./components/Navbar";
import HeroSpotlight from "./components/HeroSpotlight";
import FilterTabs from "./components/FilterTabs";
import MovieGrid from "./components/MovieGrid";
import MovieDetailsModal from "./components/MovieDetailsModal";
import WatchlistDrawer from "./components/WatchlistDrawer";
import Toast from "./components/Toast";

const LOCAL_STORAGE_KEY = "cinescope_user_watchlist_v1";

export default function Page() {
  const [movies, setMovies] = useState([]);
  const [spotlightMovies, setSpotlightMovies] = useState([]);
  const [activeTab, setActiveTab] = useState("trending");
  const [activeGenre, setActiveGenre] = useState(null);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Modals & Drawers
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [activeTrailerKey, setActiveTrailerKey] = useState(null);
  const [modalInitialTab, setModalInitialTab] = useState('trailer');
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [watchlist, setWatchlist] = useState([]);

  // Toast
  const [toastMessage, setToastMessage] = useState(null);

  // Load Watchlist from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setWatchlist(JSON.parse(saved));
      }
    } catch (err) {
      console.error("Failed to load watchlist from localStorage", err);
    }
  }, []);

  // Save Watchlist to localStorage
  const updateWatchlist = (newList) => {
    setWatchlist(newList);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newList));
    } catch (err) {
      console.error("Failed to save watchlist", err);
    }
  };

  const toggleWatchlist = (movie) => {
    if (!movie) return;
    const exists = watchlist.some((m) => m.id === movie.id);
    let updated;
    if (exists) {
      updated = watchlist.filter((m) => m.id !== movie.id);
    } else {
      updated = [
        {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
          overview: movie.overview,
          genre_ids: movie.genre_ids
        },
        ...watchlist
      ];
    }
    updateWatchlist(updated);
  };

  const isSaved = (movieId) => {
    return watchlist.some((m) => m.id === movieId);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  // Initial load: Spotlight trending movies + initial catalog
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      const trending = await fetchTrendingMovies('day');
      setSpotlightMovies(trending);
      setMovies(trending);
      setTotalPages(10);
      setLoading(false);
    };
    initData();
  }, []);

  // Fetch movies based on current filters and page
  const fetchMovieCatalog = useCallback(async (tab, genre, query, pageNum, sortVal, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      let data = { results: [], totalPages: 1 };

      if (query && query.trim()) {
        data = await searchMovies(query.trim(), pageNum);
      } else if (genre) {
        data = await fetchMoviesByGenre(genre, pageNum, sortVal);
      } else {
        switch (tab) {
          case 'trending': {
            if (pageNum === 1) {
              const trendResults = await fetchTrendingMovies('day');
              data = { results: trendResults, totalPages: 10 };
            } else {
              data = await fetchPopularMovies(pageNum);
            }
            break;
          }
          case 'popular':
            data = await fetchPopularMovies(pageNum);
            break;
          case 'top_rated':
            data = await fetchTopRatedMovies(pageNum);
            break;
          case 'now_playing':
            data = await fetchNowPlayingMovies(pageNum);
            break;
          case 'upcoming':
            data = await fetchUpcomingMovies(pageNum);
            break;
          default:
            data = await fetchPopularMovies(pageNum);
        }
      }

      if (append) {
        setMovies((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const newUnique = data.results.filter((m) => !existingIds.has(m.id));
          return [...prev, ...newUnique];
        });
      } else {
        setMovies(data.results);
      }
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch catalog:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Handle Tab Switch
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setActiveGenre(null);
    setIsSearching(false);
    setSearchQuery("");
    setCurrentPage(1);
    fetchMovieCatalog(tabId, null, "", 1, sortBy, false);
  };

  // Handle Genre Switch
  const handleGenreChange = (genreId) => {
    setActiveGenre(genreId);
    setIsSearching(false);
    setSearchQuery("");
    setCurrentPage(1);
    fetchMovieCatalog(activeTab, genreId, "", 1, sortBy, false);
  };

  // Handle Sort Change
  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
    fetchMovieCatalog(activeTab, activeGenre, searchQuery, 1, newSort, false);
  };

  // Handle Search Submission
  const handleSearchSubmit = (query) => {
    if (!query || !query.trim()) {
      handleResetSearch();
      return;
    }
    setIsSearching(true);
    setCurrentPage(1);
    fetchMovieCatalog(activeTab, activeGenre, query, 1, sortBy, false);
  };

  // Reset Search
  const handleResetSearch = () => {
    setIsSearching(false);
    setSearchQuery("");
    setCurrentPage(1);
    fetchMovieCatalog(activeTab, activeGenre, "", 1, sortBy, false);
  };

  // Load More Pages
  const handleLoadMore = () => {
    if (loadingMore || currentPage >= totalPages) return;
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchMovieCatalog(activeTab, activeGenre, isSearching ? searchQuery : "", nextPage, sortBy, true);
  };

  // Open Details Modal (tab: overview)
  const handleOpenDetails = (movie) => {
    setSelectedMovie(movie);
    setActiveTrailerKey(null);
    setModalInitialTab('overview');
  };

  // Play Trailer Directly (tab: trailer)
  const handlePlayTrailer = async (movie) => {
    setSelectedMovie(movie);
    setModalInitialTab('trailer');
    try {
      const key = await fetchMovieTrailer(movie.id);
      if (key) {
        setActiveTrailerKey(key);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
    setActiveTrailerKey(null);
  };

  // Reset to Home
  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveTab("trending");
    setActiveGenre(null);
    setIsSearching(false);
    setSearchQuery("");
    setCurrentPage(1);
    fetchMovieCatalog("trending", null, "", 1, "popularity.desc", false);
  };

  return (
    <div className="app-shell">
      {/* Navigation Header */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        watchlistCount={watchlist.length}
        onLogoClick={handleLogoClick}
      />

      {/* Hero Spotlight Billboard (shown when not searching) */}
      {!isSearching && (
        <HeroSpotlight
          movies={spotlightMovies}
          onPlayTrailer={handlePlayTrailer}
          onOpenDetails={handleOpenDetails}
          onToggleWatchlist={toggleWatchlist}
          isSaved={isSaved}
        />
      )}

      {/* Main Catalog Container */}
      <main className="main-content-container">
        {/* Filter Navigation Bar */}
        <FilterTabs
          activeTab={activeTab}
          onSelectTab={handleTabChange}
          activeGenre={activeGenre}
          onSelectGenre={handleGenreChange}
          sortBy={sortBy}
          onSelectSort={handleSortChange}
          isSearching={isSearching}
          searchQuery={searchQuery}
          onResetSearch={handleResetSearch}
        />

        {/* Movies Grid */}
        <MovieGrid
          movies={movies}
          onSelectMovie={handlePlayTrailer}
          onPlayTrailer={handlePlayTrailer}
          onToggleWatchlist={toggleWatchlist}
          isSaved={isSaved}
          loading={loading}
          loadingMore={loadingMore}
          onLoadMore={handleLoadMore}
          hasMore={currentPage < totalPages}
          onShowToast={showToast}
        />
      </main>

      {/* Premium Footer */}
      <footer className="footer-extended">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-emoji">🎬</span>
              <span className="logo-text">CINE<span className="logo-accent">SCOPE</span></span>
            </div>
            <p className="footer-desc">
              Your ultimate gateway to discover movies, preview official cinema trailers, and build your personalized watchlist.
            </p>
          </div>

          <div className="footer-links-group">
            <div className="footer-col">
              <h4>Explore</h4>
              <ul>
                <li><button onClick={() => handleTabChange('trending')}>Trending Today</button></li>
                <li><button onClick={() => handleTabChange('top_rated')}>Top Rated Classics</button></li>
                <li><button onClick={() => handleTabChange('now_playing')}>Now in Theaters</button></li>
                <li><button onClick={() => handleTabChange('upcoming')}>Upcoming Releases</button></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Genres</h4>
              <ul>
                <li><button onClick={() => handleGenreChange(28)}>Action & Adventure</button></li>
                <li><button onClick={() => handleGenreChange(878)}>Sci-Fi & Cyberpunk</button></li>
                <li><button onClick={() => handleGenreChange(27)}>Horror & Thrillers</button></li>
                <li><button onClick={() => handleGenreChange(35)}>Comedy & Laughs</button></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Features</h4>
              <ul>
                <li><button onClick={() => setIsWatchlistOpen(true)}>Saved Watchlist</button></li>
                <li><button onClick={() => handlePlayTrailer(spotlightMovies[0] || movies[0])}>Watch Latest Trailer</button></li>
                <li><a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">TMDB Database</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} CineScope. Built for cinema lovers worldwide. Powered by TMDB API.</p>
        </div>
      </footer>

      {/* Movie Details & Trailer Theater Modal */}
      {selectedMovie && (
        <MovieDetailsModal
          movie={selectedMovie}
          initialTrailerKey={activeTrailerKey}
          initialTab={modalInitialTab}
          onClose={handleCloseModal}
          onToggleWatchlist={toggleWatchlist}
          isSaved={isSaved}
          onSelectMovie={handlePlayTrailer}
          onShowToast={showToast}
        />
      )}

      {/* Saved Watchlist Side Drawer */}
      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlist={watchlist}
        onRemoveFromWatchlist={(id) => {
          updateWatchlist(watchlist.filter((m) => m.id !== id));
          showToast("Film removed from watchlist");
        }}
        onClearWatchlist={() => {
          updateWatchlist([]);
          showToast("Watchlist cleared");
        }}
        onSelectMovie={handlePlayTrailer}
        onPlayTrailer={handlePlayTrailer}
      />

      {/* Floating Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}