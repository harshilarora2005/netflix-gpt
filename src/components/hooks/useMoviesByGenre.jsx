import { useCallback } from 'react';
import { API_OPTIONS } from '../../utils/constants';

export const useMoviesByGenre = () => {
    const fetchMoviesByGenre = useCallback(async (genreId, page = 1) => {
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&page=${page}&sort_by=popularity.desc`,
                API_OPTIONS
            );
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                return {
                    movies: data.results,
                    hasMore: data.page < data.total_pages
                };
            }
            return { movies: [], hasMore: false };
        } catch (error) {
            console.error('Error fetching movies by genre:', error);
            return { movies: [], hasMore: false };
        }
    }, []);

    return fetchMoviesByGenre;
};