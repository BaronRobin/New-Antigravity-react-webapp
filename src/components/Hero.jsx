import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

// Dynamically import all standard image formats in the target directory
const imageModules = import.meta.glob('../assets/hero-images/*.{png,jpg,jpeg,webp,avif}', { eager: true });
const absoluteImages = Object.values(imageModules).map(mod => mod.default);

const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (absoluteImages.length <= 1) return;
        
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % absoluteImages.length);
        }, 3000); // Hold for 3 seconds
        
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="hero" id="hero">
            <div className="hero-background">
                {absoluteImages.length > 0 ? (
                    absoluteImages.map((src, idx) => (
                        <img 
                            key={idx}
                            src={src}
                            alt=""
                            className={`hero-carousel-img ${idx === currentIndex ? 'active' : ''}`}
                        />
                    ))
                ) : (
                    <div className="hero-video-placeholder"></div>
                )}
                <div className="hero-overlay"></div>
            </div>

            <div className="hero-content container">
                <h1 className="hero-title fade-in-up">
                    <span className="gradient-text">The 0-100 Digital Hub</span>
                    <br />For Custom Grillz
                </h1>

                <p className="hero-subtitle fade-in-up stagger-2" style={{ maxWidth: '800px', margin: '0 auto 2.5rem', fontSize: '1.3rem' }}>
                    No app installations. No physical meetups required. A completely seamless, customer-friendly web hub bridging custom 3D-modeling with cutting-edge physical craftsmanship.
                </p>

                <div className="hero-cta fade-in-up stagger-3">
                    <button
                        onClick={() => document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' })}
                        className="btn btn-primary"
                    >
                        Explore the Pipeline
                    </button>
                    {/* <Link to="/ar-experience" className="btn btn-secondary">
                        View AR Experience
                    </Link> */}
                </div>

                <div className="scroll-indicator fade-in stagger-4">
                    <div className="scroll-mouse">
                        <div className="scroll-wheel"></div>
                    </div>
                    <span className="scroll-text">Scroll to discover</span>
                </div>
            </div>
        </section>
    );
};

export default Hero;
