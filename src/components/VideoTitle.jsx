import { Play, Info } from 'lucide-react';

const VideoTitle = ({ title, overview }) => {
    return (
        <div className="mt-16 absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent flex items-center">
            <div className="ml-8 md:ml-16 max-w-lg md:max-w-2xl"> 
                <h1 className="text-3xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
                    {title}
                </h1>
                <p className="text-sm md:text-lg text-gray-200 mb-6 md:mb-8 line-clamp-3 md:line-clamp-4 drop-shadow-lg leading-relaxed">
                    {overview}
                </p>
                <div className="flex gap-3 md:gap-4">
                    <button className="flex items-center gap-2 bg-white hover:bg-gray-200 text-black px-6 md:px-8 py-2 md:py-3 rounded font-semibold transition-colors duration-200 text-sm md:text-base">
                        <Play className="w-4 h-4 md:w-5 md:h-5 fill-black" />
                        Play
                    </button>
                    <button className="flex items-center gap-2 bg-gray-600/70 hover:bg-gray-600/90 text-white px-6 md:px-8 py-2 md:py-3 rounded font-semibold transition-colors duration-200 text-sm md:text-base">
                        <Info className="w-4 h-4 md:w-5 md:h-5" />
                        More Info
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoTitle;