import React, { useEffect, useState } from 'react';
import './auto.css';

// ------------------------------------------------------------------
//  helper: round to next 5-minute mark then add N×5 minutes
// ------------------------------------------------------------------
function getSlotTime(index) {
    const t = new Date();
    t.setSeconds(0, 0);
    t.setMinutes(Math.ceil(t.getMinutes() / 5) * 5 + index * 5);
    return t;
}

// ------------------------------------------------------------------
//  helper: “4:45 am” formatting
// ------------------------------------------------------------------
function formatTime(date) {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

// ------------------------------------------------------------------
//  helper: generate rideId from date (YYYYMMDD-hhmmam/pm)
//  (same as taxi version)
// ------------------------------------------------------------------
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

// ------------------------------------------------------------------
//  build the initial six slots (capacity = 3)
// ------------------------------------------------------------------
function buildInitialSlots() {
    return Array.from({ length: 14 }, (_, i) => {
        const time = getSlotTime(i);
        return {
            taxiId: generateRideId(time),
            time,
            users: [],
            maxCapacity: 3    // ← 3 seats for auto
        };
    });
}

export default function BookAutoSlot() {
    const [slots, setSlots] = useState(buildInitialSlots);
    const [currentBooking, setCurrentBooking] = useState(null);

    // ─ fetch current booking on mount ───────────────────────────────
    useEffect(() => {
        async function fetchCurrent() {
            const token = localStorage.getItem('user-token');
            if (!token) return;

            try {
                const res = await fetch('http://localhost:5000/current-booking', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) return;

                const { booking } = await res.json();
                if (new Date(booking.time) > new Date()) {
                    setCurrentBooking(booking);
                    // fill in the slot's riders
                    setSlots(s =>
                        s.map(slot =>
                            slot.taxiId === booking.taxiId
                                ? { ...slot, users: booking.users }
                                : slot
                        )
                    );
                }
            } catch (e) {
                console.error('Fetch current failed', e);
            }
        }
        fetchCurrent();
    }, []);

    // ─ booking handler ──────────────────────────────────────────────
    async function handleBook(idx) {
        const slot = slots[idx];
        const token = localStorage.getItem('user-token');
        if (!token) { alert('Please log in'); return; }

        const res = await fetch('http://localhost:5000/book-auto-now', {
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
        if (!res.ok) { alert('Booking failed'); return; }

        const { booking } = await res.json();
        setCurrentBooking(booking);
        setSlots(s =>
            s.map((sl, i) =>
                i === idx ? { ...sl, users: booking.users } : sl
            )
        );
    }

    // ─ cancel handler ───────────────────────────────────────────────
    async function handleCancel() {
        if (!currentBooking) return;
        const token = localStorage.getItem('user-token');

        const res = await fetch('http://localhost:5000/cancel-booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ taxiId: currentBooking.taxiId })
        });
        if (!res.ok) { alert('Cancel failed'); return; }
        const { users } = await res.json();

        setCurrentBooking(null);
        setSlots(s =>
            s.map(sl =>
                sl.taxiId === currentBooking.taxiId
                    ? { ...sl, users }
                    : sl
            )
        );
    }

    return (
        <div className="auto-slot-page">
            {currentBooking && (
                <div className="current-booking">
                    <h3>My Auto Booking</h3>
                    <p>
                        <strong>Time:</strong> {formatTime(new Date(currentBooking.time))}<br />
                        <strong>Vehicle:</strong> {currentBooking.vehicleType}<br />
                        <strong>Ride ID:</strong> {currentBooking.taxiId}
                    </p>
                    <button className="cancel-button" onClick={handleCancel}>
                        Cancel booking
                    </button>
                </div>
            )}

            <h1>Book Your Auto Slot</h1>

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
                                    (_, i) => <span key={i} className="user-dot empty" />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
