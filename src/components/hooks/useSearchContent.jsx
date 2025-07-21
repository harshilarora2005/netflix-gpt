import { API_OPTIONS } from "../../utils/constants";

const useSearchContent = () => {
    const searchContent = async (query, type = 'multi') => {
        if (!query || query.trim() === "") return null;

        try {
            const res = await fetch(
                `https://api.themoviedb.org/3/search/${type}?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`,
                API_OPTIONS
            );
            const json = await res.json();
            const filteredResults = json.results?.filter(item => 
                item.media_type === 'movie' || item.media_type === 'tv'
            ) || [];
            
            return filteredResults[0] || null;
        } catch (err) {
            console.error("Search content error:", err);
            return null;
        }
    };

    return searchContent;
};

export default useSearchContent;