import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './navbar.css';
import profileUserImage from "../../assets/profile-user.png";

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

    const stored = localStorage.getItem('user');
    const userObj = stored ? JSON.parse(stored) : null;
    const userAvatar = userObj?.avatar || null;



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
            </div>

            <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
                <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
            </button>

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
                        className="avatar-photo-btn"
                        onClick={toggleProfile}
                        aria-label="Toggle profile menu"
                    >
                        {userAvatar ? (
                            <img
                                src={userAvatar || profileUserImage}
                                alt="Profile"
                                className="profile-photo"
                            />
                        ) : (
                            <img
                                src={profileUserImage}
                                alt="Profile"
                                className="profile-photo"
                            />
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
