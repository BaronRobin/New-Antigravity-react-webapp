import React from 'react';
import './BehindTheDesign.css';

/**
 * BehindTheDesign Component detailing the inspiration and process behind the grillz.
 * @returns {JSX.Element}
 */
const BehindTheDesign = () => {
    return (
        <section className="behind-design section" id="behind-design">
            <div className="container">
                <div className="section-header fade-in-up">
                    <h2>An Artistic Expression</h2>
                    <p className="section-subtitle">
                        Where digital precision meets creative vision
                    </p>
                </div>

                <div className="design-grid">
                    <div className="design-card glass-dark hover-lift fade-in-left">
                        <div className="card-content">
                            <h3>Digital Artistry</h3>
                            <p>
                                The design draws inspiration from traditional jewelry craftsmanship while
                                pushing boundaries through computational design. Using advanced 3D modeling
                                techniques in Blender and ZBrush, each piece becomes a unique expression
                                of digital creativity.
                            </p>
                        </div>
                    </div>

                    <div className="design-card glass-dark hover-lift fade-in-right stagger-2">
                        <div className="card-content">
                            <h3>Anatomical Precision</h3>
                            <p>
                                Every grillz design begins with high-resolution intraoral scanning, capturing
                                the unique dental topography with sub-millimeter accuracy. This ensures perfect
                                fit, comfort, and a seamless interface with the wearer's natural form.
                            </p>
                        </div>
                    </div>

                    <div className="design-card glass-dark hover-lift fade-in-left stagger-3">
                        <div className="card-content">
                            <h3>Material Innovation</h3>
                            <p>
                                From traditional gold and platinum to experimental titanium alloys, material
                                selection defines both aesthetic quality and mechanical performance. Each
                                surface finish is carefully crafted to maximize brilliance and durability.
                            </p>
                        </div>
                    </div>

                    <div className="design-card glass-dark hover-lift fade-in-right stagger-4">
                        <div className="card-content">
                            <h3>Cultural Expression</h3>
                            <p>
                                Dental grillz transcend mere decoration-they represent identity, status, and
                                artistic expression rooted in hip-hop culture. This project honors that legacy
                                while exploring new dimensions through technology.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="tech-comparison fade-in-up" style={{ marginTop: '4rem' }}>
                    <h3 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.8rem' }}>Technology Stack</h3>
                    <div className="tech-stack-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        <div className="tech-item glass-dark" style={{ padding: '1.5rem', borderRadius: '15px', textAlign: 'center' }}>
                            <div className="tech-name" style={{ color: 'var(--color-accent)', fontWeight: 'bold', marginBottom: '0.5rem' }}>React & WebGL</div>
                            <div className="tech-desc" style={{ fontSize: '0.9rem', color: '#ccc' }}>Immersive 3D browser showcase</div>
                        </div>
                        <div className="tech-item glass-dark" style={{ padding: '1.5rem', borderRadius: '15px', textAlign: 'center' }}>
                            <div className="tech-name" style={{ color: 'var(--color-accent)', fontWeight: 'bold', marginBottom: '0.5rem' }}>Blender & ZBrush</div>
                            <div className="tech-desc" style={{ fontSize: '0.9rem', color: '#ccc' }}>High-fidelity 3D modeling & sculpting</div>
                        </div>
                        <div className="tech-item glass-dark" style={{ padding: '1.5rem', borderRadius: '15px', textAlign: 'center' }}>
                            <div className="tech-name" style={{ color: 'var(--color-accent)', fontWeight: 'bold', marginBottom: '0.5rem' }}>Tripo3D API</div>
                            <div className="tech-desc" style={{ fontSize: '0.9rem', color: '#ccc' }}>AI approximation for custom proofs</div>
                        </div>
                        <div className="tech-item glass-dark" style={{ padding: '1.5rem', borderRadius: '15px', textAlign: 'center' }}>
                            <div className="tech-name" style={{ color: 'var(--color-accent)', fontWeight: 'bold', marginBottom: '0.5rem' }}>glTF 2.0</div>
                            <div className="tech-desc" style={{ fontSize: '0.9rem', color: '#ccc' }}>Optimized real-time asset delivery</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BehindTheDesign;
