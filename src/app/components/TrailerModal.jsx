import React from 'react'

const TrailerModal = ({trailerKey, movieTitle, onClose}) => {
    if (!trailerKey) return null;
  return (
    <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
    >
        <div 
            className="bg-zinc-900 rounded-2xl overflow-hidden max-w-3xl w-full relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
        >
            <button 
                onClick={onClose}
                className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-black/60 hover:bg-red-600 text-white rounded-full transition-colors"
            >
                ✕
            </button>

            <h2 className="text-white font-semibold text-lg p-4 pr-12 border-b border-zinc-800 ">
                {movieTitle} — Official Preview
            </h2>

            <div className="aspect-video w-full">
                <iframe 
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`} 
                    title={`${movieTitle} Trailer`} 
                    allow="autoplay; encrypted-media" 
                    frameBorder="0"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    </div>
  )
}

export default TrailerModal