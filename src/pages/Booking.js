import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RouteMap from '../components/RouteMap';
import LoginSignupModal from '../components/LoginSignupModal'; // Correct path
import '../styles/Booking.css';

const Booking = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const mode = searchParams.get('mode');

    const [currentTime, setCurrentTime] = useState(new Date());
    const [slots, setSlots] = useState([]);
    const [userHasBooked, setUserHasBooked] = useState(false);
    const [bookingStatus, setBookingStatus] = useState({
        status: null,
        message: ''
    });
    const [cancellationCount, setCancellationCount] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal

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
        }
    };

    // Generate time slots
    useEffect(() => {
        if (!mode) {
            navigate('/mode-selection');
            return;
        }

        const generateSlots = () => {
            const now = new Date();
            const slots = [];

            // Generate next 12 slots (1 hour) with 5-minute intervals
            for (let i = 0; i < 12; i++) {
                const slotTime = new Date(now.getTime() + (i * 5 * 60000));
                slots.push({
                    id: i,
                    time: slotTime,
                    participants: [],
                    capacity: modeConfig[mode]?.capacity || 4
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
    }, [mode, navigate]);

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleBookSlot = (slot) => {
        if (!userHasBooked) {
            setIsModalOpen(true); // Open modal if not booked
            return;
        }

        if (slot.time < currentTime || slot.participants.length >= slot.capacity) {
            return;
        }

        // Show loading state
        setBookingStatus({
            status: 'loading',
            message: 'Processing your booking...'
        });

        // Simulate API call
        setTimeout(() => {
            const updatedSlots = slots.map(s => {
                if (s.id === slot.id) {
                    return {
                        ...s,
                        participants: [...s.participants, {
                            id: 'current-user',
                            name: 'You'
                        }]
                    };
                }
                return s;
            });

            setSlots(updatedSlots);
            setUserHasBooked(true);
            setBookingStatus({
                status: 'success',
                message: `Successfully booked for ${formatTime(slot.time)}`
            });

            // Show success message for 3 seconds
            setTimeout(() => {
                setBookingStatus({ status: null, message: '' });
            }, 3000);
        }, 1000);
    };

    const handleCancelBooking = (slot) => {
        if (cancellationCount >= 3) {
            setBookingStatus({
                status: 'error',
                message: 'You have reached the cancellation limit'
            });
            return;
        }

        if (window.confirm('Are you sure you want to cancel your booking?')) {
            const updatedSlots = slots.map(s => {
                if (s.id === slot.id) {
                    return {
                        ...s,
                        participants: s.participants.filter(p => p.id !== 'current-user')
                    };
                }
                return s;
            });

            setSlots(updatedSlots);
            setUserHasBooked(false);
            setCancellationCount(cancellationCount + 1);
            setBookingStatus({
                status: 'info',
                message: 'Booking cancelled successfully'
            });

            setTimeout(() => {
                setBookingStatus({ status: null, message: '' });
            }, 3000);
        }
    };

    return (
        <div className="booking-page">
            <div className="booking-header">
                <span className="mode-icon">{modeConfig[mode]?.icon}</span>
                <h1>Book your {mode} slot</h1>
            </div>

            {bookingStatus.message && (
                <div className={`booking-status ${bookingStatus.status}`}>
                    {bookingStatus.message}
                </div>
            )}

            <div className="slots-container">
                {slots.map((slot) => (
                    <div
                        key={slot.id}
                        className={`slot-card ${slot.time < currentTime ? 'expired' : ''
                            } ${slot.participants.length >= slot.capacity ? 'full' : ''
                            }`}
                    >
                        <div className="slot-time">{formatTime(slot.time)}</div>
                        <div className="slot-status">
                            {slot.participants.length}/{slot.capacity} booked
                        </div>
                        <div className="slot-participants">
                            {slot.participants.map((participant, index) => (
                                <span key={index} className="participant">
                                    {participant.name}
                                </span>
                            ))}
                        </div>
                        <div className="slot-actions">
                            {slot.participants.find(p => p.id === 'current-user') ? (
                                <button
                                    className="cancel-button"
                                    onClick={() => handleCancelBooking(slot)}
                                >
                                    Cancel Booking
                                </button>
                            ) : (
                                <button
                                    className="book-button"
                                    disabled={
                                        slot.time < currentTime ||
                                        slot.participants.length >= slot.capacity ||
                                        userHasBooked
                                    }
                                    onClick={() => handleBookSlot(slot)}
                                >
                                    {userHasBooked ? 'Already Booked' :
                                        slot.participants.length >= slot.capacity ? 'Full' : 'Book Now'}
                                </button>
                            )}
                        </div>
                        <RouteMap mode={mode} />
                    </div>
                ))}
            </div>

            <LoginSignupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default Booking;