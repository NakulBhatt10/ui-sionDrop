import React from 'react';

const RouteMap = ({ mode }) => {
    return (
        <div className="route-map-container">
            <h3>Route Map</h3>
            <div className="static-map">
                <div className="map-points">
                    <div className="point start">
                        <span className="point-icon">📍</span>
                        <span className="point-label">KJ Somaiya Institute</span>
                    </div>
                    <div className="route-line">
                        <span className="transport-icon">
                            {mode === 'walking' ? '🚶' : mode === 'taxi' ? '🚕' : '🛺'}
                        </span>
                    </div>
                    <div className="point end">
                        <span className="point-icon">🎯</span>
                        <span className="point-label">Sion Station</span>
                    </div>
                </div>
                <div className="route-info">
                    <div className="info-item">
                        <span className="info-label">Distance:</span>
                        <span className="info-value">2.5 km</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Est. Time:</span>
                        <span className="info-value">
                            {mode === 'walking' ? '30 mins' : '10 mins'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RouteMap; 