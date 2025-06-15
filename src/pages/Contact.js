import React, { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // For now, just log the data — later you can connect this to a backend or email API
        console.log('Submitted:', formData);
        alert('Message submitted!');
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="contact-container">
            <h1>Contact Us</h1>
            <p>If you have any questions or feedback, feel free to reach out to us.</p>

            <div className="contact-details">
                <p><strong>Email:</strong> support@siondrop.com</p>
                <p><strong>Phone:</strong> +91 98765 43210</p>
                <p><strong>Address:</strong> SionDrop HQ, Mumbai, India</p>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </label>
                <label>
                    Email:
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </label>
                <label>
                    Message:
                    <textarea name="message" value={formData.message} onChange={handleChange} required />
                </label>
                <button type="submit">Send Message</button>
            </form>
        </div>
    );
};

export default Contact;
