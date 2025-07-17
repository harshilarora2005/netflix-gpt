import { createBrowserRouter } from "react-router";
import Login from "./Login";
import Browse from "./Browse";
import { RouterProvider} from "react-router";
import TVShow from "./TVShow";
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
        }
    ]);
    
    return (
        <>
            <RouterProvider router={appRouter}/>
        </>
    )
}

export default Body