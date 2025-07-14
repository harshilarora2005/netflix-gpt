import { useDispatch } from "react-redux";
import {
  setNowPlayingMovies,
  appendNowPlayingMovies,
} from "../../utils/movieSlice";
import { API_OPTIONS } from "../../utils/constants";

const useNowPlayingMovies = () => {
    const dispatch = useDispatch();

    const fetchNowPlaying = async (page = 1) => {
        try {
        const res = await fetch(
            `https://api.themoviedb.org/3/movie/now_playing?page=${page}`,
            API_OPTIONS
        );
        const json = await res.json();
        const movies = json?.results || [];
        console.log(movies);

        if (page === 1) {
            dispatch(setNowPlayingMovies(movies));
        } else {
            dispatch(appendNowPlayingMovies(movies));
        }
        return movies.length > 0; 
        } catch (err) {
        console.error("Error fetching Now Playing movies:", err);
        return false;
        }
    };

    return fetchNowPlaying;
};

export default useNowPlayingMovies;
