import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { API_OPTIONS } from '../../utils/constants';
import { 
    setTopRatedTVShows, 
    appendTopRatedTVShows,
} from '../../utils/tvShowSlice';
export const useTopRatedShows = () => {
    const dispatch = useDispatch();

    const fetchTopRatedShows = useCallback(async (page = 1) => {
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/tv/top_rated?page=${page}`,
                API_OPTIONS
            );
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                if (page === 1) {
                    dispatch(setTopRatedTVShows(data.results));
                } else {
                    dispatch(appendTopRatedTVShows(data.results));
                }
                return data.page < data.total_pages;
            }
            return false;
        } catch (error) {
            console.error('Error fetching top rated TV shows:', error);
            return false;
        }
    }, [dispatch]);

    return fetchTopRatedShows;
};