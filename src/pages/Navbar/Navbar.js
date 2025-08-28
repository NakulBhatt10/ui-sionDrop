import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './navbar.css';
import defaultAvatar from "../../assets/Screenshot 2025-08-29 010538.png";

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

    const stored = localStorage.getItem('user');
    const userObj = stored ? JSON.parse(stored) : null;
    const userName = userObj?.name || userObj?.username || '';
    const userAvatar = userObj?.avatar || null;


    const userInitials = userName
        .split(' ')
        .map(n => n[0] || '')
        .join('')
        .slice(0, 2)
        .toUpperCase();

    const toggleMenu = () => setIsMenuOpen(open => !open);
    const toggleProfile = () => setIsProfileOpen(open => !open);

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
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/home" className="logo">SionDrop</Link>
                <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
                    <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
                </button>
            </div>

            <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                <Link
                    to="/home"
                    className={location.pathname === '/' ? 'active' : ''}
                    onClick={() => setIsMenuOpen(false)}
                >Home</Link>

                <Link
                    to="/mode-selection"
                    className={location.pathname === '/mode-selection' ? 'active' : ''}
                    onClick={() => setIsMenuOpen(false)}
                >Modes</Link>

                <div className="navbar-profile" ref={profileRef}>
                    <button
                        className="avatar-btn"
                        onClick={toggleProfile}
                        aria-label="Toggle profile menu"
                    >
                        {userAvatar ? (
                            <img
                                src={userAvatar || defaultAvatar}
                                alt="Profile"
                                className="profile-photo"
                            />
                        ) : (
                            <span>{userInitials}</span>
                        )}
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
