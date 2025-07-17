import { createSlice } from "@reduxjs/toolkit";

const movieSlice = createSlice({
    name: "movies",
    initialState: {
        nowPlayingMovies: [],
        trailerVideo: null,
        popularMovies: [],
        topRatedMovies: [],
        upcomingMovies: [],
        movieGenres: [],
        selectedMovieGenre: null,
        genreMovies: {},
    },
    reducers: {
        setNowPlayingMovies: (state, action) => {
            state.nowPlayingMovies = action.payload;
        },
        appendNowPlayingMovies: (state, action) => {
            state.nowPlayingMovies = [...state.nowPlayingMovies, ...action.payload];
        },
        setPopularMovies: (state, action) => {
            state.popularMovies = action.payload;
        },
        appendPopularMovies: (state, action) => {
            state.popularMovies = [...state.popularMovies, ...action.payload];
        },
        setTopRatedMovies: (state, action) => {
            state.topRatedMovies = action.payload;
        },
        appendTopRatedMovies: (state, action) => {
            state.topRatedMovies = [...state.topRatedMovies, ...action.payload];
        },
        setUpcomingMovies: (state, action) => {
            state.upcomingMovies = action.payload;
        },
        appendUpcomingMovies: (state, action) => {
            state.upcomingMovies = [...state.upcomingMovies, ...action.payload];
        },
        addTrailerVideo: (state, action) => {
            state.trailerVideo = action.payload;
        },
        setMovieGenres: (state, action) => {
            state.movieGenres = action.payload;
        },
        setSelectedMovieGenre: (state, action) => {
            state.selectedMovieGenre = action.payload;
        },
        setGenreMovies: (state, action) => {
            const { genreId, movies } = action.payload;
            state.genreMovies[genreId] = movies;
        },
        appendGenreMovies: (state, action) => {
            const { genreId, movies } = action.payload;
            if (state.genreMovies[genreId]) {
                state.genreMovies[genreId] = [...state.genreMovies[genreId], ...movies];
            } else {
                state.genreMovies[genreId] = movies;
            }
        },
        clearGenreMovies: (state) => {
            state.genreMovies = {};
        },
    },
});

export const {
    setNowPlayingMovies,
    appendNowPlayingMovies,
    setPopularMovies,
    appendPopularMovies,
    setTopRatedMovies,
    appendTopRatedMovies,
    setUpcomingMovies,
    appendUpcomingMovies,
    addTrailerVideo,
    setMovieGenres,
    setSelectedMovieGenre,
    setGenreMovies,
    appendGenreMovies,
    clearGenreMovies,
} = movieSlice.actions;

export default movieSlice.reducer;