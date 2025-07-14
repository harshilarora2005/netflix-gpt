import { createSlice } from "@reduxjs/toolkit";

const movieSlice = createSlice({
    name: "movies",
    initialState: {
        nowPlayingMovies: [],
        trailerVideo: null,
        popularMovies: [],
        topRatedMovies: [],
        upcomingMovies: [],
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
} = movieSlice.actions;

export default movieSlice.reducer;
