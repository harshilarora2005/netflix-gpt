import React from 'react'
import { useSelector } from 'react-redux'
import MovieList from "./MovieList";
const SecondaryContainer = () => {
    const movies = useSelector(store=>store.movies);
    return (
        <div className='h-screen overflow-visible'>
            <MovieList title= {"Now Playing"} movies={movies.nowPlayingMovies}/>
        </div>
    )
}

export default SecondaryContainer