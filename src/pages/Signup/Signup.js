import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './signup.css';

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [helperMessage, setHelperMessage] = useState('');
    const countdownIntervalRef = useRef(null);
    const apiDelayTimeoutRef = useRef(null);

    const handleChange = e => {
        setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
        if (fieldErrors[e.target.name]) {
            setFieldErrors(fe => ({ ...fe, [e.target.name]: '' }));
        }
    };

    const validateForm = () => {
        const errs = {};
        if (!formData.name) {
            errs.name = 'Name is required';
        }
        if (!formData.email) {
            errs.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errs.email = 'Email is invalid';
        }
        if (!formData.password) {
            errs.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errs.password = 'Password must be at least 6 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            errs.confirmPassword = 'Passwords do not match';
        }
        setFieldErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!validateForm() || isSubmitting) return;

        setIsSubmitting(true);
        setCountdown(15);
        console.log('📌 | Signup.js |', countdown);
        setHelperMessage('Preparing your account… 15s');

        // Start visual countdown (mirage)
        countdownIntervalRef.current = setInterval(() => {
            setCountdown(prev => {
                const next = prev - 1;
                if (next > 0) {
                    setHelperMessage(`Preparing your account… ${next}s`);
                }
                if (next <= 0) {
                    clearInterval(countdownIntervalRef.current);
                    setHelperMessage('Loading…');
                }
                return Math.max(next, 0);
            });
        }, 1000);

        // Delay actual API call until countdown completes
        apiDelayTimeoutRef.current = setTimeout(async () => {
            try {
                const res = await fetch('https://api-siondrop.onrender.com/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        password: formData.password,
                        confirmPassword: formData.confirmPassword,
                    }),
                });
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || 'Signup failed');
                }

                try {
                    localStorage.setItem('user-token', data.token);
                } catch (storageErr) {
                    console.error('Could not save auth token', storageErr);
                }

                toast.success('Account created! Redirecting…');
                setTimeout(() => navigate('/home'), 800);
            } catch (err) {
                toast.error(err.message);
                setHelperMessage('');
            } finally {
                setIsSubmitting(false);
            }
        }, 15000);
    };

    useEffect(() => {
        return () => {
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
            if (apiDelayTimeoutRef.current) clearTimeout(apiDelayTimeoutRef.current);
        };
    }, []);

    return (
        <div className="auth-container">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="auth-form">
                <h2>Create Account</h2>
                <p className="auth-subtitle">Sign up to get started</p>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            className={fieldErrors.name ? 'error' : ''}
                        />
                        {fieldErrors.name && (
                            <span className="error-message">{fieldErrors.name}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className={fieldErrors.email ? 'error' : ''}
                        />
                        {fieldErrors.email && (
                            <span className="error-message">{fieldErrors.email}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className={fieldErrors.password ? 'error' : ''}
                        />
                        {fieldErrors.password && (
                            <span className="error-message">{fieldErrors.password}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            className={fieldErrors.confirmPassword ? 'error' : ''}
                        />
                        {fieldErrors.confirmPassword && (
                            <span className="error-message">
                                {fieldErrors.confirmPassword}
                            </span>
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        Sign Up
                    </button>
                    {isSubmitting && (
                        <div className="helper-message" aria-live="polite">{helperMessage}</div>
                    )}
                </form>

                <p className="switch-auth">
                    Already have an account?{' '}
                    <button
                        type="button"
                        className="link-button"
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Signup;
