import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [location]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav
            id="main-navbar"
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                scrolled
                    ? 'glass-nav shadow-ambient py-3'
                    : 'bg-transparent py-5'
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group" id="nav-logo">
                        <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow transition-transform duration-300 group-hover:scale-110">
                            <span className="material-icons-round text-white text-lg">auto_awesome</span>
                        </div>
                        <span className="text-xl font-bold text-on-surface tracking-tight">
                            Learnova
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        <NavLink to="/" active={isActive('/')} label="Home" />
                        <NavLink to="/courses" active={isActive('/courses')} label="Explore" />
                        {user && (
                            <NavLink to="/dashboard" active={isActive('/dashboard')} label="Dashboard" />
                        )}
                    </div>

                    {/* Desktop Auth Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container-low">
                                    <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-on-surface">
                                        {user.name?.split(' ')[0]}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    id="logout-btn"
                                    className="px-4 py-2 rounded-xl text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all duration-300"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    id="nav-login"
                                    className="px-4 py-2 rounded-xl text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all duration-300"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    id="nav-register"
                                    className="btn-primary text-sm !px-5 !py-2.5"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center hover:bg-surface-container-high transition-colors"
                        id="mobile-menu-btn"
                    >
                        <span className="material-icons-round text-on-surface">
                            {mobileOpen ? 'close' : 'menu'}
                        </span>
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="md:hidden mt-4 pb-4 animate-fade-in">
                        <div className="flex flex-col gap-1">
                            <MobileNavLink to="/" active={isActive('/')} label="Home" icon="home" />
                            <MobileNavLink to="/courses" active={isActive('/courses')} label="Explore Courses" icon="explore" />
                            {user && (
                                <MobileNavLink to="/dashboard" active={isActive('/dashboard')} label="Dashboard" icon="dashboard" />
                            )}
                            <div className="h-px bg-outline-variant/20 my-2" />
                            {user ? (
                                <>
                                    <div className="flex items-center gap-3 px-4 py-3">
                                        <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center">
                                            <span className="text-white text-sm font-bold">
                                                {user.name?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-on-surface">{user.name}</p>
                                            <p className="text-xs text-on-surface-variant">{user.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-error hover:bg-red-50 transition-colors"
                                    >
                                        <span className="material-icons-round text-lg">logout</span>
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col gap-2 px-2 pt-2">
                                    <Link to="/login" className="btn-secondary text-center text-sm">Sign In</Link>
                                    <Link to="/register" className="btn-primary text-center text-sm">Get Started</Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

const NavLink = ({ to, active, label }) => (
    <Link
        to={to}
        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
            active
                ? 'text-primary-600 bg-primary-50'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
        }`}
    >
        {label}
    </Link>
);

const MobileNavLink = ({ to, active, label, icon }) => (
    <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
            active
                ? 'text-primary-600 bg-primary-50'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
        }`}
    >
        <span className="material-icons-round text-lg">{icon}</span>
        {label}
    </Link>
);

export default Navbar;
