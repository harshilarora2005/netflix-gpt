import { ChevronDown } from 'lucide-react';

const GenreFilter = ({
    genres = [],
    selectedGenre = null,
    onSelectGenre = () => {},
    onClear = () => {},
    dropdownOpen = false,
    setDropdownOpen = () => {},
}) => {
    return (
        <div className="flex items-center gap-4 mb-6">
            <span className="text-white text-lg">Genres:</span>
            <div className="relative">
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                    {selectedGenre ? selectedGenre.name : 'All Genres'}
                    <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
                        <button
                            onClick={() => {
                                onClear();
                                setDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors"
                        >
                            All Genres
                        </button>
                        {genres.map((genre) => (
                            <button
                                key={genre.id}
                                onClick={() => {
                                    onSelectGenre(genre);
                                    setDropdownOpen(false);
                                }}
                                className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors"
                            >
                                {genre.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenreFilter;
