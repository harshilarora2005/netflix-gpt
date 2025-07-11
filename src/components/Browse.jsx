import Header from './Header'
import useNowPlayingMovies from './hooks/useNowPlayingMovies'
import MainContainer from './MainContainer'

const Browse = () => {
    useNowPlayingMovies();
    return (
        <div className='bg-black'>
            <Header/>
            <MainContainer/>
        </div>
    )
}

export default Browse;
