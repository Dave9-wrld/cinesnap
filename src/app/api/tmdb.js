const API_KEY = 'ded929e1ac7cb5ca5958738dc6854c54';
const BASE_URL = 'https://api.themoviedb.org/3';

export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w342';
export const POSTER_HD_URL = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w1280';
export const BACKDROP_FAST_URL = 'https://image.tmdb.org/t/p/w780';
export const PROFILE_BASE_URL = 'https://image.tmdb.org/t/p/w185';

export const GENRE_MAP = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western"
};

export const fetchTrendingMovies = async (timeWindow = 'day') => {
  try {
    const res = await fetch(`${BASE_URL}/trending/movie/${timeWindow}?api_key=${API_KEY}&language=en-US`);
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("fetchTrendingMovies error:", err);
    return [];
  }
};

export const fetchPopularMovies = async (page = 1) => {
  try {
    const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`);
    const data = await res.json();
    return { results: data.results || [], totalPages: data.total_pages || 1 };
  } catch (err) {
    console.error("fetchPopularMovies error:", err);
    return { results: [], totalPages: 1 };
  }
};

export const fetchTopRatedMovies = async (page = 1) => {
  try {
    const res = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`);
    const data = await res.json();
    return { results: data.results || [], totalPages: data.total_pages || 1 };
  } catch (err) {
    console.error("fetchTopRatedMovies error:", err);
    return { results: [], totalPages: 1 };
  }
};

export const fetchUpcomingMovies = async (page = 1) => {
  try {
    const res = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=${page}`);
    const data = await res.json();
    return { results: data.results || [], totalPages: data.total_pages || 1 };
  } catch (err) {
    console.error("fetchUpcomingMovies error:", err);
    return { results: [], totalPages: 1 };
  }
};

export const fetchNowPlayingMovies = async (page = 1) => {
  try {
    const res = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${page}`);
    const data = await res.json();
    return { results: data.results || [], totalPages: data.total_pages || 1 };
  } catch (err) {
    console.error("fetchNowPlayingMovies error:", err);
    return { results: [], totalPages: 1 };
  }
};

export const fetchGenres = async () => {
  try {
    const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
    const data = await res.json();
    return data.genres || [];
  } catch (err) {
    console.error("fetchGenres error:", err);
    return [];
  }
};

export const fetchMoviesByGenre = async (genreId, page = 1, sortBy = 'popularity.desc') => {
  try {
    const res = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=${sortBy}&with_genres=${genreId}&page=${page}&vote_count.gte=50`
    );
    const data = await res.json();
    return { results: data.results || [], totalPages: data.total_pages || 1 };
  } catch (err) {
    console.error("fetchMoviesByGenre error:", err);
    return { results: [], totalPages: 1 };
  }
};

export const searchMovies = async (query, page = 1) => {
  if (!query) return fetchPopularMovies(page);
  try {
    const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}`);
    const data = await res.json();
    return { results: data.results || [], totalPages: data.total_pages || 1 };
  } catch (err) {
    console.error("searchMovies error:", err);
    return { results: [], totalPages: 1 };
  }
};

export const fetchMovieDetails = async (movieId) => {
  try {
    const res = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US&append_to_response=videos,credits,similar,recommendations`
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("fetchMovieDetails error:", err);
    return null;
  }
};

export const fetchMovieTrailer = async (movieId) => {
  try {
    const res = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`);
    const data = await res.json();

    const videos = data.results?.filter((vid) => vid.site === 'YouTube') || [];

    const trailer =
      videos.find((vid) => vid.type === 'Trailer' && vid.official) ||
      videos.find((vid) => vid.type === 'Trailer') ||
      videos.find((vid) => vid.type === 'Teaser') ||
      videos[0];

    return trailer ? trailer.key : null;
  } catch (err) {
    console.error("fetchMovieTrailer error:", err);
    return null;
  }
};