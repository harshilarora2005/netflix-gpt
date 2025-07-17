import { useDispatch } from "react-redux";
import { API_OPTIONS } from "../../utils/constants";
import { setTopRatedMovies, appendTopRatedMovies } from "../../utils/movieSlice";
import { useCallback } from "react";

const useTopRatedMovies = () => {
    const dispatch = useDispatch();

    const fetchTopRatedMovies = useCallback(async (page = 1) => {
        try {
        const res = await fetch(
            `https://api.themoviedb.org/3/movie/top_rated?page=${page}`,
            API_OPTIONS
        );
        const json = await res.json();
        const movies = json?.results || [];

        if (page === 1) {
            dispatch(setTopRatedMovies(movies));
        } else {
            dispatch(appendTopRatedMovies(movies));
        }
        return movies.length > 0;
        } catch (err) {
        console.error("Error fetching Top Rated movies:", err);
        return false;
        }
    },[dispatch]);
    return fetchTopRatedMovies;
};

export default useTopRatedMovies;
