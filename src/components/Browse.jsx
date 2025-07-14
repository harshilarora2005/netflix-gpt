/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import Header from "./Header";
import useNowPlayingMovies from "./hooks/useNowPlayingMovies";
import usePopularMovies from "./hooks/usePopularMovies";
import useTopRatedMovies from "./hooks/useTopRatedMovies";
import useUpcomingMovies from "./hooks/useUpcomingMovies";
import MainContainer from "./MainContainer";
import SecondaryContainer from "./SecondaryContainer";
import { useSelector } from "react-redux";
import Explore from "./Explore"
const Browse = () => {
    const fetchNowPlayingMovies = useNowPlayingMovies();
    const fetchPopularMovies = usePopularMovies();
    const fetchTopRatedMovies = useTopRatedMovies();
    const fetchUpcomingMovies = useUpcomingMovies();

    useEffect(() => {
        fetchNowPlayingMovies(1);
        fetchPopularMovies(1);
        fetchTopRatedMovies(1);
        fetchUpcomingMovies(1);
    }, []);
    const showSearch = useSelector((store) => store?.search?.showSearch);

    return (
        <div className="bg-black overflow-visible">
        <Header />
        {showSearch ? (
            <Explore/>
        ):(
            <>
                <MainContainer />
                <SecondaryContainer />
            </>
        )}
        </div>
    );
};

export default Browse;
