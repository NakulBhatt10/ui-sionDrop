import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './pages/Navbar/Navbar';
import Footer from './pages/Footer/Footer';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import ModeSelection from './pages/ModeSelection/ModeSelection';
// ← these three files must live in src/pages/Booking/Taxi.js, Auto.js, Walking.js
import Taxi from './pages/Booking/Taxi/taxi';
import Auto from './pages/Booking/Auto/auto';
import Walking from './pages/Booking/Walking/walking';

import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService/TermsOfService';
import NotFound from './pages/NotFound/NotFound';

const AppContent = () => {
    const location = useLocation();
    const isAuthPage =
        location.pathname === '/' ||
        location.pathname === '/login' ||
        location.pathname === '/signup';

    return (
        <div className="app">
            {!isAuthPage && <Navbar />}
            <main className="main-content">
                <Routes>
                    {/* auth */}
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* main app */}
                    <Route path="/home" element={<Home />} />
                    <Route path="/mode-selection" element={<ModeSelection />} />

                    {/* mode-specific booking pages */}
                    <Route path="/booking/taxi" element={<Taxi />} />
                    <Route path="/booking/auto" element={<Auto />} />
                    <Route path="/booking/walking" element={<Walking />} />

                    {/* static pages */}
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />

                    {/* 404 catch-all */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
            {!isAuthPage && <Footer />}
        </div>
    );
};

export default function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}
