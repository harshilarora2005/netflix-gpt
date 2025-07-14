import MovieSuggestions from "./MovieSuggestions";
import SearchBar from "./SearchBar";

const Explore = () => {
    return (
        <div className="min-h-screen">
            <SearchBar/>
            <MovieSuggestions/>
        </div>
    )
}

export default Explore;