import React from 'react';
import { useNavigate } from 'react-router-dom';

const ModeSelection = () => {
    const navigate = useNavigate();

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

    const handleModeSelect = (mode) => {
        navigate(`/booking?mode=${mode.name.toLowerCase()}`);
    };

    return (
        <div className="mode-selection-page">
            <h1 className="mode-selection-title">Choose Your Travel Mode</h1>
            <div className="mode-cards">
                {modes.map((mode) => (
                    <div
                        key={mode.id}
                        className="mode-card"
                        style={{ '--card-color': mode.color }}
                    >
                        <div className="mode-icon-wrapper">
                            <span className="mode-emoji">{mode.icon}</span>
                        </div>
                        <h2 className="mode-name">{mode.name}</h2>
                        <p className="mode-description">{mode.description}</p>
                        <button
                            className="select-mode-btn"
                            onClick={() => handleModeSelect(mode)}
                        >
                            Select
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ModeSelection; 