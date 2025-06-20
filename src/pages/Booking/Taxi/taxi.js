import { useState, useEffect } from 'react';
import './taxi.css';

const mode = 'taxi';
const modeConfig = { taxi: { capacity: 4, icon: '🚕', color: '#FFD100' } };

const MyBookingsSection = ({ currentBooking, onCancel, onNewBooking }) => {
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
                    <span className="mode-icon">{modeConfig[mode].icon}</span>
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
                    <button className="cancel-booking-button" onClick={onCancel}>
                        Cancel Booking
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function Taxi() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [userHasBooked, setUserHasBooked] = useState(false);
    const [bookingError, setBookingError] = useState(null);
    const [closedSlots, setClosedSlots] = useState([]);
    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [showContactInfo, setShowContactInfo] = useState(false);
    const [bookingStatus, setBookingStatus] = useState({ status: null, message: '' });
    const [showBookingForm, setShowBookingForm] = useState(true);

    useEffect(() => {
        const generateSlots = () => {
            const now = new Date();
            const s = [];
            for (let i = 0; i < 6; i++) {
                const slotTime = new Date(now.getTime() + i * 10 * 60000);
                s.push({
                    id: i,
                    time: slotTime,
                    participants: [],
                    isActive: i === 0,
                    capacity: modeConfig[mode].capacity
                });
            }
            setSlots(s);
        };
        generateSlots();
        const iv = setInterval(() => {
            setCurrentTime(new Date());
            generateSlots();
        }, 60000);
        return () => clearInterval(iv);
    }, []);

    const formatTime = d =>
        d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const isFull = slot => slot.participants.length >= slot.capacity;
    const getStatus = slot => {
        if (closedSlots.includes(slot.id)) return 'Closed';
        if (isFull(slot)) return 'Full - Booking Closed';
        if (slot.time < currentTime) return 'Expired';
        return `${slot.capacity - slot.participants.length} spots left`;
    };

    const handleBook = slot => {
        if (userHasBooked) {
            setBookingError({ type: 'error', message: 'You can only book one slot. Cancel first.' });
            return;
        }
        if (slot.time < currentTime || isFull(slot) || closedSlots.includes(slot.id)) return;
        setBookingStatus({ status: 'pending', message: 'Processing...' });
        setTimeout(() => {
            setSlots(slots.map(s => {
                if (s.id === slot.id) {
                    const p = [...s.participants, { id: 'you', name: 'You', contact: '+91 99999-XXXXX', rating: 4.0, trips: 5 }];
                    if (p.length >= s.capacity) setClosedSlots(cs => [...cs, s.id]);
                    return { ...s, participants: p };
                }
                return s;
            }));
            setUserHasBooked(true);
            setSelectedSlot(slot);
            setBookingError(null);
            setBookingStatus({ status: 'success', message: `Booked for ${formatTime(slot.time)}` });
            setTimeout(() => setBookingStatus({ status: null, message: '' }), 3000);
        }, 800);
    };

    const handleCancel = () => {
        if (!window.confirm('Cancel your booking?')) return;
        setSlots(slots.map(s =>
            s.id === selectedSlot.id
                ? { ...s, participants: s.participants.filter(p => p.id !== 'you') }
                : s
        ));
        setUserHasBooked(false);
        setSelectedSlot(null);
        setBookingError({ type: 'success', message: 'Booking cancelled.' });
        setTimeout(() => setBookingError(null), 3000);
    };

    const showContact = p => {
        setSelectedParticipant(p);
        setShowContactInfo(true);
    };

    return (
        <div className="taxi-page">
            <MyBookingsSection
                currentBooking={
                    selectedSlot && {
                        id: `${selectedSlot.id}-${Date.now().toString().slice(-4)}`,
                        time: formatTime(selectedSlot.time),
                        otherParticipants: selectedSlot.participants.length - 1
                    }
                }
                onCancel={handleCancel}
                onNewBooking={() => setShowBookingForm(true)}
            />

            {showBookingForm && (
                <div className="booking-form-section">
                    <div className="booking-header">
                        <span className="mode-icon">{modeConfig[mode].icon}</span>
                        <h1>Book your {mode} slot</h1>
                    </div>

                    <div className="current-time">Current Time: {formatTime(currentTime)}</div>

                    {bookingStatus.status && (
                        <div className={`booking-status-message ${bookingStatus.status}`}>
                            {bookingStatus.status === 'pending' && <span className="loading-spinner" />}
                            {bookingStatus.message}
                        </div>
                    )}

                    {bookingError && (
                        <div className={`booking-error-message ${bookingError.type}`}>
                            {bookingError.message}
                        </div>
                    )}

                    <div className="slots-container">
                        {slots.map(slot => (
                            <div
                                key={slot.id}
                                className={`slot-card${slot.isActive ? ' active' : ''}${slot.time < currentTime ? ' expired' : ''}${(closedSlots.includes(slot.id) || isFull(slot)) ? ' closed' : ''}${selectedSlot?.id === slot.id ? ' selected' : ''}`}
                                style={{ '--card-color': modeConfig[mode].color }}
                            >
                                <div className="slot-time">{formatTime(slot.time)}</div>
                                <div className="slot-status">{getStatus(slot)}</div>
                                <div className="slot-participants">
                                    {slot.participants.map((p, i) => (
                                        <span key={i} className="participant" onClick={() => showContact(p)}>
                                            {p.name}<span className="participant-info-icon">ℹ️</span>
                                        </span>
                                    ))}
                                </div>
                                <div className="slot-actions">
                                    {!slot.participants.some(p => p.id === 'you') && (
                                        <button
                                            className="book-button"
                                            disabled={slot.time < currentTime || isFull(slot) || closedSlots.includes(slot.id) || userHasBooked}
                                            onClick={() => handleBook(slot)}
                                        >
                                            {userHasBooked ? 'Already Booked' : isFull(slot) ? 'Slot Full' : 'Book Now'}
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
                </div>
            )}
        </div>
    );
}
