import { useState } from 'react';
import { Play, Plus, ThumbsUp, ChevronDown } from 'lucide-react';
import { IMG_CDN } from '../utils/constants';
const MovieCard = ({ movie }) => {
    const [isHovered, setIsHovered] = useState(false);

    const movieData = {
        id: movie?.id || 1,
        title: movie?.original_title || movie?.title || 'Unknown Title',
        backdrop_path: movie?.backdrop_path || movie?.poster_path,
        overview: movie?.overview || 'Movie description goes here...',
        vote_average: movie?.vote_average || 8.5,
        release_date: movie?.release_date || movie?.first_air_date || '2024'
    };

    const imageUrl = movieData.backdrop_path
        ? IMG_CDN + movieData.backdrop_path
        : `https://via.placeholder.com/300x169/1f1f1f/ffffff?text=${encodeURIComponent(movieData.title)}`;

    return (
        <div
        className={`min-w-[250px] h-[140px] relative transition-transform duration-300 ${
        isHovered ? 'z-50 scale-110' : 'z-0 scale-100'
    }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ perspective: '1000px' }} 
        >
        {/* Base image */}
        <div className="w-full h-full rounded-md overflow-hidden bg-gray-800">
            <img
            src={imageUrl}
            alt={movieData.title}
            className="w-full h-full object-cover"
            />
        </div>

        {/* Hover Card */}
        {isHovered && (
            <div
            className="absolute z-50 bg-gray-900 rounded-md shadow-xl border border-gray-700 p-3 transition-transform duration-300"
            style={{
                width: '250px',
                height: 'auto',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) scale(1.4)',
                transformOrigin: 'center center',
                boxShadow:
                '0 10px 20px rgba(0,0,0,0.6), 0 6px 6px rgba(0,0,0,0.3)'
            }}
            >
            <div className="w-full h-[140px] rounded overflow-hidden mb-3">
                <img
                src={imageUrl}
                alt={movieData.title}
                className="w-full h-full object-cover"
                />
            </div>
            <div className="flex items-center gap-2 mb-2">
                <button className="w-7 h-7 bg-white rounded-full flex items-center justify-center hover:bg-gray-200">
                <Play className="w-3 h-3 text-black fill-black ml-0.5" />
                </button>
                <button className="w-7 h-7 border border-gray-400 rounded-full flex items-center justify-center hover:border-white">
                <Plus className="w-3 h-3 text-gray-400 hover:text-white" />
                </button>
                <button className="w-7 h-7 border border-gray-400 rounded-full flex items-center justify-center hover:border-white">
                <ThumbsUp className="w-3 h-3 text-gray-400 hover:text-white" />
                </button>
                <button className="w-7 h-7 border border-gray-400 rounded-full flex items-center justify-center hover:border-white ml-auto">
                <ChevronDown className="w-3 h-3 text-gray-400 hover:text-white" />
                </button>
            </div>
            <h3 className="font-bold text-sm mb-1 line-clamp-1">{movieData.title}</h3>
            <div className="flex items-center gap-2 text-xs text-gray-300 mb-1">
                <span className="text-green-400 font-semibold">
                {Math.round(movieData.vote_average * 10)}% Match
                </span>
                <span>{movieData.release_date.split('-')[0]}</span>
            </div>
            <p className="text-xs text-gray-300 line-clamp-2">{movieData.overview}</p>
            </div>
        )}
        </div>
    );
};

export default MovieCard;
