import { useAuth } from "../context/AuthContext";
import { FaSignInAlt, FaSignOutAlt, FaUpload, FaImages, FaBars, FaTimes, FaShare, FaFileAlt } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { HiOutlineMenuAlt3 } from "react-icons/hi";

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    const handleLogout = async () => {
        setIsLoading(true);
        localStorage.clear(); // Clear local storage
        await logout();
        setIsLoading(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMenuOpen && 
                menuRef.current && 
                !menuRef.current.contains(event.target) &&
                !buttonRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setIsMenuOpen(false);
            }
        };

        // Add event listeners
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        
        // Prevent body scroll when menu is open
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            // Clean up event listeners
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    const NavLink = ({ to, icon: Icon, text, onClick }) => (
        <Link
            to={to}
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 
                ${location.pathname === to 
                    ? 'bg-indigo-600 text-white' 
                    : 'hover:bg-indigo-100 hover:text-indigo-600 text-gray-200'}
                transform hover:scale-105 active:scale-95 md:w-auto w-full`}
        >
            <Icon className="text-lg" />
            <span>{text}</span>
        </Link>
    );

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className="p-4 relative mt-4 bg-gray-600 rounded-full m-1 w-[80%] text-white shadow-lg z-50 ">
            <div className="max-w-7xl mx-auto flex justify-between items-center ">
                <Link 
                    to="/" 
                    className="text-2xl font-extrabold text-white bg-clip-text 
                             hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 font-mono "
                >
                    ImageKit
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-4">
                    {user && (
                        <>
                            <NavLink to="/upload" icon={FaUpload} text="Upload" />
                            <NavLink to="/gallery" icon={FaImages} text="Gallery" />
                        </>
                    )}
                    <a
                        href="https://buzz-sphere.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-indigo-100 hover:text-indigo-600 text-gray-200
                                 transition-all duration-200 transform hover:scale-105 active:scale-95"
                    >
                        <FaShare className="text-lg" />
                        <span>ShareText</span>
                    </a>
                    <a
                        href="https://snapdrop.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-indigo-100 hover:text-indigo-600 text-gray-200
                                 transition-all duration-200 transform hover:scale-105 active:scale-95"
                    >
                        <FaFileAlt className="text-lg" />
                        <span>ShareFiles</span>
                    </a>
                    {user ? (
                        <button 
                            onClick={handleLogout} 
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 
                                     transition-all duration-200 transform hover:scale-105 active:scale-95"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-4 border-blue-200 rounded-full animate-spin border-t-blue-500"> </div> 
                            ) : (
                                <>
                                    <FaSignOutAlt className="text-lg" />
                                    <span>Logout</span>
                                </>
                            )}
                        </button>
                    ) : (
                        <Link 
                            to="/login"
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500 hover:bg-indigo-600 
                                     transition-all duration-200 transform hover:scale-105 active:scale-95"
                        >
                            <FaSignInAlt className="text-lg" />
                            <span>Login</span>
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button 
                    ref={buttonRef}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden text-2xl p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                >
                    {isMenuOpen ? <FaTimes /> : <HiOutlineMenuAlt3 />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/40  md:hidden z-40"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* Mobile Menu */}
            <div 
                ref={menuRef}
                className={`
                    fixed right-0 top-0 h-full w-64 bg-gray-800 z-50 transition-transform duration-300 ease-in-out
                    transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
                    md:hidden pt-20 px-4 space-y-4 shadow-xl
                `}
            >
                <div className="flex flex-col gap-4">
                    {user && (
                        <>
                            <NavLink to="/upload" icon={FaUpload} text="Upload" onClick={toggleMenu} />
                            <NavLink to="/gallery" icon={FaImages} text="Gallery" onClick={toggleMenu} />
                        </>
                    )}
                    <a
                        href="https://buzz-sphere.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-indigo-100 hover:text-indigo-600 text-gray-200
                                 transition-all duration-200 transform hover:scale-105 active:scale-95 w-full"
                        onClick={toggleMenu}
                    >
                        <FaShare className="text-lg" />
                        <span>ShareText</span>
                    </a>
                    <a
                        href="https://snapdrop.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-indigo-100 hover:text-indigo-600 text-gray-200
                                 transition-all duration-200 transform hover:scale-105 active:scale-95 w-full"
                        onClick={toggleMenu}
                    >
                        <FaFileAlt className="text-lg" />
                        <span>ShareFiles</span>
                    </a>
                    {user ? (
                        <button 
                            onClick={() => { handleLogout(); toggleMenu(); }}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 
                                     transition-all duration-200 transform hover:scale-105 active:scale-95 w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="loader"></span> // Add a loader component or CSS here
                            ) : (
                                <>
                                    <FaSignOutAlt className="text-lg" />
                                    <span>Logout</span>
                                </>
                            )}
                        </button>
                    ) : (
                        <Link 
                            to="/login"
                            onClick={toggleMenu}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500 hover:bg-indigo-600 
                                     transition-all duration-200 transform hover:scale-105 active:scale-95 w-full"
                        >
                            <FaSignInAlt className="text-lg" />
                            <span>Login</span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
