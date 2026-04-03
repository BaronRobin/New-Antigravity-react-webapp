import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Shop.css';
import '../components/Craftsmanship.css';
import WebGLShowcase from '../components/WebGLShowcase';

const Shop = () => {
    const [selectedMaterial, setSelectedMaterial] = useState('gold');
    const [comments, setComments] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { submitQuoteRequest } = useAuth();
    const navigate = useNavigate();

    const materials = [
        { id: 'gold', name: 'Gold', className: 'mat-gold', color: '#eec95e', roughness: 0.1 },
        { id: 'silver', name: 'Sterling Silver', className: 'mat-silver', color: '#e2e2e2', roughness: 0.05 },
        { id: 'titanium', name: 'Titanium', className: 'mat-titanium', color: '#a0b2c6', roughness: 0.4 },
        { id: 'rose-gold', name: 'Rose Gold', className: 'mat-rose', color: '#e0bfb8', roughness: 0.3 }
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
                            hideFullscreen={true}
                            forcedMaterial={{ color: currentMaterialProps.color, roughness: currentMaterialProps.roughness }}
                        />
                    </div>
                </div>

                {/* Right Side: Configuration */}
                <div className="shop-configurator glass-panel">
                    <h2>Configuration</h2>

                    <div className="config-section">
                        <h3>Select Material</h3>
                        <div className="material-options" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginTop: '1rem' }}>
                            {materials.map(mat => (
                                <div
                                    key={mat.id}
                                    onClick={() => setSelectedMaterial(mat.id)}
                                    style={{
                                        cursor: 'pointer',
                                        borderRadius: '12px',
                                        border: selectedMaterial === mat.id ? '2px solid var(--color-accent)' : '2px solid transparent',
                                        padding: '4px',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div className={`material-layer-bg ${mat.className}`} style={{ height: '50px', borderRadius: '8px', position: 'relative', overflow: 'hidden' }}>
                                        <div className="material-card-glare"></div>
                                    </div>
                                    <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.8rem', color: selectedMaterial === mat.id ? 'var(--color-accent)' : 'var(--color-text)' }}>
                                        <strong>{mat.name}</strong>
                                    </div>
                                </div>
                            ))}
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
                            Please describe your custom design in as much detail as possible to help us perfect your piece. (Min 20 characters)
                        </p>
                        <textarea
                            className="shop-textarea"
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            placeholder="I would like a custom diamond cut on the upper incisors, with an open face..."
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
                            disabled={comments.trim().length < 20 || name.trim().length === 0 || !email.includes('@') || !email.includes('.') || email.split('.').pop().length < 2}
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
