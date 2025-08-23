import { useEffect, useState } from 'react';
import './taxi.css';


function getSlotTime(index) {
    const t = new Date();
    t.setSeconds(0, 0);
    t.setMinutes(Math.ceil(t.getMinutes() / 5) * 5 + index * 5);
    return t;
}

function formatTime(date) {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function generateTaxiId(date) {
    const Y = date.getFullYear();
    const M = String(date.getMonth() + 1).padStart(2, '0');
    const D = String(date.getDate()).padStart(2, '0');
    let hour = date.getHours();
    const ampm = hour >= 12 ? 'pm' : 'am';
    hour = hour % 12 || 12;
    const h = String(hour);
    const m = String(date.getMinutes()).padStart(2, '0');
    return `${Y}${M}${D}-${h}${m}${ampm}`;
}

function buildInitialSlots() {
    return Array.from({ length: 14 }, (_, i) => {
        const time = getSlotTime(i);
        return {
            taxiId: generateTaxiId(time),
            time,
            users: [],
            maxCapacity: 4
        };
    });
}

export default function BookTaxiSlot() {
    const [slots, setSlots] = useState(buildInitialSlots);
    const [currentBooking, setCurrentBooking] = useState(null);

    useEffect(() => {
        async function fetchCurrentBooking() {
            const token = localStorage.getItem('user-token');
            if (!token) return;

            try {
                const res = await fetch('https://api-siondrop.onrender.com/current-booking', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!res.ok) return;

                const data = await res.json();
                const bookingTime = new Date(data.booking.time);
                const now = new Date();

                if (bookingTime > now) {
                    setCurrentBooking(data.booking);
                } else {
                    setCurrentBooking(null); // booking is expired
                }
            } catch (err) {
                console.error('Failed to fetch current booking:', err);
            }
        }

        fetchCurrentBooking();
    }, []);

    async function handleBook(slotIndex) {
        const slot = slots[slotIndex];

        try {
            const token = localStorage.getItem('user-token');

            const res = await fetch('https://api-siondrop.onrender.com/book-taxi-now', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    taxiId: slot.taxiId,
                    time: slot.time.toISOString()
                })
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();

            // update that slot with returned users list
            setSlots(prev =>
                prev.map((s, i) =>
                    i === slotIndex ? { ...s, users: data.booking.users } : s
                )
            );
            setCurrentBooking(data.booking);
        } catch (err) {
            console.error('Booking failed:', err);
            alert('Failed to book taxi slot, please try again.');
        }
    }

    async function handleCancel() {
        if (!currentBooking) return;
        const token = localStorage.getItem('user-token');

        try {
            const res = await fetch('https://api-siondrop.onrender.com/cancel-booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ taxiId: currentBooking.taxiId })
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const { users } = await res.json();

            // clear state & update that slot’s riders
            setCurrentBooking(null);
            setSlots(s =>
                s.map(sl =>
                    sl.taxiId === currentBooking.taxiId
                        ? { ...sl, users }
                        : sl
                )
            );
        } catch (err) {
            console.error('Cancel failed:', err);
            alert('Failed to cancel booking.');
        }
    }

    return (
        <div className="taxi-slot-page">
            {/* Current booking card with Cancel button */}
            {currentBooking && (
                <div className="current-booking">
                    <h3>My Booking</h3>
                    <p>
                        <strong>Time:</strong>{' '}
                        {formatTime(new Date(currentBooking.time))}<br />
                        <strong>Ride type:</strong> {currentBooking.vehicleType}<br />
                        <strong>Taxi ID:</strong>{' '}
                        {currentBooking.taxiId.slice(0, 8)}…
                    </p>
                    <button
                        className="cancel-button"
                        onClick={handleCancel}
                    >
                        Cancel booking
                    </button>
                </div>
            )}

            {/* heading -------------------------------------------------- */}
            <h1>Book Your Taxi Slot</h1>

            {/* grid ----------------------------------------------------- */}
            <div className="slot-grid">
                {slots.map((slot, idx) => {
                    const full = slot.users.length >= slot.maxCapacity;
                    return (
                        <div key={slot.taxiId} className="slot-tile">
                            <div className="slot-time">
                                {formatTime(slot.time)}
                            </div>

                            <button
                                className="slot-btn"
                                disabled={full || !!currentBooking}
                                onClick={() => handleBook(idx)}
                            >
                                {full ? 'Full' : 'Book now'}
                            </button>

                            <div className="slot-users">
                                {slot.users.map(u => (
                                    <span key={u.userId} className="user-dot">
                                        {u.name.trim()[0].toUpperCase()}
                                    </span>
                                ))}
                                {Array.from(
                                    { length: slot.maxCapacity - slot.users.length },
                                    (_, i) => (
                                        <span key={i} className="user-dot empty" />
                                    )
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
