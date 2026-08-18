import React from 'react'
import {IMAGE_BASE_URL} from '../api/tmdb'

const MovieGrid = ({movies, onSelectMovie}) => {
    if (!movies || movies.length === 0){
        return (
            <p className="text-center text-zinc-400 mt-12 text-lg">
                No movies found. Try searching for something else.
            </p>
        )
    }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 p-6">
        {movies.map((movie) => {
            const posterPath = movie.poster_path 
                ? `${IMAGE_BASE_URL}${movie.poster_path}` 
                : 'https://via.placeholder.com/500x750?text=No+Poster';

            return(
                <div 
                    key={movie.id} 
                    className="group relative bg-zinc-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1 transition-all duration-300"
                >
                    <div className="relative aspect-[2/3] overflow-hidden">
                         <img 
                            src={posterPath} 
                            alt={movie.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                         />
                         <span className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-yellow-400 text-xs font-semibold px-2 py-1 rounded-full">
                            ★ {movie.vote_average?.toFixed(1)}
                         </span>
                     </div>

                     <div className="p-3 flex flex-col gap-2">
                        <div>
                            <h1 className="text-white font-semibold text-sm truncate">{movie.title}</h1>
                            <p className="text-zinc-400 text-xs">{movie.release_date?.slice(0, 4) || 'N/A'}</p>
                        </div>

                        <button 
                            onClick={() => onSelectMovie(movie)}
                            className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-medium py-2 rounded-lg transition-colors"
                        >
                            Watch Trailer
                        </button>
                     </div>
                </div>
            )
        })}
    </div>
  )
}

export default MovieGrid