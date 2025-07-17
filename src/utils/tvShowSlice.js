
import { createSlice } from "@reduxjs/toolkit";

const tvShowSlice = createSlice({
    name: "shows",
    initialState: {
        airingTodayTVShows: [],
        onTheAirTVShows: [],
        popularTVShows: [],
        topRatedTVShows: [],
        tvGenres: [],
        selectedTVGenre: null,
        genreTVShows: {},
        trailerVideo:null
    },
    reducers: {
        setAiringTodayTVShows: (state, action) => {
            state.airingTodayTVShows = action.payload;
        },
        appendAiringTodayTVShows: (state, action) => {
            state.airingTodayTVShows = [...state.airingTodayTVShows, ...action.payload];
        },
        setOnTheAirTVShows: (state, action) => {
            state.onTheAirTVShows = action.payload;
        },
        appendOnTheAirTVShows: (state, action) => {
            state.onTheAirTVShows = [...state.onTheAirTVShows, ...action.payload];
        },
        setPopularTVShows: (state, action) => {
            state.popularTVShows = action.payload;
        },
        appendPopularTVShows: (state, action) => {
            state.popularTVShows = [...state.popularTVShows, ...action.payload];
        },
        setTopRatedTVShows: (state, action) => {
            state.topRatedTVShows = action.payload;
        },
        appendTopRatedTVShows: (state, action) => {
            state.topRatedTVShows = [...state.topRatedTVShows, ...action.payload];
        },
        setTVGenres: (state, action) => {
            state.tvGenres = action.payload;
        },
        setSelectedTVGenre: (state, action) => {
            state.selectedTVGenre = action.payload;
        },
        setGenreTVShows: (state, action) => {
            const { genreId, shows } = action.payload;
            state.genreTVShows[genreId] = shows;
        },
        appendGenreTVShows: (state, action) => {
            const { genreId, shows } = action.payload;
            if (state.genreTVShows[genreId]) {
                state.genreTVShows[genreId] = [...state.genreTVShows[genreId], ...shows];
            } else {
                state.genreTVShows[genreId] = shows;
            }
        },
        clearGenreTVShows: (state) => {
            state.genreTVShows = {};
        },
        addTrailerVideo:(state, action)=>{
            state.trailerVideo=action.payload;
        }
    },
});

export const {
    setAiringTodayTVShows,
    appendAiringTodayTVShows,
    setOnTheAirTVShows,
    appendOnTheAirTVShows,
    setPopularTVShows,
    appendPopularTVShows,
    setTopRatedTVShows,
    appendTopRatedTVShows,
    setTVGenres,
    setSelectedTVGenre,
    setGenreTVShows,
    appendGenreTVShows,
    clearGenreTVShows,
    addTrailerVideo
} = tvShowSlice.actions;

export default tvShowSlice.reducer;