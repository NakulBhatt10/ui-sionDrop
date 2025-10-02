import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(open => !open);

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

                <Link
                    to="/profile"
                    className={`nav-link-with-icon ${location.pathname === '/profile' ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                >
                    Profile</Link>

                <Link
                    to="/booking-history"
                    className={location.pathname === '/booking-history' ? 'active' : ''}
                    onClick={() => setIsMenuOpen(false)}
                >Booking History</Link>

                <button
                    onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                    }}
                    className="nav-logout-btn"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
