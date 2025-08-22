// src/components/Navbar.js
import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

    // ← Grab your user JSON however you persist it on login:
    const stored = localStorage.getItem('user');          // e.g. {"name":"Alice Wonderland", ...}
    const userObj = stored ? JSON.parse(stored) : null;
    const userName = userObj?.name || userObj?.username || '';

    // derive initials in uppercase
    const userInitials = userName
        .split(' ')
        .map(n => n[0] || '')
        .join('')
        .slice(0, 2)
        .toUpperCase();

    const toggleMenu = () => setIsMenuOpen(open => !open);
    const toggleProfile = () => setIsProfileOpen(open => !open);

    // close dropdown if clicking outside
    useEffect(() => {
        const onClickOutside = e => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    const handleLogout = () => {
        // ← clear your auth tokens here
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/" className="logo">SionDrop</Link>
                <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
                    <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
                </button>
            </div>

            <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                <Link
                    to="/"
                    className={location.pathname === '/' ? 'active' : ''}
                    onClick={() => setIsMenuOpen(false)}
                >Home</Link>

                <Link
                    to="/mode-selection"
                    className={location.pathname === '/mode-selection' ? 'active' : ''}
                    onClick={() => setIsMenuOpen(false)}
                >Modes</Link>

                {/* ↓ Profile avatar + dropdown */}
                <div className="navbar-profile" ref={profileRef}>
                    <button
                        className="avatar-btn"
                        onClick={toggleProfile}
                        aria-label="Toggle profile menu"
                    >
                        <span>{userInitials}</span>
                    </button>

                    {isProfileOpen && (
                        <ul className="dropdown-menu">
                            <li>
                                <Link to="/profile" onClick={() => setIsProfileOpen(false)}>
                                    Profile
                                </Link>
                            </li>
                            <li>
                                <Link to="/booking-history" onClick={() => setIsProfileOpen(false)}>
                                    Booking History
                                </Link>
                            </li>
                            <li>
                                <button onClick={handleLogout} className="logout-btn">
                                    Logout
                                </button>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
