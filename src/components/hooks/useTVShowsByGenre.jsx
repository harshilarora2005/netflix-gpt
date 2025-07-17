import { useCallback } from 'react';
import { API_OPTIONS } from '../../utils/constants';
export const useTVShowsByGenre = () => {
    const fetchTVShowsByGenre = useCallback(async (genreId, page = 1) => {
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/discover/tv?with_genres=${genreId}&page=${page}&sort_by=popularity.desc`,
                API_OPTIONS
            );
            const data = await response.json();
            console.log(data.results);
            if (data.results && data.results.length > 0) {
                return {
                    shows: data.results,
                    hasMore: data.page < data.total_pages
                };
            }
            return { shows: [], hasMore: false };
        } catch (error) {
            console.error('Error fetching TV shows by genre:', error);
            return { shows: [], hasMore: false };
        }
    }, []);

    return fetchTVShowsByGenre;
};