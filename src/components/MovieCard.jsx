import { useState, useRef } from 'react';
import { Play, Plus, ThumbsUp, ChevronDown } from 'lucide-react';
import { IMG_CDN } from '../utils/constants';

const MovieCard = ({ movie }) => {
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef(null);

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

    const getCardPosition = () => {
        if (cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            return {
                left: rect.left + rect.width / 2,
                top: rect.top + rect.height / 2
            };
        }
        return { left: 0, top: 0 };
    };

    return (
        <div
            ref={cardRef}
            className={`min-w-[250px] h-[140px] relative transition-transform duration-1000 ease-in-out ${
                isHovered ? 'z-[9999]' : 'z-0'
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="w-full h-full rounded-md overflow-hidden bg-gray-800">
                <img
                    src={imageUrl}
                    alt={movieData.title}
                    className="w-full h-full object-cover"
                />
            </div>

            {isHovered && (
                <div
                    className="fixed bg-gray-900 rounded-md shadow-xl border border-gray-700 p-3 transition-all duration-1000 ease-in-out"
                    style={{
                        width: '300px',
                        height: 'auto',
                        zIndex: 9999,
                        left: `${getCardPosition().left}px`,
                        top: `${getCardPosition().top}px`,
                        transform: 'translate(-50%, -50%)',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.8), 0 12px 24px rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.1)'
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
                        <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                            <Play className="w-4 h-4 text-black fill-black ml-0.5" />
                        </button>
                        <button className="w-8 h-8 border border-gray-400 rounded-full flex items-center justify-center hover:border-white transition-colors">
                            <Plus className="w-4 h-4 text-gray-400 hover:text-white" />
                        </button>
                        <button className="w-8 h-8 border border-gray-400 rounded-full flex items-center justify-center hover:border-white transition-colors">
                            <ThumbsUp className="w-4 h-4 text-gray-400 hover:text-white" />
                        </button>
                        <button className="w-8 h-8 border border-gray-400 rounded-full flex items-center justify-center hover:border-white ml-auto transition-colors">
                            <ChevronDown className="w-4 h-4 text-gray-400 hover:text-white" />
                        </button>
                    </div>
                    <h3 className="font-bold text-sm mb-1 text-white line-clamp-1">{movieData.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-300 mb-2">
                        <span className="text-green-400 font-semibold">
                            {Math.round(movieData.vote_average * 10)}% Match
                        </span>
                        <span>{movieData.release_date.split('-')[0]}</span>
                    </div>
                    <p className="text-xs text-gray-300 line-clamp-3">{movieData.overview}</p>
                </div>
            )}
        </div>
    );
};

export default MovieCard;