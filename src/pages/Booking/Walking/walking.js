import { useEffect, useState } from 'react';
import './walking.css';

// ─── helpers ────────────────────────────────────────────────────────
function getSlotTime(index) {
    const t = new Date();
    t.setSeconds(0, 0);
    t.setMinutes(
        Math.ceil(t.getMinutes() / 5) * 5 + index * 5
    );
    return t;
}

function formatTime(date) {
    return date.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit'
    });
}

function generateRideId(date) {
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
            taxiId: generateRideId(time),
            time,
            users: [],
            maxCapacity: 5
        };
    });
}

// ─── component ───────────────────────────────────────────────────────
export default function BookWalkingSlot() {
    const [slots, setSlots] = useState(buildInitialSlots);
    const [currentBooking, setCurrentBooking] = useState(null);

    // fetch existing booking on load
    useEffect(() => {
        async function fetchCurrent() {
            const token = localStorage.getItem('user-token');
            if (!token) return;

            try {
                const res = await fetch(
                    'http://localhost:5000/current-booking',
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                if (!res.ok) return;
                const { booking } = await res.json();

                if (new Date(booking.time) > new Date()) {
                    setCurrentBooking(booking);
                    setSlots(slots =>
                        slots.map(s =>
                            s.taxiId === booking.taxiId
                                ? { ...s, users: booking.users }
                                : s
                        )
                    );
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchCurrent();
    }, []);

    // book one walker
    async function handleBook(idx) {
        const slot = slots[idx];
        const token = localStorage.getItem('user-token');
        if (!token) { alert('Please log in.'); return; }

        const res = await fetch(
            'http://localhost:5000/book-walking-now',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    taxiId: slot.taxiId,
                    time: slot.time.toISOString()
                })
            }
        );
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            return alert(err.message || 'Booking failed');
        }
        const { booking } = await res.json();
        setCurrentBooking(booking);
        setSlots(slots =>
            slots.map((s, i) =>
                i === idx ? { ...s, users: booking.users } : s
            )
        );
    }

    // cancel that walk
    async function handleCancel() {
        if (!currentBooking) return;
        const token = localStorage.getItem('user-token');

        const res = await fetch(
            'http://localhost:5000/cancel-booking',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ taxiId: currentBooking.taxiId })
            }
        );
        if (!res.ok) {
            return alert('Cancel failed');
        }
        const { users } = await res.json();
        setCurrentBooking(null);
        setSlots(slots =>
            slots.map(s =>
                s.taxiId === currentBooking.taxiId
                    ? { ...s, users }
                    : s
            )
        );
    }

    // ─── render ────────────────────────────────────────────────────────
    return (
        <div className="walking-slot-page">
            {currentBooking && (
                <div className="current-booking">
                    <h3>My Walk Booking</h3>
                    <p>
                        <strong>Time:</strong>{' '}
                        {formatTime(new Date(currentBooking.time))}<br />
                        <strong>Ride ID:</strong> {currentBooking.taxiId}
                    </p>
                    <button
                        className="cancel-button"
                        onClick={handleCancel}
                    >
                        Cancel booking
                    </button>
                </div>
            )}

            <h1>Book Your Walking Slot</h1>

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
                                {full ? 'Taken' : 'Book now'}
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
                                        <span
                                            key={i}
                                            className="user-dot empty"
                                        />
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
