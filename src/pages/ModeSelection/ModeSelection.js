import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ModeSelection.css';

const MODES = [
    { id: 'taxi', label: 'Taxi', icon: '🚕', color: '#FFD100' },
    { id: 'auto', label: 'Auto Rickshaw', icon: '🛺', color: '#00A36C' },
    { id: 'walking', label: 'Walking', icon: '🚶', color: '#FF6B6B' },
];

export default function ModeSelection() {
    const navigate = useNavigate();

    return (
        <div className="mode-selection-page">
            <h1>Choose Your Travel Mode</h1>
            <div className="mode-cards">
                {MODES.map(({ id, label, icon, color }) => (
                    <div
                        key={id}
                        className="mode-card"
                        style={{ borderTop: `4px solid ${color}` }}
                    >
                        <div className="mode-icon" style={{ backgroundColor: color }}>
                            {icon}
                        </div>
                        <h3>{label}</h3>
                        <button
                            className="select-button"
                            style={{ backgroundColor: color }}
                            onClick={() => navigate(`/booking/${id}`)}
                        >
                            Select
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
