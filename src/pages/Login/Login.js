import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './login.css';

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: 'JennyDon44@example.com',
        password: 'Hello@123',
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
        setFieldErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!validateForm() || isSubmitting) return;

        setIsSubmitting(true);
        setCountdown(15);
        console.log('📌 | Login.js |', countdown);
        setHelperMessage('Preparing secure login… 15s');

        // Start visual countdown (mirage)
        countdownIntervalRef.current = setInterval(() => {
            setCountdown(prev => {
                const next = prev - 1;
                if (next > 0) {
                    setHelperMessage(`Preparing secure login… ${next}s`);
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
                const res = await fetch('https://api-siondrop.onrender.com/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
                    }),
                });
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || 'Login failed');
                }

                try {
                    localStorage.setItem('user-token', data.token);
                } catch (storageErr) {
                    console.error('Could not save auth token', storageErr);
                }

                toast.success('Logged in successfully!');
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
                <h2>Welcome Back!</h2>
                <p className="auth-subtitle">Please login to continue</p>

                <form onSubmit={handleSubmit} noValidate>
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

                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        Login
                    </button>
                    {isSubmitting && (
                        <div className="helper-message" aria-live="polite">{helperMessage}</div>
                    )}
                </form>

                <p className="switch-auth">
                    Don’t have an account?{' '}
                    <button
                        type="button"
                        className="link-button"
                        onClick={() => navigate('/signup')}
                    >
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
