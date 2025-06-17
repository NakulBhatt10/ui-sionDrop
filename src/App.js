import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './Asset/main.css'; //hitn: you might rm this

import Navbar from './pages/Navbar';
import Footer from './pages/Footer';
import Home from './pages/Home';
import Auth from './pages/Auth/Auth';
import ModeSelection from './pages/ModeSelection';
import Booking from './pages/Booking';

import About from './pages/About/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

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

                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
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
