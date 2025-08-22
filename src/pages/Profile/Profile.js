import React, { useState, useEffect } from 'react';
import './profile.css';

const Profile = () => {
    const [user, setUser] = useState({ name: '', email: '' });

    useEffect(() => {
        // Fetch user details from localStorage (or replace with your API/context)
        const stored = localStorage.getItem('user');
        const userObj = stored ? JSON.parse(stored) : { name: '', email: '' };
        setUser(userObj);
    }, []);

    return (
        <div className="profile-container">
            <h2 className="profile-header">Your Profile</h2>

            <div className="profile-field">
                <span className="field-label">Name:</span>
                <span className="field-value">{user.name}</span>
            </div>

            <div className="profile-field">
                <span className="field-label">Email:</span>
                <span className="field-value">{user.email}</span>
            </div>

            {/* Add more fields as needed */}

            <button className="edit-button" onClick={() => {/* handle edit action */ }}>
                Edit Profile
            </button>
        </div>
    );
};

export default Profile;
