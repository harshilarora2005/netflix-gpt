import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback, useRef } from "react";
import { appendRecommendedMovies, addSeenMovies } from "../utils/searchSlice";
import { getMovieRecommendations } from "../utils/gemini";
import useSearchContent from "./hooks/useSearchContent";
import MovieList from "./MovieList";

const MovieSuggestions = () => {
    const searchContent = useSearchContent();
    const dispatch = useDispatch();
    const movies = useSelector((store) => store.search?.recommendedMovies);
    const promptText = useSelector((store) => store.search?.promptText);
    const seenMovies = useSelector((store) => store.search?.movieNames);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const loadingRef = useRef(false);
    const observerRef = useRef(null);
    const sentinelRef = useRef(null);

    const getMoviesPerRow = () => {
        const width = window.innerWidth;
        if (width >= 1600) return 6;  
        if (width >= 1280) return 5;  
        if (width >= 1024) return 4;  
        if (width >= 768) return 3;   
        return 2; 
    };

    const loadMoreMovies = useCallback(async () => {
        if (loadingRef.current || !promptText) return;
        
        loadingRef.current = true;
        setIsLoading(true);
        setError(null);

        try {
            const response = await getMovieRecommendations(
                promptText + " but dont include these titles: " + seenMovies
            );
            const contentNames = response.split(',').map((m) => m.trim()).filter(Boolean);
            const promiseArray = contentNames.map((content) => searchContent(content)); 
            const result = await Promise.all(promiseArray);
            const recommendedMovies = result
            .flat()
            .filter((movie) => movie && movie.backdrop_path);
            console.log(recommendedMovies);
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
    }, [promptText, seenMovies, searchContent, dispatch]);

    const createMovieRows = (allMovies) => {
        const moviesPerRow = getMoviesPerRow();
        const rows = [];
        
        for (let i = 0; i < allMovies.length; i += moviesPerRow) {
            rows.push(allMovies.slice(i, i + moviesPerRow));
        }
        
        return rows;
    };

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '200px', // Load more when user is 200px from bottom
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

    const movieRows = createMovieRows(movies);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
                <div className="px-4 py-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-1 h-8 bg-gradient-to-b from-red-500 to-pink-500 rounded-full"></div>
                            <h2 className="text-white text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text">
                                Recommended for You
                            </h2>
                        </div>
                        <p className="text-gray-400 text-sm ml-4">
                            Discover your next favorite content • {movies.length} recommendations
                        </p>
                    </div>
                </div>
            </div>

            {/* Movie Rows */}
            <div className="pt-6">
                {movieRows.map((rowMovies, rowIndex) => (
                    <MovieList
                        key={rowIndex}
                        title="" // No title for seamless rows
                        movies={rowMovies}
                        mediaType="movie" // or determine from movie data
                        hasMore={false} // Each row is fixed size, no horizontal scrolling needed
                        onLoadMore={() => Promise.resolve()} // No-op since we handle loading at the page level
                    />
                ))}

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="flex items-center gap-3 bg-gray-800/50 backdrop-blur-sm px-6 py-4 rounded-full border border-gray-700">
                            <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-white font-medium">Loading more recommendations...</span>
                        </div>
                    </div>
                )}

                {/* Error State */}
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

                {/* Intersection Observer Sentinel */}
                <div
                    ref={sentinelRef}
                    className="h-20 w-full"
                    aria-hidden="true"
                />
            </div>
        </div>
    );
};

export default MovieSuggestions;