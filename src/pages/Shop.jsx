import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Shop.css';
import WebGLShowcase from '../components/WebGLShowcase';

const Shop = () => {
    const [selectedMaterial, setSelectedMaterial] = useState('gold');
    const [comments, setComments] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [showUpperJaw, setShowUpperJaw] = useState(true);
    const [showLowerJaw, setShowLowerJaw] = useState(false);
    const [lightRotation, setLightRotation] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { submitQuoteRequest } = useAuth();
    const navigate = useNavigate();

    const materials = [
        { id: 'gold', name: '18K Solid Gold', color: '#eec95e', roughness: 0.1 },
        { id: 'white-gold', name: '18K White Gold', color: '#eef2f5', roughness: 0.05 },
        { id: 'silver', name: 'Sterling Silver', color: '#cccccc', roughness: 0.2 },
        { id: 'rose-gold', name: '18K Rose Gold', color: '#b76e79', roughness: 0.1 }
    ];

    const currentMaterialProps = materials.find(m => m.id === selectedMaterial);

    return (
        <div className="shop-container fade-in page-transition">
            {isSubmitted && (
                <div className="success-popup-overlay fade-in">
                    <div className="success-popup slide-up">
                        <div className="popup-icon">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <h2>Request Submitted</h2>
                        <p className="popup-greeting">Thank you, {name}!</p>
                        <p>Your custom quote request has been successfully received by our design team.</p>
                        <p className="popup-highlight">
                            Please keep an eye on your mailbox (and junk folder) as we will be sending your login data and quote details shortly.
                        </p>
                        <button className="btn btn-primary" onClick={() => navigate('/')}>Return Home</button>
                    </div>
                </div>
            )}

            <div className="shop-grid container">
                {/* Left Side: Viewer */}
                <div className="shop-visuals">
                    <div className="shop-viewer-wrapper glass-panel">
                        <WebGLShowcase
                            hideHeader={true}
                            showUpperJaw={showUpperJaw}
                            showLowerJaw={showLowerJaw}
                            lightRotation={lightRotation}
                            forcedMaterial={{ color: currentMaterialProps.color, roughness: currentMaterialProps.roughness }}
                        />
                    </div>
                </div>

                {/* Right Side: Configuration */}
                <div className="shop-configurator glass-panel">
                    <h2>Configuration</h2>

                    <div className="config-section">
                        <h3>Select Material</h3>
                        <div className="material-options">
                            {materials.map(mat => (
                                <button
                                    key={mat.id}
                                    className={`material-btn ${selectedMaterial === mat.id ? 'active' : ''}`}
                                    onClick={() => setSelectedMaterial(mat.id)}
                                >
                                    <span className="mat-name">{mat.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="config-section">
                        <h3>Toggle Jaws</h3>
                        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', padding: '0.5rem 0' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.95rem', color: '#eee' }}>
                                <input 
                                    type="checkbox" 
                                    checked={showUpperJaw} 
                                    onChange={(e) => setShowUpperJaw(e.target.checked)} 
                                    style={{ accentColor: 'var(--color-accent)', width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                                Upper Jaw
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.95rem', color: '#eee' }}>
                                <input 
                                    type="checkbox" 
                                    checked={showLowerJaw} 
                                    onChange={(e) => setShowLowerJaw(e.target.checked)} 
                                    style={{ accentColor: 'var(--color-accent)', width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                                Lower Jaw
                            </label>
                        </div>
                        
                        <h3>Light Rotation</h3>
                        <div style={{ padding: '0.8rem 0 1rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <input 
                                type="range" 
                                min="0" 
                                max="360" 
                                value={lightRotation} 
                                onChange={(e) => setLightRotation(parseInt(e.target.value))} 
                                style={{ flex: 1, accentColor: 'var(--color-accent)' }} 
                            />
                            <span style={{ fontSize: '0.85rem', color: '#aaa', minWidth: '40px', textAlign: 'right' }}>{lightRotation}°</span>
                        </div>
                    </div>

                    <div className="config-section">
                        <h3>Contact Info</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
                            <input
                                type="text"
                                className="shop-input"
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <input
                                type="email"
                                className="shop-input"
                                placeholder="Your Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <h3>Design Details</h3>
                        <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                            Describe your ideas. (Min 5 characters)
                        </p>
                        <textarea
                            className="shop-textarea"
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            placeholder="I would like a custom diamond cut..."
                            rows="4"
                        ></textarea>
                    </div>

                    <div className="config-actions">
                        <p className="disclaimer-text">
                            * Note: Depending on the current amount of orders, processing time can take up to 1 week. Pricing varies based on individual customizations.
                        </p>
                        <button
                            type="button"
                            className="btn btn-primary full-width"
                            disabled={comments.trim().length < 5 || name.trim().length === 0 || !email.includes('@') || !email.includes('.') || email.split('.').pop().length < 2}
                            onClick={async (e) => {
                                e.preventDefault();
                                const res = await submitQuoteRequest(email, {
                                    name: name,
                                    materialId: selectedMaterial,
                                    comments: comments
                                });
                                if (res?.success) {
                                    setIsSubmitted(true);
                                } else {
                                    alert('Submitting request failed: ' + (res?.error?.message || 'Unknown error. Are you logged in? Check database permissions.'));
                                }
                            }}
                        >
                            Request Quote
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
