import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import moviesReducer from "./movieSlice"
import searchReducer from "./searchSlice"
import showsReducer from "./tvShowSlice"
const appStore = configureStore({
        reducer:{
            user:userReducer,
            movies:moviesReducer,
            search:searchReducer,
            shows:showsReducer
        },
});
export default appStore;