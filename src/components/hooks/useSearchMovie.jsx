import { API_OPTIONS } from "../../utils/constants";

const useSearchMovies = () => {
    const searchMovie = async (query) => {
        if (!query || query.trim() === "") return null;

        try {
        const res = await fetch(
            `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`,
            API_OPTIONS
        );
        const json = await res.json();
        return json.results?.[0] || null;
        } catch (err) {
        console.error("Search movie error:", err);
        return null;
        }
    };

    return searchMovie;
};

export default useSearchMovies;
