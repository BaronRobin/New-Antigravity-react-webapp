import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaShapes, FaGem, FaUser } from 'react-icons/fa';
import './MobileTabBar.css';

const MobileTabBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('home');

    // Sync active state with URL
    useEffect(() => {
        const path = useLocation.pathname;
        if (path === '/') setActiveTab('home');
        else if (path === '/dashboard' || path === '/login') setActiveTab('dashboard');
        // For hash links, we track clicks mostly, but could observe scroll
    }, [useLocation]);

    const handleNav = (id, route = '/') => {
        setActiveTab(id);

        // Vibrate on mobile (Android)
        if (navigator.vibrate) navigator.vibrate(10);

        if (route !== '/') {
            navigate(route);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Hash navigation on home page
            if (window.location.hash !== '') {
                navigate('/');
            }

            // Allow time for route change if needed
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                } else if (id === 'home') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }, 100);
        }
    };

    return (
        <div className="mobile-tab-bar">
            <div
                className={`tab-item ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => handleNav('home', '/')}
            >
                <FaHome className="tab-icon" />
            </div>

            <div
                className={`tab-item ${activeTab === 'process' ? 'active' : ''}`}
                onClick={() => handleNav('process')}
            >
                <FaShapes className="tab-icon" />
            </div>

            <div
                className={`tab-item ${activeTab === 'craftsmanship' ? 'active' : ''}`}
                onClick={() => handleNav('craftsmanship')}
            >
                <FaGem className="tab-icon" />
            </div>

            <div
                className={`tab-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleNav('dashboard', '/dashboard')}
            >
                <FaUser className="tab-icon" />
            </div>
        </div>
    );
};

export default MobileTabBar;
