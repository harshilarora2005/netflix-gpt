/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch } from 'react-redux'
import { API_OPTIONS } from '../../utils/constants'
import { useEffect } from 'react'
import { addTopRatedMovies } from '../../utils/movieSlice'
const useTopRatedMovies = () => {
    const dispatch = useDispatch();
    const getNowPlayingMovies = async() => {
        const data = await fetch(
            'https://api.themoviedb.org/3/movie/top_rated?page=1', API_OPTIONS);
        const json = await data.json();
        console.log(json);

        dispatch(addTopRatedMovies(json.results));
    }
    useEffect(()=>{
        getNowPlayingMovies();
    },[])
}

export default useTopRatedMovies;