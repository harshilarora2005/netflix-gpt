import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Header from "./Header";
import { getUserList } from "../utils/firebaselist";
import { IMG_CDN } from "../utils/constants";
import { Play, Info, X } from "lucide-react";

const MyList = () => {
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = useSelector((store) => store.user);

    useEffect(() => {
        const fetchUserList = async () => {
            if (!user?.uid) return;
            
            try {
                setLoading(true);
                const list = await getUserList(user.uid);
                setUserList(list);
            } catch (error) {
                console.error("Error fetching user list:", error);
                setError("Failed to load your list");
            } finally {
                setLoading(false);
            }
        };

        fetchUserList();
    }, [user?.uid]);

    const removeFromList = async (itemId) => {
        try {
            const { removeFromUserList } = await import("../utils/firebaselist");
            await removeFromUserList(user.uid, itemId);
            setUserList(prev => prev.filter(item => item.id !== itemId));
        } catch (error) {
            console.error("Error removing from list:", error);
        }
    };

    if (loading) {
        return (
            <div className="bg-black min-h-screen">
                <Header />
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-white text-xl">Loading your list...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-black min-h-screen">
                <Header />
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-red-500 text-xl">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen">
            <Header />
            <div className="pt-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-white mb-8">My List</h1>
                    
                    {userList.length === 0 ? (
                        <div className="text-center py-20">
                            <h2 className="text-2xl text-gray-400 mb-4">Your list is empty</h2>
                            <p className="text-gray-500">
                                Browse movies and TV shows to add them to your list
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {userList.map((item) => (
                                <div
                                    key={item.id}
                                    className="relative group cursor-pointer transform hover:scale-105 transition-transform duration-300"
                                >
                                    <div className="relative overflow-hidden rounded-lg">
                                        <img
                                            src={
                                                item.poster_path
                                                    ? IMG_CDN + item.poster_path
                                                    : "/placeholder-movie.jpg"
                                            }
                                            alt={item.title || item.name}
                                            className="w-full h-64 object-cover rounded-lg z-0"
                                        />

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center z-10 rounded-lg">
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                                                <button className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors">
                                                    <Play size={16} />
                                                </button>
                                                <button className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors">
                                                    <Info size={16} />
                                                </button>
                                                <button
                                                    onClick={() => removeFromList(item.id)}
                                                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-2">
                                        <h3 className="text-white text-sm font-medium truncate">
                                            {item.title || item.name}
                                        </h3>
                                        <p className="text-gray-400 text-xs">
                                            {item.release_date || item.first_air_date ? 
                                                new Date(item.release_date || item.first_air_date).getFullYear() : 
                                                'N/A'
                                            }
                                        </p>
                                        <p className="text-gray-500 text-xs capitalize">
                                            {item.media_type || 'movie'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyList;
