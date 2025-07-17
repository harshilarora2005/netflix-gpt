import { useSelector } from 'react-redux';
import VideoTitle from './VideoTitle';
import VideoBackground from './VideoBackground'
const MainContainer = () => {
    const shows = useSelector(store=>store.shows?.airingTodayTVShows);
    console.log(shows);
    if(shows.length==0){
        return;
    }
    const mainShow = shows[1];
    console.log(mainShow);
    const {original_name, overview,id } = mainShow;
    console.log(id);
    return (
        <div className="relative w-full h-[110vh]">
            <div className="inset-0 z-0">
                <VideoBackground movieid={id} mediaType="tv" />
            </div>
            <div className="absolute inset-0 z-10">
                <VideoTitle title={original_name} overview={overview} />
            </div>
        </div>
    )
}

export default MainContainer;