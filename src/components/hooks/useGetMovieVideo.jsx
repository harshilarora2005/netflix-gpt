import { API_OPTIONS } from "../../utils/constants";
import { addTrailerVideo } from "../../utils/movieSlice";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
const useGetMovieVideo = (movieid) => {
    const dispatch = useDispatch();
    const getMovieVideo = async() => {
        const data = await fetch(`https://api.themoviedb.org/3/movie/${movieid}/videos?language=en-US`, API_OPTIONS);
        const json = await data.json();
        console.log(json);
        const filteredData = json.results.filter((video) => video.type=="Trailer");
        const trailer = filteredData.length ? filteredData[0] : json.results[0];
        dispatch(addTrailerVideo(trailer));
    }
    useEffect(()=>{
        getMovieVideo();
    },[movieid])
}
export default useGetMovieVideo;