import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { API_OPTIONS } from '../../utils/constants';
import { 
    setOnTheAirTVShows, 
    appendOnTheAirTVShows,
} from '../../utils/tvShowSlice';

export const useOnTheAirShows = () => {
    const dispatch = useDispatch();

    const fetchOnTheAirShows = useCallback(async (page = 1) => {
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/tv/on_the_air?page=${page}`,
                API_OPTIONS
            );
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                if (page === 1) {
                    dispatch(setOnTheAirTVShows(data.results));
                } else {
                    dispatch(appendOnTheAirTVShows(data.results));
                }
                return data.page < data.total_pages;
            }
            return false;
        } catch (error) {
            console.error('Error fetching airing today TV shows:', error);
            return false;
        }
    }, [dispatch]);

    return fetchOnTheAirShows;
};