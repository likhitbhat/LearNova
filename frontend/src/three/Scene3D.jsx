import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Icosahedron, Torus } from '@react-three/drei';

const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const RotatingMesh = ({ children }) => {
    const ref = useRef();
    const reduced = useMemo(prefersReducedMotion, []);

    useFrame((_, delta) => {
        if (reduced || !ref.current) return;
        ref.current.rotation.x += delta * 0.15;
        ref.current.rotation.y += delta * 0.2;
    });

    return <group ref={ref}>{children}</group>;
};

const VARIANTS = {
    blob: (color) => (
        <Icosahedron args={[1.4, 6]}>
            <MeshDistortMaterial color={color} speed={2} distort={0.4} roughness={0.2} metalness={0.3} />
        </Icosahedron>
    ),
    torus: (color) => (
        <Torus args={[1.1, 0.4, 32, 100]}>
            <meshStandardMaterial color={color} roughness={0.25} metalness={0.4} />
        </Torus>
    ),
    icosahedron: (color) => (
        <Icosahedron args={[1.3, 0]}>
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} flatShading />
        </Icosahedron>
    ),
};

const Scene3D = ({ variant = 'blob', color = '#7073ff', className = '' }) => {
    const mesh = VARIANTS[variant] || VARIANTS.blob;

    return (
        <div className={`pointer-events-none absolute inset-0 z-0 ${className}`} aria-hidden="true">
            <Canvas
                dpr={[1, 1.5]}
                gl={{ alpha: true, antialias: true }}
                camera={{ position: [0, 0, 5], fov: 45 }}
            >
                <ambientLight intensity={0.6} />
                <directionalLight position={[3, 3, 3]} intensity={1.2} />
                <Suspense fallback={null}>
                    <Float speed={2} rotationIntensity={0.6} floatIntensity={1.2}>
                        <RotatingMesh>{mesh(color)}</RotatingMesh>
                    </Float>
                </Suspense>
            </Canvas>
        </div>
    );
};

export default Scene3D;
