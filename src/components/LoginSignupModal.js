// sionDrop/src/components/LoginSignupModal.js
import React from 'react';
import './LoginSignupModal.css'; // Ensure this CSS file exists

const LoginSignupModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Login or Sign Up</h2>
                <button onClick={onClose} className="close-button">Close</button>
                {/* Add your login/signup form here */}
            </div>
        </div>
    );
};

export default LoginSignupModal;