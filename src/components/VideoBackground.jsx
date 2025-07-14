
import { useSelector } from "react-redux";
import useGetMovieVideo from "./hooks/useGetMovieVideo";
const VideoBackground = ({movieid}) => {
    useGetMovieVideo(movieid);
    const trailerVideo = useSelector(store=> store.movies?.trailerVideo);
    console.log(trailerVideo);
    if(!trailerVideo){
        return
    }
    const trailerKey = trailerVideo?.key;
    console.log(trailerKey);
    return (
        <div className="-mt-16 w-full h-[110vh] overflow-hidden relative">
            {trailerKey && (
                <iframe
                    className="w-full h-full object-cover scale-120"
                    src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&loop=1&playlist=${trailerKey}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0&cc_load_policy=0&start=0&end=0&vq=hd1080`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                ></iframe>
            )}
        </div>
    )
}

export default VideoBackground