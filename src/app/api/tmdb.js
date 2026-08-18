const API_KEY = 'ded929e1ac7cb5ca5958738dc6854c54'
const BASE_URL = 'https://api.themoviedb.org/3'

export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

export const fetchPopularMovies = async () => {
    const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
    const data = await res.json();
    return data.results || [];
};

export const searchMovies = async (query) => {
    if (!query) return fetchPopularMovies();
    const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data.results || [];
};

export const fetchMovieTrailer = async (movieId) => {
    const res = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`);
    const data = await res.json();

    const videos = data.results?.filter((vid) => vid.site === 'YouTube') || [];

    const trailer =
        videos.find((vid) => vid.type === 'Trailer' && vid.official) ||
        videos.find((vid) => vid.type === 'Trailer') ||
        videos.find((vid) => vid.type === 'Teaser');

    return trailer ? trailer.key : null;
};