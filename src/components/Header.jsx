/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import logo from "/logo-nobg.png";
import avatar from "../assets/Netflix-avatar.png";
import { useLocation, Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useDispatch, useSelector } from "react-redux";
import { removeUser, addUser} from "../utils/userSlice";
import { SearchCode , SearchX, Menu, X } from "lucide-react";
import { toggleSearchView } from "../utils/searchSlice";

const Header = () => {
    const showSearch = useSelector((store) => store?.search?.showSearch);
    const location = useLocation();
    const dispatch = useDispatch();
    const userStore = useSelector((store)=>store.user);
    const isBrowsePage = location.pathname === "/browse";
    const navigate = useNavigate();
    const [searchOpen,setSearchOpen] = useState(showSearch);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    const handleSignOut = () => {
        signOut(auth).then(()=>{
            dispatch(removeUser());
            navigate("/");
        }).catch((error)=>{
            navigate("/error");
        })
    }
    
    useEffect(()=>{
        const unsubsrcibe = onAuthStateChanged(auth,(user)=>{
            if(user){
                const {uid,email,displayName,photoURL} = user;
                console.log(photoURL);
                dispatch(addUser({uid:uid,email:email,displayName:displayName,photoURL:photoURL}));
                navigate("/browse");
            }else{
                dispatch(removeUser());
                navigate("/");
            }
        });
        return () => unsubsrcibe();
    },[])
    
    const handleSearchClick = () => {
        dispatch(toggleSearchView());
        setSearchOpen(!searchOpen);
    }
    
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    }

    return (
        <header className="top-0 z-50 fixed w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-b from-black/90 to-transparent shadow-inner">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center space-x-2 sm:space-x-8">
                    <div className="relative h-12 w-24 sm:h-16 sm:w-32 md:h-20 md:w-48 -top-6"> 
                        <img 
                            src={logo} 
                            onClick={()=>navigate("/browse")}
                            alt="Netflix Logo" 
                            className="h-auto w-full absolute object-contain -left-2 sm:-top-4 sm:-left-4 md:-top-6 md:-left-6 cursor-pointer"
                        />
                    </div>
                    {isBrowsePage && (
                        <nav className="hidden lg:flex items-center space-x-6">
                            <Link 
                                to="/browse" 
                                className="text-white text-sm font-medium hover:text-gray-300 transition-colors duration-200"
                            >
                                Home
                            </Link>
                            <Link 
                                to="/browse/tv-shows" 
                                className="text-white text-sm font-medium hover:text-gray-300 transition-colors duration-200"
                            >
                                TV Shows
                            </Link>
                            <Link 
                                to="/browse/movies" 
                                className="text-white text-sm font-medium hover:text-gray-300 transition-colors duration-200"
                            >
                                Movies
                            </Link>
                            <Link 
                                to="/browse/my-list" 
                                className="text-white text-sm font-medium hover:text-gray-300 transition-colors duration-200"
                            >
                                My List
                            </Link>
                        </nav>
                    )}
                </div>
                {isBrowsePage && (
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <button 
                            className="cursor-pointer p-2 sm:p-3 transform hover:scale-110 transition duration-300"
                            onClick={handleSearchClick}
                        >
                            {searchOpen ? (
                                <SearchX color="white" size={20} className="sm:w-6 sm:h-6"/> 
                            ) : (
                                <SearchCode color="white" size={20} className="sm:w-6 sm:h-6"/> 
                            )}
                        </button>
                        <button 
                            className="lg:hidden cursor-pointer p-2 sm:p-3 transform hover:scale-110 transition duration-300"
                            onClick={toggleMobileMenu}
                        >
                            {mobileMenuOpen ? (
                                <X color="white" size={20} className="sm:w-6 sm:h-6"/>
                            ) : (
                                <Menu color="white" size={20} className="sm:w-6 sm:h-6"/>
                            )}
                        </button>

                        <div className="hidden lg:flex items-center space-x-4">
                            <div className="relative">
                                <img 
                                    src={userStore?.photoURL}
                                    alt="User Profile" 
                                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-sm cursor-pointer hover:scale-110 transition-transform duration-200"
                                />
                            </div>
                            <button 
                                onClick={handleSignOut}
                                className="text-white text-sm font-medium hover:text-gray-300 transition-colors duration-200 px-3 py-1 rounded hover:bg-red-600/20"
                            >
                                Sign Out
                            </button>
                        </div>
                        <div className="lg:hidden">
                            <img 
                                src={userStore?.photoURL}
                                alt="User Profile" 
                                className="h-8 w-8 sm:h-10 sm:w-10 rounded-sm cursor-pointer hover:scale-110 transition-transform duration-200"
                            />
                        </div>
                    </div>
                )}
            </div>

            {isBrowsePage && mobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-md border-t border-gray-800">
                    <nav className="flex flex-col p-4 space-y-4">
                        <Link 
                            to="/browse" 
                            className="text-white text-base font-medium hover:text-gray-300 transition-colors duration-200 py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link 
                            to="/browse/tv-shows" 
                            className="text-white text-base font-medium hover:text-gray-300 transition-colors duration-200 py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            TV Shows
                        </Link>
                        <Link 
                            to="/browse/movies" 
                            className="text-white text-base font-medium hover:text-gray-300 transition-colors duration-200 py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Movies
                        </Link>
                        <Link 
                            to="/browse/my-list" 
                            className="text-white text-base font-medium hover:text-gray-300 transition-colors duration-200 py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            My List
                        </Link>
                        <hr className="border-gray-700 my-2" />
                        <button 
                            onClick={() => {
                                handleSignOut();
                                setMobileMenuOpen(false);
                            }}
                            className="text-white text-base font-medium hover:text-gray-300 transition-colors duration-200 py-2 text-left hover:bg-red-600/20 rounded px-2"
                        >
                            Sign Out
                        </button>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;