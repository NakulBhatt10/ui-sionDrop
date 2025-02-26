import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './assets/styles/main.css';
import { BookingProvider } from './context/BookingContext';

// Import components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import ModeSelection from './pages/ModeSelection';
import Booking from './pages/Booking';
import Signup from './pages/Signup';
import Login from './pages/Login';

function App() {
    return (
        <BookingProvider>
            <Router>
                <div className="app">
                    <Navbar />
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/mode-selection" element={<ModeSelection />} />
                            <Route path="/booking" element={<Booking />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/login" element={<Login />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </BookingProvider>
    );
}

export default App;