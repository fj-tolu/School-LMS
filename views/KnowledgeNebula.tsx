import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { useNebula } from '../contexts/NebulaContext';
import * as THREE from 'three';

const Particles = ({ triggerPulseRef }: { triggerPulseRef: React.MutableRefObject<(() => void) | null> }) => {
    const ref = useRef<THREE.Points>(null);
    const pulseTimeRef = useRef(-1);

    const particles = useMemo(() => {
        const count = 5000;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 20;
        }
        return positions;
    }, []);

    useEffect(() => {
        triggerPulseRef.current = () => {
            pulseTimeRef.current = 0;
        };
    }, [triggerPulseRef]);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x += delta / 25;
            ref.current.rotation.y += delta / 30;

            const targetX = state.mouse.x * state.viewport.width / 5;
            const targetY = state.mouse.y * state.viewport.height / 5;
            ref.current.position.x += (targetX - ref.current.position.x) * 0.02;
            ref.current.position.y += (targetY - ref.current.position.y) * 0.02;
            ref.current.position.z += (-1 - ref.current.position.z) * 0.01;
        }
    });

    return (
        <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
             <PointMaterial
                transparent
                color="#4A5568"
                size={0.015}
                sizeAttenuation={true}
                depthWrite={false}
             />
        </Points>
    );
};

const KnowledgeNebula = () => {
    const { triggerPulseRef } = useNebula();
    
    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[#0f172a]">
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                <Particles triggerPulseRef={triggerPulseRef} />
            </Canvas>
        </div>
    );
};

export default KnowledgeNebula;