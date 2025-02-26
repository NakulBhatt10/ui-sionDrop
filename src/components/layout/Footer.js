import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-links">

                </div>




                <div className="social-links">
                    <a
                        href="https://www.linkedin.com/in/nakul-bhatt-157aba24a/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                    >
                        LinkedIn
                    </a>
                    <a
                        href="https://github.com/NakulBhatt10"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                    >
                        GitHub
                    </a>
                    <a
                        href="nakulcodes213@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                    >
                        gmail
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