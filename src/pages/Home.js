import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home-container">
            <div className="hero-section">
                <h1 className="tagline">
                    Share the Ride, to{' '}
                    <span className="highlight">
                        <TypeAnimation
                            sequence={[
                                'Save the World 🌍',
                                2000,
                                'Make New Friends 🤝',
                                2000,
                                'Build Connections 🔗',
                                2000,
                                'Create Happy Moments 😊',
                                2000,
                            ]}
                            wrapper="span"
                            speed={50}
                            repeat={Infinity}
                        />
                    </span>
                </h1>
                <Link to="/mode-selection" className="find-ride-btn">
                    Find Ridemate
                </Link>
            </div>
        </div>
    );
};

export default Home; 