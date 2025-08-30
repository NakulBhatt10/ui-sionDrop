import { useNavigate } from 'react-router-dom';
import './ms.css';

import TaxiGif from '../../assets/taxi.gif';
import AutoGif from '../../assets/auto.gif';
import WalkingGif from '../../assets/walk2.gif';

const MODES = [
    { id: 'taxi', label: 'Taxi', media: TaxiGif, color: '#FFD100' },
    { id: 'auto', label: 'Auto Rickshaw', media: AutoGif, color: '#00A36C' },
    { id: 'walking', label: 'Walking', media: WalkingGif, color: '#FF6B6B' },
];

export default function ModeSelection() {
    const navigate = useNavigate();

    return (
        <div className="mode-selection-page">
            <h1>Choose Your Travel Mode</h1>

            <div className="mode-cards">
                {MODES.map(({ id, label, media, color }) => (
                    <div
                        key={id}
                        className="mode-card"
                        style={{ borderTop: `4px solid ${color}` }}
                    >
                        <div className="mode-icon" style={{ backgroundColor: color }}>
                            <img src={media} alt={label} />
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
