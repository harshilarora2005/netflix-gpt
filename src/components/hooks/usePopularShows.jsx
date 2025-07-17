import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { API_OPTIONS } from '../../utils/constants';
import { 
    setPopularTVShows, 
    appendPopularTVShows,
} from '../../utils/tvShowSlice';
export const usePopularShows = () => {
    const dispatch = useDispatch();

    const fetchPopularShows = useCallback(async (page = 1) => {
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/tv/popular?page=${page}`,
                API_OPTIONS
            );
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                if (page === 1) {
                    dispatch(setPopularTVShows(data.results));
                } else {
                    dispatch(appendPopularTVShows(data.results));
                }
                return data.page < data.total_pages;
            }
            return false;
        } catch (error) {
            console.error('Error fetching popular TV shows:', error);
            return false;
        }
    }, [dispatch]);

    return fetchPopularShows;
};