import React, { createContext, useState, useContext } from 'react';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
    const [currentBooking, setCurrentBooking] = useState(null);
    const [selectedMode, setSelectedMode] = useState(null);

    const handleBooking = (mode, time) => {
        setCurrentBooking({
            id: Date.now(),
            mode: mode,
            time: time,
            status: 'confirmed'
        });
        setSelectedMode(mode);
    };

    const handleCancelBooking = () => {
        setCurrentBooking(null);
        setSelectedMode(null);
    };

    return (
        <BookingContext.Provider value={{
            currentBooking,
            selectedMode,
            handleBooking,
            handleCancelBooking
        }}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => useContext(BookingContext); 