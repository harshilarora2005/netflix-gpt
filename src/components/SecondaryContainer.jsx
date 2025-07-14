import { useState } from "react";
import { useSelector } from "react-redux";
import MovieList from "./MovieList";

import useNowPlayingMovies from "./hooks/useNowPlayingMovies";
import usePopularMovies from "./hooks/usePopularMovies";
import useTopRatedMovies from "./hooks/useTopRatedMovies";
import useUpcomingMovies from "./hooks/useUpcomingMovies";

const SecondaryContainer = () => {
    const movies = useSelector((store) => store.movies);
    const fetchNowPlaying = useNowPlayingMovies();
    const fetchPopular = usePopularMovies();
    const fetchTopRated = useTopRatedMovies();
    const fetchUpcoming = useUpcomingMovies();

    const [nowPlayingPage, setNowPlayingPage] = useState(1);
    const [hasMoreNowPlaying, setHasMoreNowPlaying] = useState(true);

    const [popularPage, setPopularPage] = useState(1);
    const [hasMorePopular, setHasMorePopular] = useState(true);

    const [topRatedPage, setTopRatedPage] = useState(1);
    const [hasMoreTopRated, setHasMoreTopRated] = useState(true);

    const [upcomingPage, setUpcomingPage] = useState(1);
    const [hasMoreUpcoming, setHasMoreUpcoming] = useState(true);
    const loadMoreNowPlaying = async () => {
        const nextPage = nowPlayingPage + 1;
        const gotMore = await fetchNowPlaying(nextPage);
        if (gotMore) setNowPlayingPage(nextPage);
        else setHasMoreNowPlaying(false);
    };

    const loadMorePopular = async () => {
        const nextPage = popularPage + 1;
        const gotMore = await fetchPopular(nextPage);
        if (gotMore) setPopularPage(nextPage);
        else setHasMorePopular(false);
    };

    const loadMoreTopRated = async () => {
        const nextPage = topRatedPage + 1;
        const gotMore = await fetchTopRated(nextPage);
        if (gotMore) setTopRatedPage(nextPage);
        else setHasMoreTopRated(false);
    };

    const loadMoreUpcoming = async () => {
        const nextPage = upcomingPage + 1;
        const gotMore = await fetchUpcoming(nextPage);
        if (gotMore) setUpcomingPage(nextPage);
        else setHasMoreUpcoming(false);
    };

    return (
        <div className="min-h-screen overflow-visible relative z-10 -mt-34 pb-12 md:pb-20">
        <MovieList
            title={"Now Playing"}
            movies={movies.nowPlayingMovies}
            hasMore={hasMoreNowPlaying}
            onLoadMore={loadMoreNowPlaying}
        />
        <MovieList
            title={"Popular"}
            movies={movies.popularMovies}
            hasMore={hasMorePopular}
            onLoadMore={loadMorePopular}
        />
        <MovieList
            title={"Top Rated"}
            movies={movies.topRatedMovies}
            hasMore={hasMoreTopRated}
            onLoadMore={loadMoreTopRated}
        />
        <MovieList
            title={"Upcoming"}
            movies={movies.upcomingMovies}
            hasMore={hasMoreUpcoming}
            onLoadMore={loadMoreUpcoming}
        />
        </div>
    );
};

export default SecondaryContainer;
