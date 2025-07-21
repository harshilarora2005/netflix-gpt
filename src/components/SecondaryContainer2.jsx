import { useState } from "react";
import { useSelector } from "react-redux";
import MovieList from "./MovieList";
import useNowPlayingMovies from "./hooks/useNowPlayingMovies";
import usePopularMovies from "./hooks/usePopularMovies";
import useTopRatedMovies from "./hooks/useTopRatedMovies";
import useUpcomingMovies from "./hooks/useUpcomingMovies";
import { useMoviesByGenre } from "./hooks/useMoviesByGenre";
import { useDispatch } from "react-redux";
import { setGenreMovies, setSelectedMovieGenre, appendGenreMovies, clearGenreMovies } from "../utils/movieSlice";
import GenreFilter from "./GenreFilter";
const SecondaryContainer = () => {
    const movies = useSelector((store) => store.movies);
    const dispatch = useDispatch();
    const { selectedMovieGenre, movieGenres, genreMovies } = movies;
    const fetchNowPlaying = useNowPlayingMovies();
    const fetchPopular = usePopularMovies();
    const fetchTopRated = useTopRatedMovies();
    const fetchUpcoming = useUpcomingMovies();
    const fetchMoviesByGenre = useMoviesByGenre();
    
    const [nowPlayingPage, setNowPlayingPage] = useState(1);
    const [hasMoreNowPlaying, setHasMoreNowPlaying] = useState(true);

    const [popularPage, setPopularPage] = useState(1);
    const [hasMorePopular, setHasMorePopular] = useState(true);

    const [topRatedPage, setTopRatedPage] = useState(1);
    const [hasMoreTopRated, setHasMoreTopRated] = useState(true);

    const [upcomingPage, setUpcomingPage] = useState(1);
    const [hasMoreUpcoming, setHasMoreUpcoming] = useState(true);

    const [genrePages, setGenrePages] = useState({});
    const [genreHasMore, setGenreHasMore] = useState({});

    const [dropdownOpen, setDropdownOpen] = useState(false);
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
    const handleGenreSelect = async (genre) => {
        dispatch(setSelectedMovieGenre(genre));
        dispatch(clearGenreMovies());
        setDropdownOpen(false);
        
        const { movies, hasMore } = await fetchMoviesByGenre(genre.id, 1);
        dispatch(setGenreMovies({ genreId: genre.id, movies }));
        setGenrePages(prev => ({ ...prev, [genre.id]: 1 }));
        setGenreHasMore(prev => ({ ...prev, [genre.id]: hasMore }));
    };

    const loadMoreGenreMovies = async () => {
        if (!selectedMovieGenre) return;
        
        const currentPage = genrePages[selectedMovieGenre.id] || 1;
        const nextPage = currentPage + 1;
        
        const { movies, hasMore } = await fetchMoviesByGenre(selectedMovieGenre.id, nextPage);
        dispatch(appendGenreMovies({ genreId: selectedMovieGenre.id, movies }));
        
        setGenrePages(prev => ({ ...prev, [selectedMovieGenre.id]: nextPage }));
        setGenreHasMore(prev => ({ ...prev, [selectedMovieGenre.id]: hasMore }));
    };

    const clearGenreFilter = () => {
        dispatch(setSelectedMovieGenre(null));
        dispatch(clearGenreMovies());
    };

    return (
        <div className="bg-black min-h-screen pb-12">
            <div className=" px-4 md:px-12">
                <div className="mb-8">
                    <h1 className="text-white text-3xl md:text-4xl font-bold mb-6">Movies</h1>
                    <GenreFilter
                        genres={movieGenres}
                        selectedGenre={selectedMovieGenre}
                        onSelectGenre={handleGenreSelect}
                        onClear={clearGenreFilter}
                        dropdownOpen={dropdownOpen}
                        setDropdownOpen={setDropdownOpen}
                    />
                </div>
                {selectedMovieGenre && genreMovies[selectedMovieGenre.id] && (
                    <div className="mb-8">
                        <MovieList
                            title={`${selectedMovieGenre.name} Movies`}
                            movies={genreMovies[selectedMovieGenre.id]}
                            hasMore={genreHasMore[selectedMovieGenre.id] || false}
                            onLoadMore={loadMoreGenreMovies}
                        />
                    </div>
                )}
                {!selectedMovieGenre && (
                    <>
                        <MovieList
                            title="Now Playing"
                            movies={movies.nowPlayingMovies}
                            hasMore={hasMoreNowPlaying}
                            onLoadMore={loadMoreNowPlaying}
                            mediaType="movie"
                        />
                        
                        <MovieList
                            title="Upcoming"
                            movies={movies.upcomingMovies}
                            hasMore={hasMoreUpcoming}
                            onLoadMore={loadMoreUpcoming}
                            mediaType="movie"
                        />
                        
                        <MovieList
                            title="Popular Movies"
                            movies={movies.popularMovies}
                            hasMore={hasMorePopular}
                            onLoadMore={loadMorePopular}
                            mediaType="movie"
                        />
                        
                        <MovieList
                            title="Top Rated Movies"
                            movies={movies.topRatedMovies}
                            hasMore={hasMoreTopRated}
                            onLoadMore={loadMoreTopRated}
                            mediaType="movie"
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default SecondaryContainer;
