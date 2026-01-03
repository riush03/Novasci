
import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Box, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

export const Instructor: React.FC<{ isSpeaking: boolean }> = ({ isSpeaking }) => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const jawRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);
  
  // Presence value from 0 (invisible) to 1 (fully visible)
  const [presence, setPresence] = useState(0);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    
    // Target visibility: 1 if speaking, 0 if not.
    const target = isSpeaking ? 1 : 0;
    
    // Smoothly animate the presence (visibility)
    const newPresence = THREE.MathUtils.lerp(presence, target, delta * (isSpeaking ? 3.0 : 0.8));
    setPresence(newPresence);
    
    if (groupRef.current) {
      // Position her closer to the center (x=3) so she's visible on more screen sizes
      // She slides in from the right (x=8 to x=3)
      groupRef.current.position.x = THREE.MathUtils.lerp(8, 3.2, newPresence);
      groupRef.current.scale.setScalar(newPresence * 1.2); // Slightly larger
      groupRef.current.rotation.y = -Math.PI / 10 + Math.sin(time * 0.4) * 0.1;
      groupRef.current.position.y = -1 + Math.sin(time * 1.5) * 0.05; // Hovering
    }

    if (headRef.current) {
      headRef.current.position.y = 0.8 + Math.sin(time * 2) * 0.03;
    }

    if (jawRef.current && isSpeaking) {
      // Sync jaw movement with a simulated "speaking" rhythm
      jawRef.current.position.y = -0.15 - Math.abs(Math.sin(time * 22)) * 0.12;
    } else if (jawRef.current) {
      jawRef.current.position.y = THREE.MathUtils.lerp(jawRef.current.position.y, -0.15, 0.1);
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 1.2;
      ringRef.current.rotation.x += delta * 0.5;
    }
  });

  // Don't render if completely invisible to save performance
  if (presence < 0.001 && !isSpeaking) return null;

  return (
    <group ref={groupRef} position={[3.2, -1, 0]}>
      {/* Platform glow effect */}
      <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3, 3]} />
        <meshStandardMaterial color="#0ea5e9" transparent opacity={0.2 * presence} emissive="#0ea5e9" emissiveIntensity={2} />
      </mesh>

      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Core Body */}
        <Box args={[0.5, 1.0, 0.3]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} transparent opacity={0.9 * presence} />
          {/* Inner holographic glow */}
          <Box args={[0.48, 0.98, 0.28]}>
             <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={isSpeaking ? 3 : 0.8} transparent opacity={0.3 * presence} />
          </Box>
        </Box>

        {/* Orbiting Ring */}
        <group ref={ringRef} position={[0, 0.2, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.8, 0.015, 16, 100]} />
            <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={10} transparent opacity={0.4 * presence} />
          </mesh>
        </group>
        
        {/* Pulsing Core */}
        <Sphere args={[0.15, 16, 16]} position={[0, 0.3, 0.16]}>
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={isSpeaking ? 12 : 2} />
        </Sphere>

        {/* Head */}
        <group ref={headRef} position={[0, 0.85, 0]}>
          <Box args={[0.45, 0.45, 0.45]}>
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} transparent opacity={presence} />
          </Box>
          
          {/* Eyes */}
          <group position={[0, 0.1, 0.22]}>
             <Sphere args={[0.06, 16, 16]} position={[-0.12, 0, 0]}>
                <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={isSpeaking ? 8 : 1} />
             </Sphere>
             <Sphere args={[0.06, 16, 16]} position={[0.12, 0, 0]}>
                <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={isSpeaking ? 8 : 1} />
             </Sphere>
          </group>

          {/* Jaw */}
          <mesh ref={jawRef} position={[0, -0.15, 0.18]}>
            <boxGeometry args={[0.25, 0.08, 0.15]} />
            <meshStandardMaterial color="#0f172a" transparent opacity={presence} />
          </mesh>
        </group>

        {/* Floating Hands */}
        <group position={[-1.1, 0.1, 0.4]}>
           <Float speed={6} floatIntensity={1.5}>
              <Box args={[0.12, 0.12, 0.25]} rotation={[0.5, 0.5, 0]}>
                 <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={3} transparent opacity={presence} />
              </Box>
           </Float>
        </group>
        <group position={[1.1, 0.4, 0.4]}>
           <Float speed={5} floatIntensity={1.2}>
              <Box args={[0.12, 0.12, 0.25]} rotation={[-0.5, -0.5, 0]}>
                 <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={3} transparent opacity={presence} />
              </Box>
           </Float>
        </group>
      </Float>

      {/* Tag */}
      <group position={[0, 1.7, 0]}>
        {/* Fix: Text component does not support 'transparent' or 'opacity' props directly. Use 'fillOpacity' for Troika text transparency. */}
        <Text fontSize={0.22} color="#22d3ee" anchorX="center" anchorY="middle" fillOpacity={presence}>
          NOVA-01
        </Text>
      </group>
      
      <pointLight position={[0, 1, 0.5]} color="#22d3ee" intensity={isSpeaking ? 5 : 1} distance={6} />
    </group>
  );
};
