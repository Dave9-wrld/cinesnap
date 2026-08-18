'use client'
import React, { useEffect, useState } from "react";
import { fetchMovieTrailer, fetchPopularMovies, searchMovies } from "./api/tmdb";
import MovieGrid from "./components/MovieGrid";
import TrailerModal from "./components/TrailerModal";

const Page = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTrailerKey, setActiveTrailerKey] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPopular = async () => {
      setLoading(true);
      const data = await fetchPopularMovies();
      setMovies(data);
      setLoading(false);
    };
    loadPopular();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = await searchMovies(searchQuery);
    setMovies(data);
    setLoading(false);
  };

  const handleOpenTrailer = async (movie) => {
    setSelectedMovie(movie);
    const key = await fetchMovieTrailer(movie.id);
    if (key) {
      setActiveTrailerKey(key);
    } else {
      alert(`Sorry, no trailer is available for ${movie.title}`);
    }
  };

  const handleCloseTrailer = () => {
    setActiveTrailerKey(null);
    setSelectedMovie(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎬</span>
            <h1 className="text-xl font-bold text-white tracking-tight">CineScope</h1>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search Movies"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 sm:w-64 bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition"
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              Search
            </button>
          </form>
        </div>
      </header>

      <main>
        <section className="max-w-7xl mx-auto px-6 pt-12 pb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Discover and preview top movies
          </h2>
          <p className="text-zinc-400 text-base">
            Explore current ratings and releases
          </p>
        </section>

        {loading ? (
          <div className="text-center text-zinc-400 py-20">Loading movies...</div>
        ) : (
          <MovieGrid movies={movies} onSelectMovie={handleOpenTrailer} />
        )}
      </main>

      <TrailerModal
        trailerKey={activeTrailerKey}
        movieTitle={selectedMovie?.title}
        onClose={handleCloseTrailer}
      />
    </div>
  );
};

export default Page;