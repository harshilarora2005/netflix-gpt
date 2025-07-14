/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit"
const searchSlice = createSlice({
    name:"search",
    initialState : {
        showSearch : false,
    },
    reducers:{
        toggleSearchView:(state,action)=>{
            state.showSearch=!state.showSearch;
        }   
    }
});
export const {toggleSearchView}  = searchSlice.actions;
export default searchSlice.reducer;