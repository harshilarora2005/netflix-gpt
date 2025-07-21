import { useState } from "react";
import { useSelector } from "react-redux";
import MovieList from "./MovieList";
import { useAiringTodayShows } from "./hooks/useAiringTodayShows";
import { usePopularShows } from './hooks/usePopularShows';
import { useTopRatedShows } from './hooks/useTopRatedShows';
import { useTVShowsByGenre } from './hooks/useTVShowsByGenre';
import { useOnTheAirShows } from './hooks/useOnTheAirShows';
import { useDispatch } from "react-redux";
import {setSelectedTVGenre, setGenreTVShows, appendGenreTVShows, clearGenreTVShows } from '../utils/tvShowSlice';
import GenreFilter from "./GenreFilter";
const SecondaryContainer = () => {
    const tvShows = useSelector((store) => store.shows);
    const dispatch = useDispatch();
    const { selectedTVGenre, tvGenres, genreTVShows } = tvShows;
    const fetchAiringToday = useAiringTodayShows();
    const fetchOnTheAir = useOnTheAirShows();
    const fetchPopular = usePopularShows();
    const fetchTopRated = useTopRatedShows();
    const fetchTVShowsByGenre = useTVShowsByGenre();
    
    const [airingTodayPage, setAiringTodayPage] = useState(1);
    const [hasMoreAiringToday, setHasMoreAiringToday] = useState(true);
        
    const [onTheAirPage, setOnTheAirPage] = useState(1);
    const [hasMoreOnTheAir, setHasMoreOnTheAir] = useState(true);
        
    const [popularPage, setPopularPage] = useState(1);
    const [hasMorePopular, setHasMorePopular] = useState(true);
        
    const [topRatedPage, setTopRatedPage] = useState(1);
    const [hasMoreTopRated, setHasMoreTopRated] = useState(true);

    const [genrePages, setGenrePages] = useState({});
    const [genreHasMore, setGenreHasMore] = useState({});

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const loadMoreAiringToday = async () => {
        const nextPage = airingTodayPage + 1;
        const gotMore = await fetchAiringToday(nextPage);
        if (gotMore) setAiringTodayPage(nextPage);
        else setHasMoreAiringToday(false);
    };

    const loadMoreOnTheAir = async () => {
        const nextPage = onTheAirPage + 1;
        const gotMore = await fetchOnTheAir(nextPage);
        if (gotMore) setOnTheAirPage(nextPage);
        else setHasMoreOnTheAir(false);
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
    const handleGenreSelect = async (genre) => {
        dispatch(setSelectedTVGenre(genre));
        dispatch(clearGenreTVShows());
        setDropdownOpen(false);
        
        const { shows, hasMore } = await fetchTVShowsByGenre(genre.id, 1);
        dispatch(setGenreTVShows({ genreId: genre.id, shows }));
        setGenrePages(prev => ({ ...prev, [genre.id]: 1 }));
        setGenreHasMore(prev => ({ ...prev, [genre.id]: hasMore }));
    };

    const loadMoreGenreShows = async () => {
        if (!selectedTVGenre) return;
        
        const currentPage = genrePages[selectedTVGenre.id] || 1;
        const nextPage = currentPage + 1;
        
        const { shows, hasMore } = await fetchTVShowsByGenre(selectedTVGenre.id, nextPage);
        dispatch(appendGenreTVShows({ genreId: selectedTVGenre.id, shows }));
        
        setGenrePages(prev => ({ ...prev, [selectedTVGenre.id]: nextPage }));
        setGenreHasMore(prev => ({ ...prev, [selectedTVGenre.id]: hasMore }));
    };

    const clearGenreFilter = () => {
        dispatch(setSelectedTVGenre(null));
        dispatch(clearGenreTVShows());
    };

    return (
        <div className="bg-black min-h-screen pb-12">
            <div className=" px-4 md:px-12">
                <div className="mb-8">
                    <h1 className="text-white text-3xl md:text-4xl font-bold mb-6">TV Shows</h1>
                    <GenreFilter
                        genres={tvGenres}
                        selectedGenre={selectedTVGenre}
                        onSelectGenre={handleGenreSelect}
                        onClear={clearGenreFilter}
                        dropdownOpen={dropdownOpen}
                        setDropdownOpen={setDropdownOpen}
                    />
                </div>
                {selectedTVGenre && genreTVShows[selectedTVGenre.id] && (
                    <div className="mb-8">
                        <MovieList
                            title={`${selectedTVGenre.name} TV Shows`}
                            movies={genreTVShows[selectedTVGenre.id]}
                            hasMore={genreHasMore[selectedTVGenre.id] || false}
                            onLoadMore={loadMoreGenreShows}
                        />
                    </div>
                )}
                {!selectedTVGenre && (
                    <>
                        <MovieList
                            title="Airing Today"
                            movies={tvShows.airingTodayTVShows}
                            hasMore={hasMoreAiringToday}
                            onLoadMore={loadMoreAiringToday}
                            mediaType="tv"
                        />
                        
                        <MovieList
                            title="On The Air"
                            movies={tvShows.onTheAirTVShows}
                            hasMore={hasMoreOnTheAir}
                            onLoadMore={loadMoreOnTheAir}
                            mediaType="tv"
                        />
                        
                        <MovieList
                            title="Popular TV Shows"
                            movies={tvShows.popularTVShows}
                            hasMore={hasMorePopular}
                            onLoadMore={loadMorePopular}
                            mediaType="tv"
                        />
                        
                        <MovieList
                            title="Top Rated TV Shows"
                            movies={tvShows.topRatedTVShows}
                            hasMore={hasMoreTopRated}
                            onLoadMore={loadMoreTopRated}
                            mediaType="tv"
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default SecondaryContainer;
