import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";

const MovieList = ({ title, movies, onLoadMore, hasMore, mediaType='movie' }) => {
    const scrollContainerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const checkScrollability = () => {
        if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
        const scrollAmount = 800;
        const newScrollLeft =
            direction === "left"
            ? scrollContainerRef.current.scrollLeft - scrollAmount
            : scrollContainerRef.current.scrollLeft + scrollAmount;

        scrollContainerRef.current.scrollTo({
            left: newScrollLeft,
            behavior: "smooth",
        });

        setTimeout(checkScrollability, 300);
        }
    };

    const handleScroll = useCallback(() => {
        checkScrollability();

        if (
        !isFetching &&
        hasMore &&
        scrollContainerRef.current
        ) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        if (scrollWidth - scrollLeft - clientWidth < 150) {
            setIsFetching(true);
            onLoadMore()
            .catch(() => {}) 
            .finally(() => setIsFetching(false));
        }
        }
    },[isFetching,hasMore,onLoadMore]);

    useEffect(() => {
        checkScrollability();
        const handleResize = () => checkScrollability();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [movies]);

    if (!movies || movies.length === 0) {
        return null;
    }

    return (
        <div
        className="relative mb-12 group h-full overflow-visible"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        >
        <h2 className="text-white text-xl font-bold mb-4 px-4 md:px-12">{title}</h2>
        <div className="relative px-4 md:px-12 overflow-visible">
            {canScrollLeft && (
            <button
                onClick={() => scroll("left")}
                className={`absolute left-4 md:left-12 top-1/2 transform -translate-y-1/2 z-40 w-12 h-12 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full flex items-center justify-center transition-all duration-200 ${
                isHovered ? "opacity-100" : "opacity-0"
                }`}
            >
                <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            )}
            {canScrollRight && (
            <button
                onClick={() => scroll("right")}
                className={`absolute right-4 md:right-12 top-1/2 transform -translate-y-1/2 z-40 w-12 h-12 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full flex items-center justify-center transition-all duration-200 ${
                isHovered ? "opacity-100" : "opacity-0"
                }`}
            >
                <ChevronRight className="w-6 h-6 text-white" />
            </button>
            )}

            <div
            ref={scrollContainerRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth pt-4 relative z-10"
            onScroll={handleScroll}
            style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                overflowY: "visible",
                overflowX: "auto",
            }}
            >
            {movies.map((movie, index) => (
                <MovieCard key={movie?.id || index} movie={movie} mediaType={mediaType} />
            ))}

            {isFetching && (
                <div className="flex items-center justify-center px-4 text-white">
                Loading...
                </div>
            )}
            </div>
        </div>

        <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
            display: none;
            }
            .line-clamp-1 {
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
            }
            .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            }
        `}</style>
        </div>
    );
};

export default MovieList;
