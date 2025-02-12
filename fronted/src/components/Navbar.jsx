import { useAuth } from "../context/AuthContext";
import { FaSignInAlt, FaSignOutAlt, FaUpload, FaImages, FaBars, FaTimes, FaPenSquare, FaUserCircle, FaHome } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { HiOutlineMenuAlt3 } from "react-icons/hi";

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            localStorage.clear();
            await logout();
            navigate('/');  // Redirect to landing page after logout
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setIsLoading(false);
        }
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

    const LogoutButton = ({ isMobile = false }) => (
        <button 
            onClick={() => { 
                handleLogout();
                if (isMobile) toggleMenu();
            }}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 
                     transition-all duration-200 transform hover:scale-105 active:scale-95 
                     ${isMobile ? 'w-full' : ''}`}
            disabled={isLoading}
        >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
                <>
                    <FaSignOutAlt className="text-lg" />
                    <span>Logout</span>
                </>
            )}
        </button>
    );

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
                            <NavLink to="/dashboard" icon={FaHome} text="Dashboard" />
                            <NavLink to="/upload" icon={FaUpload} text="Upload" />
                            <NavLink to="/gallery" icon={FaImages} text="Gallery" />
                            <NavLink to="/create-post" icon={FaPenSquare} text="Create Post" />
                            <NavLink to="/my-posts" icon={FaUserCircle} text="My Posts" />
                        </>
                    )}
                    {user ? (
                        <LogoutButton />
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
                            <NavLink to="/dashboard" icon={FaHome} text="Dashboard" onClick={toggleMenu} />
                            <NavLink to="/upload" icon={FaUpload} text="Upload" onClick={toggleMenu} />
                            <NavLink to="/gallery" icon={FaImages} text="Gallery" onClick={toggleMenu} />
                            <NavLink to="/create-post" icon={FaPenSquare} text="Create Post" onClick={toggleMenu} />
                            <NavLink to="/my-posts" icon={FaUserCircle} text="My Posts" onClick={toggleMenu} />
                        </>
                    )}
                    {user ? (
                        <LogoutButton isMobile={true} />
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
