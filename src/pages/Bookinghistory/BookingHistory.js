import React, { useState, useEffect } from 'react';
import './history.css';

const BookingHistory = () => {
    const [current, setCurrent] = useState(null);
    const [past, setPast] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchCurrentBooking() {
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('user-token');
                if (!token) {
                    throw new Error('You are not logged in');
                }
                const res = await fetch('https://api-siondrop.onrender.com/current-booking', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'user-token': token,
                    },
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || `HTTP ${res.status}`);
                }
                const booking = data.booking || data;
                if (!booking || !booking.time) {
                    setCurrent(null);
                    setPast([]);
                    return;
                }
                const bookingTime = new Date(booking.time);
                const now = new Date();
                const normalized = {
                    id: booking._id || '',
                    taxiId: booking.taxiId || '',
                    dateTime: bookingTime,
                    rideType: booking.vehicleType || booking.rideType || 'unknown',
                    totalPassengers: Array.isArray(booking.users) ? booking.users.length : 0,
                };
                if (bookingTime > now) {
                    setCurrent(normalized);
                    setPast([]);
                } else {
                    setCurrent(null);
                    setPast([normalized]);
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch booking');
            } finally {
                setLoading(false);
            }
        }
        fetchCurrentBooking();
    }, []);

    return (
        <div className="history-container">
            <h2>Current Booking</h2>
            {loading ? (
                <p>Loading…</p>
            ) : error ? (
                <p className="history-error">{error}</p>
            ) : current ? (
                <div className="current-booking">
                    <p>
                        <strong>Date:</strong> {current.dateTime.toLocaleString()}
                    </p>
                    <p>
                        <strong>Ride Type:</strong> {current.rideType}
                    </p>
                    <p>
                        <strong>Passengers:</strong> {current.totalPassengers}
                    </p>
                    {current.taxiId && (
                        <p>
                            <strong>Booking ID:</strong> {current.taxiId}
                        </p>
                    )}
                </div>
            ) : (
                <p>No active booking.</p>
            )}

            <h2>Booking History</h2>
            {loading ? (
                <p>Loading…</p>
            ) : error ? (
                <p className="history-error">{error}</p>
            ) : past.length === 0 ? (
                <p>No past bookings.</p>
            ) : (
                <table className="history-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Ride Type</th>
                            <th>Passengers</th>
                            <th>Booking ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {past.map((b, i) => (
                            <tr key={i}>
                                <td>{b.dateTime.toLocaleString()}</td>
                                <td>{b.rideType}</td>
                                <td>{b.totalPassengers}</td>
                                <td>{b.taxiId || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default BookingHistory;
