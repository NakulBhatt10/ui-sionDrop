import React, { useState, useEffect } from 'react';
import './history.css';

const BookingHistory = () => {
    const [current, setCurrent] = useState(null);
    const [past, setPast] = useState([]);

    useEffect(() => {

        const email = 'nakulbhatt462@gmail.com';
        const token = localStorage.getItem('user-token');

        if (!email) {
            console.error('No user email found in localStorage');
            return;
        }

        fetch('/current-booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify({ email }),
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(({ history }) => {

                const bookings = history.map(b => ({
                    dateTime: new Date(b.dateTime),
                    rideType: b.rideType,
                    totalPassengers: b.totalPassengers,
                }));

                const now = new Date();

                const upcoming = bookings.find(b => b.dateTime >= now);
                setCurrent(upcoming || null);


                const pastBookings = bookings
                    .filter(b => b.dateTime < now)
                    .sort((a, b) => b.dateTime - a.dateTime);
                setPast(pastBookings);
            })
            .catch(err => {
                console.error('Failed to fetch booking history:', err);
            });
    }, []);

    return (
        <div className="history-container">
            <h2>Current Booking</h2>
            {current ? (
                <div className="current-booking">
                    <p>
                        <strong>Date:</strong>{' '}
                        {current.dateTime.toLocaleString()}
                    </p>
                    <p>
                        <strong>Ride Type:</strong> {current.rideType}
                    </p>
                    <p>
                        <strong>Passengers:</strong> {current.totalPassengers}
                    </p>
                </div>
            ) : (
                <p>No active booking.</p>
            )}

            <h2>Booking History</h2>
            {past.length === 0 ? (
                <p>No past bookings.</p>
            ) : (
                <table className="history-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Ride Type</th>
                            <th>Passengers</th>
                        </tr>
                    </thead>
                    <tbody>
                        {past.map((b, i) => (
                            <tr key={i}>
                                <td>{b.dateTime.toLocaleDateString()}</td>
                                <td>{b.rideType}</td>
                                <td>{b.totalPassengers}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default BookingHistory;
