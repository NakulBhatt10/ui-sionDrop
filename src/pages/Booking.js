import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const MyBookingsSection = ({ currentBooking, mode, modeConfig, onCancel, onNewBooking }) => {
    if (!currentBooking) {
        return (
            <div className="my-bookings-empty">
                <h2>My Bookings</h2>
                <div className="empty-state">
                    <span className="empty-icon">📅</span>
                    <p>You don't have any active bookings</p>
                </div>
            </div>
        );
    }

    return (
        <div className="my-bookings-section">
            <h2>My Current Booking</h2>
            <div className="current-booking-card">
                <div className="booking-header">
                    <span className="mode-icon">{modeConfig[mode]?.icon}</span>
                    <span className="mode-name">{mode}</span>
                </div>
                <div className="booking-info">
                    <div className="info-row">
                        <span className="label">Time:</span>
                        <span className="value">{currentBooking.time}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Booking ID:</span>
                        <span className="value">#{currentBooking.id}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Other Participants:</span>
                        <span className="value">{currentBooking.otherParticipants}</span>
                    </div>
                </div>
                <div className="booking-actions">
                    <button
                        className="cancel-booking-button"
                        onClick={(e) => onCancel(currentBooking, e)}
                    >
                        Cancel Booking
                    </button>
                    <button
                        className="new-booking-button"
                        onClick={onNewBooking}
                    >
                        Book Another Slot
                    </button>
                </div>
            </div>
        </div>
    );
};

const Booking = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const mode = searchParams.get('mode');

    const [currentTime, setCurrentTime] = useState(new Date());
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [userHasBooked, setUserHasBooked] = useState(false);
    const [bookingError, setBookingError] = useState(null);

    const modeConfig = {
        taxi: { capacity: 4, icon: '🚕', color: '#FFD100' },
        'auto rickshaw': { capacity: 3, icon: '🛺', color: '#00A36C' },
        walking: { capacity: Infinity, icon: '🚶', color: '#FF6B6B' }
    };

    useEffect(() => {
        const generateSlots = () => {
            const now = new Date();
            const slots = [];
            for (let i = 0; i < 6; i++) {
                const slotTime = new Date(now.getTime() + (i * 10 * 60000));
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
        }, 60000);

        return () => clearInterval(interval);
    }, [mode]);

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const [closedSlots, setClosedSlots] = useState([]);

    const handleCloseSlot = (slotId) => {
        if (window.confirm('Are you sure you want to close this slot?')) {
            setClosedSlots([...closedSlots, slotId]);
        }
    };

    const handleReopenSlot = (slotId) => {
        if (window.confirm('Do you want to reopen this slot?')) {
            setClosedSlots(closedSlots.filter(id => id !== slotId));
        }
    };

    const getSlotStatus = (slot) => {
        if (closedSlots.includes(slot.id)) return 'Closed';
        if (isSlotFull(slot)) return 'Full - Booking Closed';
        const remainingCapacity = slot.capacity - slot.participants.length;
        if (slot.time < currentTime) return 'Expired';
        return `${remainingCapacity} spots left`;
    };

    const mockParticipants = {
        'user1': { name: 'John D.', contact: '+91 98765-XXXXX', rating: 4.5, trips: 12 },
        'user2': { name: 'Sarah M.', contact: '+91 87654-XXXXX', rating: 4.8, trips: 25 },
        'user3': { name: 'Raj K.', contact: '+91 76543-XXXXX', rating: 4.2, trips: 8 }
    };

    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [showContactInfo, setShowContactInfo] = useState(false);
    const [bookingStatus, setBookingStatus] = useState({ status: null, message: '' });

    const handleBookSlot = (slot) => {
        if (userHasBooked) {
            setBookingError({
                type: 'error',
                message: "You can only book one slot at a time. Please cancel your existing booking to book a new slot."
            });
            return;
        }

        if (slot.time < currentTime || slot.participants.length >= slot.capacity || closedSlots.includes(slot.id)) {
            return;
        }

        setBookingStatus({ status: 'pending', message: 'Processing your booking...' });

        setTimeout(() => {
            const updatedSlots = slots.map(s => {
                if (s.id === slot.id) {
                    const updatedParticipants = [...s.participants, {
                        id: 'current-user',
                        name: 'You',
                        contact: '+91 99999-XXXXX',
                        rating: 4.0,
                        trips: 5
                    }];
                    if (updatedParticipants.length >= s.capacity) {
                        setClosedSlots(prev => [...prev, s.id]);
                    }
                    return { ...s, participants: updatedParticipants };
                }
                return s;
            });

            setSlots(updatedSlots);
            setUserHasBooked(true);
            setSelectedSlot(slot);
            setBookingError(null);
            setBookingStatus({ status: 'success', message: `Successfully booked for ${formatTime(slot.time)}` });

            setTimeout(() => {
                setBookingStatus({ status: null, message: '' });
            }, 3000);
        }, 800);
    };

    const handleCancelBooking = (slot, e) => {
        e?.stopPropagation(); // safe optional chaining

        if (window.confirm('Are you sure you want to cancel your booking?')) {
            const updatedSlots = slots.map(s => {
                if (s.id === slot.id) {
                    return { ...s, participants: s.participants.filter(p => p.id !== 'current-user') };
                }
                return s;
            });
            setSlots(updatedSlots);
            setUserHasBooked(false);
            setSelectedSlot(null);
            setBookingError({
                type: 'success',
                message: "Your booking has been successfully cancelled."
            });
            setTimeout(() => setBookingError(null), 3000);
        }
    };

    const isSlotFull = (slot) => slot.participants.length >= slot.capacity;

    const handleShowContact = (participant) => {
        setSelectedParticipant(participant);
        setShowContactInfo(true);
    };

    const [showBookingForm, setShowBookingForm] = useState(true);

    const handleNewBooking = () => {
        setShowBookingForm(true);
    };

    return (
        <div className="booking-page">
            <div className="booking-sections">
                <MyBookingsSection
                    currentBooking={selectedSlot ? {
                        id: `${selectedSlot.id}-${Date.now().toString().slice(-4)}`,
                        time: formatTime(selectedSlot.time),
                        otherParticipants: selectedSlot.participants.filter(p => p.id !== 'current-user').length,
                    } : null}
                    mode={mode}
                    modeConfig={modeConfig}
                    onCancel={handleCancelBooking}
                    onNewBooking={handleNewBooking}
                />

                {showBookingForm && (
                    <div className="booking-form-section">
                        <div className="booking-header">
                            <span className="mode-icon">{modeConfig[mode]?.icon}</span>
                            <h1>Book your {mode} slot</h1>
                        </div>

                        <div className="current-time">
                            Current Time: {formatTime(currentTime)}
                        </div>

                        {bookingStatus.status && (
                            <div className={`booking-status-message ${bookingStatus.status}`}>
                                {bookingStatus.status === 'pending' && <span className="loading-spinner"></span>}
                                {bookingStatus.message}
                            </div>
                        )}

                        {bookingError && (
                            <div className={`booking-error-message ${bookingError.type}`}>
                                {bookingError.message}
                            </div>
                        )}

                        <div className="slots-container">
                            {slots.map((slot) => (
                                <div
                                    key={slot.id}
                                    className={`slot-card ${slot.isActive ? 'active' : ''} 
                                        ${slot.time < currentTime ? 'expired' : ''}
                                        ${closedSlots.includes(slot.id) || isSlotFull(slot) ? 'closed' : ''}
                                        ${selectedSlot?.id === slot.id ? 'selected' : ''}`}
                                    style={{ '--card-color': modeConfig[mode]?.color }}
                                >
                                    <div className="slot-time">{formatTime(slot.time)}</div>
                                    <div className="slot-status">
                                        <span className={isSlotFull(slot) ? 'full-status' : ''}>
                                            {getSlotStatus(slot)}
                                        </span>
                                    </div>
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
                                    <div className="slot-actions">
                                        {slot.participants.some(p => p.id === 'current-user') ? (
                                            <div className="cancel-booking-container">
                                                <button
                                                    className="cancel-button"
                                                    onClick={(e) => handleCancelBooking(slot, e)}
                                                    data-tooltip="Cancel your booking for this time slot"
                                                >
                                                    <span className="cancel-icon">✕</span>
                                                    <span className="cancel-text">Cancel Booking</span>
                                                    <span className="cancel-time">{formatTime(slot.time)}</span>
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                className="book-button"
                                                disabled={
                                                    slot.time < currentTime ||
                                                    isSlotFull(slot) ||
                                                    closedSlots.includes(slot.id) ||
                                                    userHasBooked
                                                }
                                                onClick={() => handleBookSlot(slot)}
                                                data-tooltip={
                                                    userHasBooked ? "You already have a booking" :
                                                        isSlotFull(slot) ? "This slot is full" :
                                                            "Click to book this time slot"
                                                }
                                            >
                                                {userHasBooked ? 'Already Booked' : isSlotFull(slot) ? 'Slot Full' : 'Book Now'}
                                            </button>
                                        )}
                                        {!isSlotFull(slot) && !closedSlots.includes(slot.id) && (
                                            <button
                                                className="close-slot-button"
                                                onClick={() => handleCloseSlot(slot.id)}
                                                disabled={slot.time < currentTime}
                                                data-tooltip="Close this slot for bookings"
                                            >
                                                Close Slot
                                            </button>
                                        )}
                                        {(isSlotFull(slot) || closedSlots.includes(slot.id)) && (
                                            <button
                                                className="reopen-slot-button"
                                                onClick={() => handleReopenSlot(slot.id)}
                                                disabled={slot.time < currentTime}
                                                data-tooltip="Reopen this slot for bookings"
                                            >
                                                Reopen Slot
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {showContactInfo && selectedParticipant && (
                            <div className="contact-modal-overlay" onClick={() => setShowContactInfo(false)}>
                                <div className="contact-modal" onClick={e => e.stopPropagation()}>
                                    <button className="close-modal" onClick={() => setShowContactInfo(false)}>×</button>
                                    <div className="contact-header">
                                        <span className="contact-avatar">{selectedParticipant.name.charAt(0)}</span>
                                        <h3>{selectedParticipant.name}</h3>
                                    </div>
                                    <div className="contact-details">
                                        <div className="contact-info-row">
                                            <span className="info-label">Contact:</span>
                                            <span className="info-value">{selectedParticipant.contact}</span>
                                        </div>
                                        <div className="contact-info-row">
                                            <span className="info-label">Rating:</span>
                                            <span className="info-value">{selectedParticipant.rating} ⭐</span>
                                        </div>
                                        <div className="contact-info-row">
                                            <span className="info-label">Total Trips:</span>
                                            <span className="info-value">{selectedParticipant.trips}</span>
                                        </div>
                                    </div>
                                    <button className="contact-action-btn">📞 Call Participant</button>
                                    <button className="contact-action-btn message">💬 Send Message</button>
                                </div>
                            </div>
                        )}

                        {selectedSlot && (
                            <div className="booking-confirmation">
                                <div className="confirmation-content">
                                    <h3>Booking Confirmed! 🎉</h3>
                                    <div className="confirmation-details">
                                        <p className="time">
                                            <span className="label">Time:</span>
                                            {formatTime(selectedSlot.time)}
                                        </p>
                                        <p className="mode">
                                            <span className="label">Mode:</span>
                                            {mode} {modeConfig[mode]?.icon}
                                        </p>
                                        <p className="participants">
                                            <span className="label">Other Participants:</span>
                                            {selectedSlot.participants.filter(p => p.id !== 'current-user').length}
                                        </p>
                                    </div>
                                    <div className="confirmation-instructions">
                                        <p>Please arrive 5 minutes before the scheduled time.</p>
                                        <p>Your booking reference: #{selectedSlot.id}-{Date.now().toString().slice(-4)}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Booking;

