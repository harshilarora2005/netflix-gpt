import { useEffect } from "react";
import Header from "./Header";
import useNowPlayingMovies from "./hooks/useNowPlayingMovies";
import usePopularMovies from "./hooks/usePopularMovies";
import useTopRatedMovies from "./hooks/useTopRatedMovies";
import useUpcomingMovies from "./hooks/useUpcomingMovies";
import { useMovieGenre } from "./hooks/useMovieGenre";
import MainContainer from "./MainContainer";
import SecondaryContainer2 from "./SecondaryContainer2";
import { useDispatch } from "react-redux";
import { setMovieGenres } from "../utils/movieSlice";

const Movies = () => {
    const dispatch = useDispatch();
    const fetchNowPlayingMovies = useNowPlayingMovies();
    const fetchPopularMovies = usePopularMovies();
    const fetchTopRatedMovies = useTopRatedMovies();
    const fetchUpcomingMovies = useUpcomingMovies();
    const fetchMovieGenre = useMovieGenre();

    useEffect(() => {
        fetchNowPlayingMovies(1);
        fetchPopularMovies(1);
        fetchTopRatedMovies(1);
        fetchUpcomingMovies(1);
        fetchMovieGenre().then(genres => {
            dispatch(setMovieGenres(genres));
        });
    }, [fetchNowPlayingMovies, fetchPopularMovies, fetchTopRatedMovies, fetchUpcomingMovies, fetchMovieGenre, dispatch]);

    return (
        <div className="bg-black overflow-visible">
            <Header />
            <MainContainer />
            <SecondaryContainer2/>
        </div>
    );
};

export default Movies;