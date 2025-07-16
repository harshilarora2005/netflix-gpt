import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback, useRef } from "react";
import { appendRecommendedMovies, addSeenMovies } from "../utils/searchSlice";
import { getMovieRecommendations } from "../utils/gemini";
import useSearchMovies from "./hooks/useSearchMovie";
import MovieCard from "./MovieCard";

const MovieSuggestions = () => {
    const searchMovie = useSearchMovies();
    const dispatch = useDispatch();
    const movies = useSelector((store) => store.search?.recommendedMovies);
    const promptText = useSelector((store) => store.search?.promptText);
    const seenMovies = useSelector((store) => store.search?.movieNames);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const loadingRef = useRef(false);
    const observerRef = useRef(null);
    const sentinelRef = useRef(null);

    const loadMoreMovies = useCallback(async () => {
        if (loadingRef.current || !promptText) return;
        
        loadingRef.current = true;
        setIsLoading(true);
        setError(null);

        try {
            const response = await getMovieRecommendations(
                promptText + " but dont include these movies: " + seenMovies
            );
            const movieNames = response.split(',').map((m) => m.trim()).filter(Boolean);
            const promiseArray = movieNames.map((movie) => searchMovie(movie));
            const result = await Promise.all(promiseArray);
            const recommendedMovies = result.flat().filter(Boolean);
            dispatch(addSeenMovies(response));
            if (recommendedMovies.length > 0) {
                dispatch(appendRecommendedMovies(recommendedMovies));
            }
        } catch (err) {
            console.error("Error fetching movie recommendations:", err);
            setError("Failed to load more recommendations. Please try again.");
        } finally {
            setIsLoading(false);
            loadingRef.current = false;
        }
    }, [promptText, seenMovies, searchMovie, dispatch]);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '100px',
            threshold: 0.1
        };

        observerRef.current = new IntersectionObserver((entries) => {
            const target = entries[0];
            if (target.isIntersecting && !isLoading) {
                loadMoreMovies();
            }
        }, options);

        if (sentinelRef.current) {
            observerRef.current.observe(sentinelRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [loadMoreMovies, isLoading]);

    if (!movies || movies.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
                <div className="text-center p-8 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h5a1 1 0 011 1v1a1 1 0 01-1 1H2a1 1 0 01-1-1V5a1 1 0 011-1h5zM6 10v9a1 1 0 001 1h10a1 1 0 001-1v-9" />
                        </svg>
                    </div>
                    <h3 className="text-white text-xl font-semibold mb-2">No Recommendations Yet</h3>
                    <p className="text-gray-400 text-sm">Start exploring to get personalized movie suggestions</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-gray-800">
                <div className="px-4 py-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-1 h-8 bg-gradient-to-b from-red-500 to-pink-500 rounded-full"></div>
                            <h2 className="text-white text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text">
                                Recommended for You
                            </h2>
                        </div>
                        <p className="text-gray-400 text-sm ml-4">
                            Discover your next favorite movie • {movies.length} recommendations
                        </p>
                    </div>
                </div>
            </div>
            <div className="px-4 py-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                        {movies.map((movie, index) => (
                            <div
                                key={movie.id || index}
                                style={{
                                    animationDelay: `${index * 0.1}s`,
                                    animation: index < 20 ? 'fadeInUp 0.6s ease-out forwards' : 'none'
                                }}
                            >
                                <MovieCard movie={movie} />
                            </div>
                        ))}
                    </div>
                    {isLoading && (
                        <div className="flex justify-center items-center py-12">
                            <div className="flex items-center gap-3 bg-gray-800/50 backdrop-blur-sm px-6 py-4 rounded-full border border-gray-700">
                                <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-white font-medium">Loading more recommendations...</span>
                            </div>
                        </div>
                    )}
                    {error && (
                        <div className="flex justify-center py-8">
                            <div className="bg-red-900/20 border border-red-500/30 text-red-400 px-6 py-4 rounded-lg backdrop-blur-sm">
                                <p className="text-sm">{error}</p>
                                <button
                                    onClick={loadMoreMovies}
                                    className="mt-2 text-red-400 hover:text-red-300 underline text-sm"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}
                    <div
                        ref={sentinelRef}
                        className="h-4 w-full"
                        aria-hidden="true"
                    />
                </div>
            </div>
            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default MovieSuggestions;