import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Booking = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const mode = searchParams.get('mode');

    const [currentTime, setCurrentTime] = useState(new Date());
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);

    // Mode configurations
    const modeConfig = {
        taxi: {
            capacity: 4,
            icon: '🚕',
            color: '#FFD100'
        },
        'auto rickshaw': {
            capacity: 3,
            icon: '🛺',
            color: '#00A36C'
        },
        walking: {
            capacity: Infinity,
            icon: '🚶',
            color: '#FF6B6B'
        }
    };

    // Generate time slots
    useEffect(() => {
        const generateSlots = () => {
            const now = new Date();
            const slots = [];

            // Generate next 6 slots (1 hour)
            for (let i = 0; i < 6; i++) {
                const slotTime = new Date(now.getTime() + (i * 10 * 60000)); // 10 minutes intervals
                slots.push({
                    id: i,
                    time: slotTime,
                    participants: [],
                    isActive: i === 0,
                    capacity: modeConfig[mode]?.capacity || Infinity
                });
            }
            setSlots(slots);
        };

        generateSlots();
        const interval = setInterval(() => {
            setCurrentTime(new Date());
            generateSlots();
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [mode]);

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getSlotStatus = (slot) => {
        const remainingCapacity = slot.capacity - slot.participants.length;
        if (slot.time < currentTime) return 'Expired';
        if (remainingCapacity === 0) return 'Full';
        return `${remainingCapacity} spots left`;
    };

    // Add mock participant data (in real app, this would come from an API)
    const mockParticipants = {
        'user1': { name: 'John D.', contact: '+91 98765-XXXXX', rating: 4.5, trips: 12 },
        'user2': { name: 'Sarah M.', contact: '+91 87654-XXXXX', rating: 4.8, trips: 25 },
        'user3': { name: 'Raj K.', contact: '+91 76543-XXXXX', rating: 4.2, trips: 8 }
    };

    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [showContactInfo, setShowContactInfo] = useState(false);

    // Update handleBookSlot to include more participant info
    const handleBookSlot = (slot) => {
        if (slot.time < currentTime || slot.participants.length >= slot.capacity) {
            return;
        }
        setSelectedSlot(slot);
        const updatedSlots = slots.map(s => {
            if (s.id === slot.id) {
                return {
                    ...s,
                    participants: [...s.participants, {
                        id: 'current-user',
                        name: 'You',
                        contact: '+91 99999-XXXXX',
                        rating: 4.0,
                        trips: 5
                    }]
                };
            }
            return s;
        });
        setSlots(updatedSlots);
    };

    const handleShowContact = (participant) => {
        setSelectedParticipant(participant);
        setShowContactInfo(true);
    };

    return (
        <div className="booking-page">
            <div className="booking-header">
                <span className="mode-icon">{modeConfig[mode]?.icon}</span>
                <h1>Book your {mode} slot</h1>
            </div>

            <div className="current-time">
                Current Time: {formatTime(currentTime)}
            </div>

            <div className="slots-container">
                {slots.map((slot) => (
                    <div
                        key={slot.id}
                        className={`slot-card ${slot.isActive ? 'active' : ''} 
                            ${slot.time < currentTime ? 'expired' : ''}`}
                        style={{ '--card-color': modeConfig[mode]?.color }}
                    >
                        <div className="slot-time">{formatTime(slot.time)}</div>
                        <div className="slot-status">{getSlotStatus(slot)}</div>
                        <div className="slot-participants">
                            {slot.participants.map((participant, index) => (
                                <span
                                    key={index}
                                    className="participant"
                                    onClick={() => handleShowContact(participant)}
                                >
                                    {participant.name}
                                    <span className="participant-info-icon">ℹ️</span>
                                </span>
                            ))}
                        </div>
                        <button
                            className="book-button"
                            disabled={slot.time < currentTime ||
                                slot.participants.length >= slot.capacity}
                            onClick={() => handleBookSlot(slot)}
                        >
                            Book Now
                        </button>
                    </div>
                ))}
            </div>

            {/* Contact Information Modal */}
            {showContactInfo && selectedParticipant && (
                <div className="contact-modal-overlay" onClick={() => setShowContactInfo(false)}>
                    <div className="contact-modal" onClick={e => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setShowContactInfo(false)}>×</button>
                        <div className="contact-header">
                            <span className="contact-avatar">
                                {selectedParticipant.name.charAt(0)}
                            </span>
                            <h3>{selectedParticipant.name}</h3>
                        </div>
                        <div className="contact-details">
                            <div className="contact-info-row">
                                <span className="info-label">Contact:</span>
                                <span className="info-value">{selectedParticipant.contact}</span>
                            </div>
                            <div className="contact-info-row">
                                <span className="info-label">Rating:</span>
                                <span className="info-value">
                                    {selectedParticipant.rating} ⭐
                                </span>
                            </div>
                            <div className="contact-info-row">
                                <span className="info-label">Total Trips:</span>
                                <span className="info-value">{selectedParticipant.trips}</span>
                            </div>
                        </div>
                        <button className="contact-action-btn">
                            📞 Call Participant
                        </button>
                        <button className="contact-action-btn message">
                            💬 Send Message
                        </button>
                    </div>
                </div>
            )}

            {selectedSlot && (
                <div className="booking-confirmation">
                    <h3>Booking Confirmed!</h3>
                    <p>Your slot is booked for {formatTime(selectedSlot.time)}</p>
                    <p>Please arrive 5 minutes before the scheduled time.</p>
                </div>
            )}
        </div>
    );
};

export default Booking; 