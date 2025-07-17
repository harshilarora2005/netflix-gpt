import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { API_OPTIONS } from '../../utils/constants';
import { 
    setAiringTodayTVShows, 
    appendAiringTodayTVShows,
} from '../../utils/tvShowSlice';

export const useAiringTodayShows = () => {
    const dispatch = useDispatch();

    const fetchAiringTodayShows = useCallback(async (page = 1) => {
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/tv/airing_today?page=${page}`,
                API_OPTIONS
            );
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                if (page === 1) {
                    dispatch(setAiringTodayTVShows(data.results));
                } else {
                    dispatch(appendAiringTodayTVShows(data.results));
                }
                return data.page < data.total_pages;
            }
            return false;
        } catch (error) {
            console.error('Error fetching airing today TV shows:', error);
            return false;
        }
    }, [dispatch]);

    return fetchAiringTodayShows;
};