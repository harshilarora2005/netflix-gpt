/* eslint-disable react-hooks/exhaustive-deps */
import { API_OPTIONS } from "../../utils/constants";
import { addTrailerVideo } from "../../utils/movieSlice";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
const useGetMovieVideo = (movieid) => {
    const dispatch = useDispatch();
    const trailerVideo = useSelector((store)=>store.movies.trailerVideo);
    const getMovieVideo = async() => {
        const data = await fetch(`https://api.themoviedb.org/3/movie/${movieid}/videos?language=en-US`, API_OPTIONS);
        const json = await data.json();
        console.log(json);
        const filteredData = json.results.filter((video) => video.type=="Trailer");
        const trailer = filteredData.length ? filteredData[0] : json.results[0];
        console.log(trailer);
        dispatch(addTrailerVideo(trailer));
    }
    useEffect(()=>{
        !trailerVideo && getMovieVideo();
    },[movieid])
}
export default useGetMovieVideo;