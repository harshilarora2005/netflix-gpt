import { useEffect } from "react";
import Header from "./Header";
import { useAiringTodayShows } from './hooks/useAiringTodayShows';
import { usePopularShows } from './hooks/usePopularShows';
import { useTopRatedShows } from './hooks/useTopRatedShows';import { useTVGenres } from './hooks/useTVGenres';
import { useOnTheAirShows } from './hooks/useOnTheAirShows';
import MainContainer1 from "./MainContainer1";
import SecondaryContainer1 from "./SecondaryContainer1";
import { useDispatch } from "react-redux";
import { setTVGenres } from "../utils/tvShowSlice";
const TVShow = () => {
    const dispatch = useDispatch();
    const fetchAiringToday = useAiringTodayShows();
    const fetchOnTheAir = useOnTheAirShows();
    const fetchPopular = usePopularShows();
    const fetchTopRated = useTopRatedShows();
    const fetchTVGenres = useTVGenres();

    useEffect(() => {
        fetchAiringToday(1);
        fetchOnTheAir(1);
        fetchPopular(1);
        fetchTopRated(1);
        fetchTVGenres().then(genres => {
            dispatch(setTVGenres(genres));
        });
    }, [fetchAiringToday, fetchOnTheAir, fetchPopular, fetchTopRated, fetchTVGenres, dispatch]);
    return (
        <div className="bg-black overflow-visible">
        <Header />
        <MainContainer1/>
        <SecondaryContainer1/>
        </div>
    );
};

export default TVShow;
