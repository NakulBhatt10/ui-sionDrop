// sionDrop/src/pages/ContactUs.js
import React, { useState } from 'react';
import '../styles/ContactUs.css';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        mobile: '',
        email: '',
        message: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    return (
        <div className="contact-us">
            <div className="contact-info">
                <h2>Get In Touch With Us Now!</h2>
                <div className="info-item">
                    <h3>Phone Number</h3>
                    <p>+91 80004 36640</p>
                </div>
                <div className="info-item">
                    <h3>Email</h3>
                    <p>nakulcodes213@gmail.com</p>
                </div>
                <div className="info-item">
                    <h3>Location</h3>
                    <p>598, Rhythm Plaza, Amar Javan Circle, Nikel, Ahmedabad, Gujarat - 382350</p>
                </div>
                <div className="info-item">
                    <h3>Working Hours</h3>
                    <p>Monday To Saturday 09:00 AM To 06:00 PM</p>
                </div>
            </div>
            <div className="contact-form">
                <h2>Contact Us</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="mobile"
                        placeholder="Mobile No"
                        value={formData.mobile}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email ID"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        name="message"
                        placeholder="Message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default ContactUs;