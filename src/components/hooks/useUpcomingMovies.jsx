import { useDispatch } from "react-redux";
import { API_OPTIONS } from "../../utils/constants";
import { setUpcomingMovies, appendUpcomingMovies } from "../../utils/movieSlice";

const useUpcomingMovies = () => {
    const dispatch = useDispatch();

    const fetchUpcomingMovies = async (page = 1) => {
        try {
        const res = await fetch(
            `https://api.themoviedb.org/3/movie/upcoming?page=${page}`,
            API_OPTIONS
        );
        const json = await res.json();
        const movies = json?.results || [];

        if (page === 1) {
            dispatch(setUpcomingMovies(movies));
        } else {
            dispatch(appendUpcomingMovies(movies));
        }

        return movies.length > 0;
        } catch (err) {
        console.error("Error fetching Upcoming movies:", err);
        return false;
        }
    };

    return fetchUpcomingMovies;
};

export default useUpcomingMovies;
