import { useSelector } from 'react-redux';
import VideoTitle from './VideoTitle';
import VideoBackground from './VideoBackground'
const MainContainer = () => {
    const movies = useSelector(store=>store.movies?.nowPlayingMovies);
    console.log(movies);
    if(movies.length==0){
        return;
    }
    const mainMovie = movies[0];
    const {original_title, overview,id } = mainMovie;
    return (
        <div className="relative w-full h-[110vh]">
            <div className="inset-0 z-0">
                <VideoBackground movieid={id} />
            </div>
            <div className="absolute inset-0 z-10">
                <VideoTitle title={original_title} overview={overview}/>
            </div>
        </div>
    )
}

export default MainContainer;