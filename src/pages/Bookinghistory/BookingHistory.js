import React, { useEffect, useState } from 'react';
import './history.css';

function formatTime(date) {
    return new Date(date).toLocaleString([], {
        hour: 'numeric', minute: '2-digit', month: 'short', day: 'numeric'
    });
}

export default function BookingHistory() {
    const [current, setCurrent] = useState(null);
    const [past, setPast] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('user-token');
        if (!token) return;

        (async () => {
            // current
            const res1 = await fetch('/current-booking', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res1.ok) {
                const { booking } = await res1.json();
                if (new Date(booking.time) > new Date()) {
                    setCurrent(booking);
                }
            }
            // history
            const res2 = await fetch('/booking-history', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res2.ok) {
                const data = await res2.json();
                setPast(data.bookings);
            }
        })();
    }, []);

    return (
        <div className="history-page">
            <h1>My Bookings</h1>

            {current && (
                <div className="current-card">
                    <h2>Current Booking</h2>
                    <p><strong>Time:</strong> {formatTime(current.time)}</p>
                    <p><strong>Type:</strong> {current.vehicleType}</p>
                    <p><strong>ID:</strong> {current.taxiId}</p>
                </div>
            )}

            <div className="past-list">
                <h2>Past Bookings</h2>
                {past.length === 0 ? (
                    <p>No past bookings.</p>
                ) : (
                    <ul>
                        {past.map(b => (
                            <li key={b._id}>
                                {formatTime(b.time)} — {b.vehicleType} — {b.taxiId}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
