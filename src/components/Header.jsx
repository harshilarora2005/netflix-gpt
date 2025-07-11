/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import logo from "/logo-nobg.png";
import avatar from "../assets/Netflix-avatar.png";
import { useLocation, Link, useNavigate } from "react-router";
import { useEffect } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useDispatch, useSelector } from "react-redux";
import { removeUser, addUser} from "../utils/userSlice";
const Header = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const userStore = useSelector((store)=>store.user);
    const isBrowsePage = location.pathname === "/browse";
    const navigate = useNavigate();
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

    return (
        <header className="top-0 z-50 fixed w-full px-6 py-4 bg-gradient-to-b from-black/80 to-transparent shadow-inner">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center space-x-8">
                    <div className="relative h-20 w-48"> 
                        <img 
                            src={logo} 
                            onClick={()=>navigate("/browse")}
                            alt="Netflix Logo" 
                            className="h-50 w-auto absolute object-contain -top-15 -left-15"
                        />
                    </div>
                    {isBrowsePage && (
                        <nav className="flex items-center space-x-6">
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
                    <div className="flex items-center space-x-4">
                        
                        <div className="relative">
                            <img 
                                src={userStore?.photoURL}
                                alt="User Profile" 
                                className="h-10 w-10 rounded-sm cursor-pointer hover:scale-110 transition-transform duration-200"
                            />
                        </div>
                        <button 
                            onClick={handleSignOut}
                            className="text-white text-sm font-medium hover:text-gray-300 transition-colors duration-200 px-3 py-1 rounded hover:bg-red-600/20"
                        >
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;