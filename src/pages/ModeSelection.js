import React from 'react';
import { Link } from 'react-router-dom';

const ModeSelection = () => {
    const modes = [
        {
            id: 1,
            name: 'Taxi',
            icon: '🚕',
            description: 'Share a comfortable taxi ride with verified co-passengers',
            color: '#FFD100'
        },
        {
            id: 2,
            name: 'Auto Rickshaw',
            icon: '🛺',
            description: 'Economic & convenient auto sharing for short distances',
            color: '#00A36C'
        },
        {
            id: 3,
            name: 'Walking',
            icon: '🚶',
            description: 'Find walking buddies for your daily commute',
            color: '#FF6B6B'
        }
    ];

    return (
        <div className="mode-selection-page">
            <h1 className="mode-selection-title">Choose Your Travel Mode</h1>
            <div className="mode-cards">
                {modes.map((mode) => (
                    <Link
                        to={`/booking?mode=${mode.name.toLowerCase()}`}
                        className="mode-card"
                        key={mode.id}
                        style={{ '--card-color': mode.color }}
                    >
                        <div className="mode-icon-wrapper">
                            <span className="mode-emoji">{mode.icon}</span>
                        </div>
                        <h2 className="mode-name">{mode.name}</h2>
                        <p className="mode-description">{mode.description}</p>
                        <button className="select-mode-btn">Select</button>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ModeSelection; 