import React, { useState, useRef, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Environment, ContactShadows, useGLTF } from '@react-three/drei';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import './WebGLShowcase.css';

// Error Boundary for the WebGL Canvas
class CanvasErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error) {
        console.warn('WebGL Canvas error caught by boundary:', error.message);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    minHeight: '300px',
                    gap: '1rem',
                    color: '#666'
                }}>
                    <div style={{ fontSize: '2rem' }}>⬡</div>
                    <p style={{ fontSize: '0.9rem', color: '#555', margin: 0 }}>3D model unavailable</p>
                    <p style={{ fontSize: '0.75rem', color: '#444', margin: 0 }}>The model could not be loaded.</p>
                </div>
            );
        }
        return this.props.children;
    }
}

// Loading fallback while model fetches
const ModelLoader = () => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: '300px',
        gap: '1rem',
        color: '#666'
    }}>
        <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(201,169,97,0.3)',
            borderTopColor: 'var(--color-accent)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
        }} />
        <p style={{ fontSize: '0.85rem', color: '#888', margin: 0 }}>Loading 3D model...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
);

const CustomModel = ({ url, color, roughness, metalness = 1.0 }) => {
    const { scene } = useGLTF(url);

    React.useEffect(() => {
        if (scene) {
            scene.traverse((child) => {
                if (child.isMesh && child.material) {
                    const applyMaterial = (mat) => {
                        mat.color.set(color);
                        mat.metalness = metalness;
                        mat.roughness = roughness;
                        mat.needsUpdate = true;
                    };
                    
                    if (Array.isArray(child.material)) {
                        child.material = child.material.map(m => m.clone());
                        child.material.forEach(applyMaterial);
                    } else {
                        child.material = child.material.clone();
                        applyMaterial(child.material);
                    }
                }
            });
        }
    }, [scene, color, roughness, metalness]);

    return <primitive object={scene} scale={1} />;
};

const GrillModel = ({ visible, geometryType, color = "#eec95e", roughness = 0.1, modelUrl, showUpperJaw, showLowerJaw }) => {
    const mesh = useRef();

    // Removed manual useFrame rotation to ensure ONLY up/down bobbing

    return (
        <group ref={mesh} visible={visible}>
            {/* Stable White Jaw Mesh Platform */}
             <group position={[0, 0, 0]}>
                 {showUpperJaw && (
                     <Suspense fallback={null}>
                         <CustomModel url={`${import.meta.env.BASE_URL}models/upper_teeth.glb`} color="#ffffff" roughness={0.4} metalness={0.1} />
                     </Suspense>
                 )}
                 {showLowerJaw && (
                     <Suspense fallback={null}>
                         <CustomModel url={`${import.meta.env.BASE_URL}models/lower_teeth.glb`} color="#ffffff" roughness={0.4} metalness={0.1} />
                     </Suspense>
                 )}
            </group>

            {/* Dynamic Grill overlay */}
            <group position={[0, 0, 0]}>
                {modelUrl && typeof modelUrl === 'string' && modelUrl.trim() !== '' ? (
                    <Suspense fallback={null}>
                        <CustomModel url={modelUrl} color={color} roughness={roughness} />
                    </Suspense>
                ) : (
                    <Suspense fallback={null}>
                        <CustomModel url={`${import.meta.env.BASE_URL}models/model${geometryType + 1}.glb`} color={color} roughness={roughness} />
                    </Suspense>
                )}
            </group>
        </group>
    );
};

const WebGLShowcase = ({ forcedMaterial, hideHeader = false, hideFullscreen = false, modelUrl }) => {
    const [index, setIndex] = useState(0);
    const [showUpperJaw, setShowUpperJaw] = useState(true);
    const [showLowerJaw, setShowLowerJaw] = useState(false);
    const [lightRotation, setLightRotation] = useState(0);
    const [autoRotate, setAutoRotate] = useState(true);
    const rotationTimeoutRef = useRef(null);

    const handleInteractionStart = () => {
        setAutoRotate(false);
        if (rotationTimeoutRef.current) {
            clearTimeout(rotationTimeoutRef.current);
        }
    };

    const handleInteractionEnd = () => {
        if (rotationTimeoutRef.current) {
            clearTimeout(rotationTimeoutRef.current);
        }
        rotationTimeoutRef.current = setTimeout(() => {
            setAutoRotate(true);
        }, 10000);
    };
    
    // Configuration array mapping the UI name to the actual 3D file name in public/models
    const grillConfig = [
        { name: 'Vampire Fangs', file: 'vampire_teeth.glb' },
        { name: 'Classic Grill', file: 'classic_grill.glb' },   // update these files when you get them!
        { name: 'Diamond Cut', file: 'diamond_grill.glb' }      // update these files when you get them!
    ];

    const designs = modelUrl ? ['Your AI Design Estimation'] : grillConfig.map(c => c.name);

    const nextDesign = () => setIndex((prev) => (prev + 1) % designs.length);
    const prevDesign = () => setIndex((prev) => (prev - 1 + designs.length) % designs.length);

    const validModelUrl = modelUrl && typeof modelUrl === 'string' && modelUrl.trim() !== '' ? modelUrl : null;
    const currentGrillFile = validModelUrl || `${import.meta.env.BASE_URL}models/${grillConfig[index].file}`;

    return (
        <section className={`webgl-section section ${hideHeader ? 'no-padding' : ''}`} id="showcase" style={hideHeader ? { background: 'transparent', height: '100%' } : {}}>
            <div className="container" style={hideHeader ? { height: '100%', display: 'flex', flexDirection: 'column', padding: 0 } : {}}>
                {!hideHeader && (
                    <div className="section-header fade-in-up">
                        <h2 style={{ marginBottom: 0 }}>Interactive Showcase</h2>
                    </div>
                )}

                <div className="showcase-card fade-in-up" style={hideHeader ? { background: 'transparent', border: 'none', boxShadow: 'none', flexGrow: 1, display: 'flex', flexDirection: 'column', padding: 0 } : { background: 'transparent', boxShadow: 'none', flexGrow: 1 }}>
                    <div className="canvas-wrapper" style={hideHeader ? { height: '100%', flexGrow: 1, minHeight: 0 } : {}}>
                        <CanvasErrorBoundary>
                            <Suspense fallback={<ModelLoader />}>
                                <Canvas camera={{ position: [0, 0, 0.15], fov: 45, near: 0.001 }}>
                                    <ambientLight intensity={0.8} />
                                    <spotLight 
                                        position={[Math.cos(lightRotation * Math.PI / 180) * 1.5, 1, Math.sin(lightRotation * Math.PI / 180) * 1.5]} 
                                        angle={0.2} 
                                        penumbra={1} 
                                        intensity={100} 
                                    />
                                    <Suspense fallback={null}>
                                        <Environment 
                                            preset="city" 
                                            background={false} 
                                            backgroundBlurriness={0.5} 
                                            environmentRotation={[0, lightRotation * Math.PI / 180, 0]} 
                                        />
                                    </Suspense>

                                    <Float speed={2} rotationIntensity={0} floatIntensity={0.02}>
                                        <GrillModel
                                            geometryType={index}
                                            visible={true}
                                            color={forcedMaterial ? forcedMaterial.color : (index === 2 ? "#b9f2ff" : "#eec95e")}
                                            roughness={forcedMaterial ? forcedMaterial.roughness : 0.1}
                                            modelUrl={currentGrillFile}
                                            showUpperJaw={showUpperJaw}
                                            showLowerJaw={showLowerJaw}
                                        />
                                    </Float>

                                    <OrbitControls 
                                        enableZoom={true} 
                                        enablePan={false} 
                                        autoRotate={autoRotate}
                                        autoRotateSpeed={1} 
                                        maxDistance={0.5} 
                                        minDistance={0.01} 
                                        target={[0, 0, -0.035]} 
                                        onStart={handleInteractionStart}
                                        onEnd={handleInteractionEnd}
                                    />
                                </Canvas>
                            </Suspense>
                        </CanvasErrorBoundary>

                        <div className="interaction-hint">
                            <span>Drag to Rotate | Scroll to Zoom</span>
                        </div>

                        <div className="view-controls" style={{ flexDirection: 'column' }}>
                            {!hideFullscreen && (
                                <button
                                    className="view-btn"
                                    onClick={() => {
                                        const elem = document.querySelector('.canvas-wrapper');
                                        if (!document.fullscreenElement) {
                                            elem.requestFullscreen().catch(err => {
                                                console.log(`Error attempting to enable fullscreen: ${err.message}`);
                                            });
                                        } else {
                                            document.exitFullscreen();
                                        }
                                    }}
                                    title="Toggle Fullscreen"
                                >
                                    ⛶
                                </button>
                            )}
                            <button
                                className="view-btn"
                                onClick={() => setLightRotation(prev => (prev + 45) % 360)}
                                title="Rotate Lighting"
                            >
                                ☼
                            </button>
                        </div>

                        <div className="design-controls">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginRight: '1rem' }}>
                                <button 
                                    className={`control-btn jaw-toggle ${showUpperJaw ? 'active' : ''}`} 
                                    onClick={() => setShowUpperJaw(!showUpperJaw)} 
                                    title="Toggle Upper Jaw"
                                    style={{ width: '30px', height: '30px', fontSize: '0.9rem', backgroundColor: showUpperJaw ? 'var(--color-accent)' : 'transparent', color: showUpperJaw ? '#000' : 'var(--color-text)', border: '1px solid rgba(255,255,255,0.2)' }}
                                >U</button>
                                <button 
                                    className={`control-btn jaw-toggle ${showLowerJaw ? 'active' : ''}`} 
                                    onClick={() => setShowLowerJaw(!showLowerJaw)} 
                                    title="Toggle Lower Jaw"
                                    style={{ width: '30px', height: '30px', fontSize: '0.9rem', backgroundColor: showLowerJaw ? 'var(--color-accent)' : 'transparent', color: showLowerJaw ? '#000' : 'var(--color-text)', border: '1px solid rgba(255,255,255,0.2)' }}
                                >L</button>
                            </div>

                            {!validModelUrl && (
                                <button className="control-btn" onClick={prevDesign}>
                                    <FaChevronLeft />
                                </button>
                            )}
                            <div className="design-info">
                                <h3>{designs[index]}</h3>
                                {!validModelUrl && (
                                    <div className="design-indicator">
                                        {designs.map((_, i) => (
                                            <div key={i} className={`indicator-dot ${i === index ? 'active' : ''}`} />
                                        ))}
                                    </div>
                                )}
                                {validModelUrl && (
                                    <div style={{ fontSize: '0.7rem', color: '#ffb347', marginTop: '4px', letterSpacing: '0.5px' }}>
                                        AI-GENERATED APPROXIMATION
                                    </div>
                                )}
                            </div>
                            {!validModelUrl && (
                                <button className="control-btn" onClick={nextDesign}>
                                    <FaChevronRight />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WebGLShowcase;
