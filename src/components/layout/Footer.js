import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-links">
                    <Link to="/contact" className="footer-link">Contact Us</Link>
                    <Link to="/about" className="footer-link">About</Link>
                    <Link to="/privacy" className="footer-link">Privacy Policy</Link>
                    <Link to="/terms" className="footer-link">Terms of Service</Link>``
                </div>


                <a href="/contact">Privacy Policy
                    jdskjjnnncls


                </a>
                <div className="social-links">
                    <a
                        href="https://twitter.com/siondrop"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                    >
                        Twitter
                    </a>
                    <a
                        href="https://linkedin.com/company/siondrop"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                    >
                        LinkedIn
                    </a>
                    <a
                        href="https://instagram.com/siondrop"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                    >
                        Instagram
                    </a>
                </div>
                <div className="footer-copyright">
                    <p>© 2025 SionDrop. All rights reserved.</p>
                    <p className="made-with-love">
                        Made with <span className="heart">❤️</span> in Mumbai, India
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 