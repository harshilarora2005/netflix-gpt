/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit"
const searchSlice = createSlice({
    name:"search",
    initialState : {
        showSearch : false,
        recommendedMovies:[],
        movieNames : "",
        promptText: null
    },
    reducers:{
        toggleSearchView:(state,action)=>{
            state.showSearch=!state.showSearch;
        },
        addRecommendedMovies:(state,action)=>{
            state.recommendedMovies=action.payload;
        },
        appendRecommendedMovies:(state,action)=>{
            state.recommendedMovies=[...state.recommendedMovies,...action.payload]
        },
        addSeenMovies:(state,action)=>{
            const newMovies = action.payload;
            if (state.movieNames) {
                state.movieNames += `, ${newMovies}`;
            } else {
                state.movieNames = newMovies;
            }
        },
        clearMovies:(state,action)=>{
            state.movieNames = "";
            state.recommendedMovies = null;
        },
        addPromptText:(state,action)=>{
            state.promptText=action.payload;
        }
    }
});
export const {toggleSearchView, addRecommendedMovies,appendRecommendedMovies, addSeenMovies, clearMovies,addPromptText}  = searchSlice.actions;
export default searchSlice.reducer;