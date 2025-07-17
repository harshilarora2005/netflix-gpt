/* eslint-disable react-hooks/exhaustive-deps */
import { API_OPTIONS } from "../../utils/constants";
import { addTrailerVideo as addMovieTrailerVideo } from "../../utils/movieSlice";
import { addTrailerVideo as addShowTrailerVideo } from "../../utils/tvShowSlice";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useGetMovieVideo = (mediaId, mediaType = "movie") => {
    const dispatch = useDispatch();
    const movieTrailerVideo = useSelector((store) => store.movies.trailerVideo);
    const showTrailerVideo = useSelector((store) => store.shows.trailerVideo);

    const trailerVideo = mediaType === "movie" ? movieTrailerVideo : showTrailerVideo;

    const getMediaVideo = async () => {
        try {
            const url = `https://api.themoviedb.org/3/${mediaType}/${mediaId}/videos?language=en-US`;
            const data = await fetch(url, API_OPTIONS);
            const json = await data.json();
            console.log(json);

            const filteredData = json.results?.filter((video) => video.type === "Trailer");
            const trailer = filteredData.length ? filteredData[0] : json.results?.[0];
            console.log(trailer);

            if (!trailer) return;

            if (mediaType === "movie") {
                dispatch(addMovieTrailerVideo(trailer));
            } else {
                dispatch(addShowTrailerVideo(trailer));
            }
        } catch (err) {
            console.error("Error fetching trailer:", err);
        }
    };

    useEffect(() => {
        if (!trailerVideo && mediaId) {
            getMediaVideo();
        }
    }, [mediaId, mediaType]);
};

export default useGetMovieVideo;
