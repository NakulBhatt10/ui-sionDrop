import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/" className="logo">
                    SionDrop
                </Link>
                <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
                    <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
                </button>
            </div>
            <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                <Link
                    to="/"
                    className={location.pathname === '/' ? 'active' : ''}
                    onClick={() => setIsMenuOpen(false)}
                >
                    Home
                </Link>
                <Link
                    to="/mode-selection"
                    className={location.pathname === '/mode-selection' ? 'active' : ''}
                    onClick={() => setIsMenuOpen(false)}
                >
                    Modes
                </Link>
                <Link
                    to="/booking"
                    className={location.pathname === '/booking' ? 'active' : ''}
                    onClick={() => setIsMenuOpen(false)}
                >
                    Book Now
                </Link>
            </div>
        </nav>
    );
};

export default Navbar; 