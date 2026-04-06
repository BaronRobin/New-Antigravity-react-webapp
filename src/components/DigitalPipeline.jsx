import React from 'react';
import './DigitalPipeline.css';

/**
 * DigitalPipeline Component displaying the 8 steps of the full-service workflow.
 * Features hover-activated descriptions over looping background videos.
 */
const DigitalPipeline = () => {
    const pipelineSteps = [
        {
            number: '01', title: 'Request',
            description: 'Initiate your custom grillz journey directly from our digital shop. No physical meetups required.',
            videoSrc: `${import.meta.env.BASE_URL}assets/step01.mp4`
        },
        {
            number: '02', title: 'Dashboard',
            description: 'Log in to your exclusive client dashboard to review live design progress and interactive 3D variants.',
            videoSrc: `${import.meta.env.BASE_URL}assets/step02.mp4`
        },
        {
            number: '03', title: 'Imprint & Scan',
            description: 'Provide a standard physical teeth imprint mold, or send over a high-fidelity 3D intraoral scan.',
            videoSrc: `${import.meta.env.BASE_URL}assets/step03.mp4`
        },
        {
            number: '04', title: '3D Design',
            description: 'We sculpt and design your custom idea into a photorealistic 3D printable model.',
            videoSrc: `${import.meta.env.BASE_URL}assets/step04.mp4`
        },
        {
            number: '05', title: 'Craftsmanship',
            description: 'The raw casting is hand-finished and polished. Premium stones are bead-set under microscope.',
            videoSrc: `${import.meta.env.BASE_URL}assets/step05.mp4`
        },
        {
            number: '06', title: 'Checkout & Shipping',
            description: 'Pay for your custom masterpiece and have it securely packaged and shipped fully insured, directly to your door.',
            videoSrc: `${import.meta.env.BASE_URL}assets/step06.mp4`
        }
    ];

    return (
        <section className="digital-pipeline section" id="pipeline">
            <div className="container">
                <div className="section-header fade-in-up" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2>The 0-100 Pipeline</h2>
                    <p className="section-subtitle" style={{ color: '#aaa', maxWidth: '600px', margin: '0 auto' }}>
                        A completely seamless digital workflow from initial request to final sparkle. Hover over any step to explore.
                    </p>
                </div>

                <div className="pipeline-grid">
                    {pipelineSteps.map((step, index) => (
                        <div
                            key={step.number}
                            className={`pipeline-card fade-in-up stagger-${index + 1}`}
                        >
                            <video 
                                className="pipeline-video" 
                                autoPlay 
                                loop 
                                muted 
                                playsInline 
                                src={step.videoSrc}
                            ></video>
                            
                            <div className="pipeline-overlay"></div>

                            <div className="step-content">
                                <div className="step-header">
                                    <span className="step-number gradient-text">{step.number}</span>
                                    <h3 className="step-title">{step.title}</h3>
                                </div>
                                <div className="step-body">
                                    <p className="step-description">{step.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DigitalPipeline;
