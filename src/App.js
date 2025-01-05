import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './assets/styles/main.css';

// Import pages
import Home from './pages/Home';
import Auth from './pages/Auth';
import ModeSelection from './pages/ModeSelection';
import Booking from './pages/Booking';
import Navbar from './components/layout/Navbar';

const AppContent = () => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/auth';

    return (
        <div className="app">
            {!isAuthPage && <Navbar />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/mode-selection" element={<ModeSelection />} />
                <Route path="/booking" element={<Booking />} />
            </Routes>
        </div>
    );
};

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App; 