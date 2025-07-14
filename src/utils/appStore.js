import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import moviesReducer from "./movieSlice"
import searchReducer from "./searchSlice"
const appStore = configureStore({
        reducer:{
            user:userReducer,
            movies:moviesReducer,
            search:searchReducer
        },
});
export default appStore;