import logo from "/logo-nobg.png"
import { useLocation } from "react-router";
const Header = () => {
    const location = useLocation();
    const isBrowsePage = location.pathname === "/browse";
    return (
        <header className="w-full px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="relative h-20 w-48 "> 
                    <img 
                        src={logo} 
                        alt="Netflix Logo" 
                        className="h-50 w-auto object-contain absolute -top-15 left-0"
                    />
                </div>
                
                {/* Right side - Navigation */}
                <nav className={`items-center space-x-6 ${isBrowsePage ? 'flex' : 'hidden' }`}>
                    <a href="#" className="text-white text-sm hover:text-gray-300">Home</a>
                    <a href="#" className="text-white text-sm hover:text-gray-300">TV Shows</a>
                    <a href="#" className="text-white text-sm hover:text-gray-300">Movies</a>
                    <a href="#" className="text-white text-sm hover:text-gray-300">My List</a>
                </nav>
            </div>
        </header>
    );
};

export default Header;