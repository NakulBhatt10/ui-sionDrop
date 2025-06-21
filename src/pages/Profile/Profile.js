import React, { useEffect, useState } from 'react';
import './profile.css';

export default function Profile() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('user-token');
        if (!token) return;

        (async () => {
            const res = await fetch('/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const { user } = await res.json();
                setUser(user);
            }
        })();
    }, []);

    if (!user) return <p>Loading profile…</p>;

    return (
        <div className="profile-page">
            <h1>My Profile</h1>
            <div className="profile-card">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
            </div>
        </div>
    );
}
