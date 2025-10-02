import { useEffect, useState } from 'react';
import './profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchProfile() {
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('user-token');
                if (!token) {
                    throw new Error('You are not logged in');
                }
                const res = await fetch('https://api-siondrop.onrender.com/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'user-token': token,
                    },
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || 'Failed to load profile');
                }
                const u = data.user || data;
                setUser({
                    id: u.id || u._id || '',
                    name: u.name || '',
                    email: u.email || '',
                });
            } catch (err) {
                if (err && err.name === 'AbortError') {
                    return;
                }
                setError(err.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
        return () => { };
    }, []);

    const getInitials = (name, email) => {
        if (name && typeof name === 'string') {
            const parts = name.trim().split(/\s+/).slice(0, 2);
            const initials = parts.map(p => p[0]?.toUpperCase()).join('');
            return initials || 'U';
        }
        if (email && typeof email === 'string') {
            return email[0]?.toUpperCase() || 'U';
        }
        return 'U';
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-avatar" aria-hidden="true">
                    {getInitials(user?.name, user?.email)}
                </div>
                {loading && <p className="profile-status">Loading profile…</p>}
                {error && !loading && <p className="profile-error">{error}</p>}
                {user && !loading && !error && (
                    <>
                        <h2 className="profile-name">{user.name}</h2>
                        <p className="profile-email">{user.email}</p>
                        <p className="profile-id">User ID: {user.id}</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Profile;


