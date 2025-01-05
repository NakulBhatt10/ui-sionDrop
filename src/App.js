import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './assets/styles/main.css';

// Import components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Auth from './pages/Auth';
import ModeSelection from './pages/ModeSelection';
import Booking from './pages/Booking';

const AppContent = () => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/auth';

    return (
        <div className="app">
            {!isAuthPage && <Navbar />}
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/mode-selection" element={<ModeSelection />} />
                    <Route path="/booking" element={<Booking />} />
                </Routes>
            </main>
            {!isAuthPage && <Footer />}
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