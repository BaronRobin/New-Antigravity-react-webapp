import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const AnalyticsContext = createContext(null);

export const AnalyticsProvider = ({ children, user }) => {
    const location = useLocation();
    const [clickLog, setClickLog] = useState([]);
    const [pageLog, setPageLog] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]); // Mock "Online" list

    // Track Page Views
    useEffect(() => {
        if (user) {
            const entry = {
                type: 'NAVIGATION',
                detail: `Visited ${location.pathname}`,
                timestamp: new Date().toISOString(),
                user: user.email
            };
            setPageLog(prev => [entry, ...prev].slice(0, 50)); // Keep last 50
            updateOnlineUser(user, entry);
        }
    }, [location, user]);

    // Track Clicks (Mock "Global" click listener)
    useEffect(() => {
        const handleClick = (e) => {
            if (user && (e.target.tagName === 'BUTTON' || e.target.tagName === 'A')) {
                const entry = {
                    type: 'INTERACTION',
                    detail: `Clicked ${e.target.innerText || e.target.tagName}`,
                    timestamp: new Date().toISOString(),
                    user: user.email
                };
                setClickLog(prev => [entry, ...prev].slice(0, 50));
                updateOnlineUser(user, entry);
            }
        };

        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [user]);

    // Mock "Online Presence" (Update timestamp for user)
    const updateOnlineUser = (user, latestActivity) => {
        setOnlineUsers(prev => {
            const others = prev.filter(u => u.email !== user.email);
            return [{ ...user, lastActive: latestActivity.timestamp, lastAction: latestActivity.detail }, ...others];
        });
    };

    // Combined logs for Admin
    const getLiveFeed = () => {
        const combined = [...pageLog, ...clickLog].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        return combined;
    };

    return (
        <AnalyticsContext.Provider value={{ getLiveFeed, onlineUsers }}>
            {children}
        </AnalyticsContext.Provider>
    );
};

export const useAnalytics = () => {
    return useContext(AnalyticsContext);
};
