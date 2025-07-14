import { useDispatch } from "react-redux";
import { API_OPTIONS } from "../../utils/constants";
import { setPopularMovies, appendPopularMovies } from "../../utils/movieSlice";

const usePopularMovies = () => {
    const dispatch = useDispatch();

    const fetchPopularMovies = async (page = 1) => {
        try {
        const res = await fetch(
            `https://api.themoviedb.org/3/movie/popular?page=${page}`,
            API_OPTIONS
        );
        const json = await res.json();
        const movies = json?.results || [];

        if (page === 1) {
            dispatch(setPopularMovies(movies));
        } else {
            dispatch(appendPopularMovies(movies));
        }
        return movies.length > 0;
        } catch (err) {
        console.error("Error fetching Popular movies:", err);
        return false;
        }
    };
    return fetchPopularMovies;
};

export default usePopularMovies;
