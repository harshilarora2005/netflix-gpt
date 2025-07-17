import { createBrowserRouter } from "react-router";
import Login from "./Login";
import Browse from "./Browse";
import { RouterProvider} from "react-router";
import TVShow from "./TVShow";
import MyList from "./MyList";
import Movies from "./Movies";
const Body = () => {
    const appRouter = createBrowserRouter([
        {
            path:"/",
            element: <Login/>,
        },
        {
            path:"/browse",
            element: <Browse/>,
        },
        {
            path:"/browse/tv-shows",
            element:<TVShow/>
        },
        {
            path:"/browse/movies",
            element:<Movies/>
        },
        {
            path:"/browse/my-list",
            element:<MyList/>
        }
    ]);
    
    return (
        <>
            <RouterProvider router={appRouter}/>
        </>
    )
}

export default Body