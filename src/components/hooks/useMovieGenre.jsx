import { useCallback } from 'react';
import { API_OPTIONS } from '../../utils/constants';

export const useMovieGenre = () => {
    const fetchMovieGenre = useCallback(async () => {
        try {
            const response = await fetch(
                'https://api.themoviedb.org/3/genre/movie/list',
                API_OPTIONS
            );
            const data = await response.json();
            return data.genres || [];
        } catch (error) {
            console.error('Error fetching movie genres:', error);
            return [];
        }
    }, []);

    return fetchMovieGenre;
};