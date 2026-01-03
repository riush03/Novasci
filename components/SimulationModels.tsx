
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { 
  Sphere, Text, Box, Cylinder, Torus, 
  MeshDistortMaterial, 
  Float, Trail, Cone, Capsule, QuadraticBezierLine
} from '@react-three/drei';
import * as THREE from 'three';
import { ScienceModule } from '../types';

// --- HELPER: INDICATOR ARROW ---
const IndicatorArrow = ({ position, rotation, label, color = "#22d3ee" }: { position: [number, number, number], rotation: [number, number, number], label: string, color?: string }) => {
  return (
    <group position={position} rotation={rotation}>
      <Float speed={3} rotationIntensity={0.2} floatIntensity={0.4}>
        <group>
          <Cylinder args={[0.03, 0.03, 1.5]} position={[0, 0.75, 0]}>
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={4} transparent opacity={0.8} />
          </Cylinder>
          <Cone args={[0.12, 0.25, 16]} position={[0, 0, 0]} rotation={[Math.PI, 0, 0]}>
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={6} />
          </Cone>
          <group position={[0, 2.0, 0]}>
            <Text 
              fontSize={0.35} 
              color={color} 
              anchorX="center" 
              anchorY="middle"
              fillOpacity={1}
            >
              {label}
            </Text>
          </group>
        </group>
      </Float>
    </group>
  );
};

// --- PHYSICS: NEWTON'S SECOND LAW ---
const Car = ({ scale = 1.2 }) => {
  const wheelsRef = useRef<THREE.Group>(null);
  useFrame(() => { 
    if (wheelsRef.current) {
      wheelsRef.current.children.forEach(w => w.rotation.x += 0.1); 
    }
  });
  return (
    <group scale={scale}>
      <Box args={[2.5, 0.6, 1.2]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color="#ef4444" metalness={0.7} roughness={0.2} emissive="#ef4444" emissiveIntensity={0.2} />
      </Box>
      <Box args={[1.2, 0.6, 1.0]} position={[-0.2, 1.0, 0]}>
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} transparent opacity={0.8} />
      </Box>
      <group ref={wheelsRef}>
        {[[-0.8, 0.3, 0.6], [0.8, 0.3, 0.6], [-0.8, 0.3, -0.6], [0.8, 0.3, -0.6]].map((pos, i) => (
          <Cylinder key={i} args={[0.3, 0.3, 0.2, 16]} position={pos as any} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#111827" />
          </Cylinder>
        ))}
      </group>
    </group>
  );
};

const NewtonModel = () => {
  const carRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const cycle = (t * 3) % 60;
    if (carRef.current) { 
      carRef.current.position.x = -30 + cycle; 
    }
  });
  return (
    <group position={[0, -2, 0]}>
      <Box args={[100, 0.2, 10]} position={[0, -0.1, 0]}>
        <meshStandardMaterial color="#0f172a" />
        <gridHelper args={[100, 20, 0x334155, 0x1e293b]} position={[0, 0.11, 0]} />
      </Box>
      <group ref={carRef} position={[-20, 0, 0]}>
        <Car />
        <IndicatorArrow position={[0, 3, 0]} rotation={[0, 0, 0]} label="Mass (m)" color="#ef4444" />
      </group>
      <Text position={[0, 8, 0]} fontSize={1.4} color="#8b5cf6">F = m × a</Text>
    </group>
  );
};

// --- ASTRONOMY: ORBITAL MECHANICS ---
const Satellite = ({ radius = 3, speed = 1 }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;
    if (ref.current) {
      ref.current.position.x = Math.cos(t) * radius;
      ref.current.position.z = Math.sin(t) * radius;
      ref.current.rotation.y = -t;
    }
  });
  return (
    <group ref={ref}>
      <Box args={[0.4, 0.4, 0.4]}>
        <meshStandardMaterial color="#94a3b8" metalness={1} roughness={0.1} />
      </Box>
      <Box args={[1.5, 0.05, 0.6]} position={[1, 0, 0]}>
        <meshStandardMaterial color="#1e40af" emissive="#1e40af" emissiveIntensity={0.5} />
      </Box>
      <Box args={[1.5, 0.05, 0.6]} position={[-1, 0, 0]}>
        <meshStandardMaterial color="#1e40af" emissive="#1e40af" emissiveIntensity={0.5} />
      </Box>
      <Cylinder args={[0.02, 0.02, 0.5]} position={[0, 0.4, 0]}>
        <meshStandardMaterial color="#cbd5e1" />
      </Cylinder>
    </group>
  );
};

const SolarSystemModel = () => {
  const earthRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 0.2;
    if (earthRef.current) {
      earthRef.current.position.x = Math.cos(t) * 12;
      earthRef.current.position.z = Math.sin(t) * 12;
      earthRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group>
      <RealisticSun scale={3} />
      <Torus args={[12, 0.05, 16, 128]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
      </Torus>
      <group ref={earthRef}>
        <Sphere args={[1.5, 32, 32]}>
          <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={0.2} />
        </Sphere>
        <Satellite radius={3} speed={2} />
        <Torus args={[3, 0.02, 16, 64]} rotation={[Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
        </Torus>
        <IndicatorArrow position={[0, 4.5, 0]} rotation={[0, 0, 0]} label="Orbital Path" color="#0ea5e9" />
      </group>
      <Text position={[0, 8, 0]} fontSize={0.8} color="#facc15">Gravity: F = G(m1m2)/r²</Text>
    </group>
  );
};

// --- MAGNETISM: DUAL BAR MAGNETS ---
const BarMagnet = ({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) => {
  return (
    <group position={position} rotation={rotation}>
      <Box args={[1, 1.5, 1]} position={[0, 0.75, 0]}>
        <meshStandardMaterial color="#ef4444" metalness={0.5} roughness={0.2} emissive="#ef4444" emissiveIntensity={0.5} />
        <Text position={[0, 0, 0.51]} fontSize={0.4} color="white">N</Text>
      </Box>
      <Box args={[1, 1.5, 1]} position={[0, -0.75, 0]}>
        <meshStandardMaterial color="#3b82f6" metalness={0.5} roughness={0.2} emissive="#3b82f6" emissiveIntensity={0.5} />
        <Text position={[0, 0, 0.51]} fontSize={0.4} color="white">S</Text>
      </Box>
    </group>
  );
};

const MagnetismModel = () => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
  });
  const lines = [
    { start: [-3, 0.75, 0], end: [3, -0.75, 0], mid: [0, 2, 0] },
    { start: [-3, -0.75, 0], end: [3, 0.75, 0], mid: [0, -2, 0] },
    { start: [-3, 1.2, 0], end: [3, -1.2, 0], mid: [0, 4, 0] },
  ];
  return (
    <group ref={groupRef}>
      <BarMagnet position={[-3.5, 0, 0]} rotation={[0, 0, 0]} />
      <BarMagnet position={[3.5, 0, 0]} rotation={[0, 0, 0]} />
      {lines.map((l, i) => (
        <group key={i}>
          <QuadraticBezierLine start={l.start as any} end={l.end as any} mid={l.mid as any} color="#22d3ee" lineWidth={1} transparent opacity={0.4} />
          <Float speed={2} floatIntensity={0.5}>
            <IndicatorArrow position={l.mid as any} rotation={[0, 0, i % 2 === 0 ? Math.PI/2 : -Math.PI/2]} label="" color="#22d3ee" />
          </Float>
        </group>
      ))}
      <Text position={[0, 6, 0]} fontSize={0.8} color="#ef4444">Magnetic Flux Fields</Text>
    </group>
  );
};

// --- PHOTOSYNTHESIS: SUNLIGHT & GROWTH ---
const PhotonRay = ({ delay = 0 }) => {
  const rayRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = (state.clock.getElapsedTime() + delay) % 2;
    if (rayRef.current) {
      // Move from Sun [0, 10, -8] to Plant [0, -2, 0]
      rayRef.current.position.x = 0;
      rayRef.current.position.y = 10 - t * 6;
      rayRef.current.position.z = -8 + t * 4;
      rayRef.current.scale.setScalar(t < 0.1 ? t * 10 : 1);
      (rayRef.current.children[0] as any).material.opacity = 1 - (t / 2);
    }
  });
  return (
    <group ref={rayRef}>
      <Sphere args={[0.1, 8, 8]}>
        <meshStandardMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={10} transparent />
      </Sphere>
    </group>
  );
};

const PhotosynthesisModel = () => {
  const plantRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Growth cycle: Grows to full size every 10 seconds
    const growth = (Math.sin(t * 0.3 - Math.PI / 2) + 1) / 2;
    const currentScale = 0.2 + growth * 1.5;
    if (plantRef.current) {
      plantRef.current.scale.setScalar(currentScale);
    }
  });

  return (
    <group>
      <RealisticSun position={[0, 10, -8]} scale={1.8} />
      
      {/* Sunlight rays */}
      {[0, 0.4, 0.8, 1.2, 1.6].map((d) => <PhotonRay key={d} delay={d} />)}

      <group ref={plantRef} position={[0, -5, 0]}>
        {/* Pot */}
        <Cylinder args={[1.5, 1, 1.5, 16]} position={[0, 0.75, 0]}>
          <meshStandardMaterial color="#78350f" />
        </Cylinder>
        {/* Stem */}
        <Cylinder args={[0.2, 0.3, 8, 16]} position={[0, 4.5, 0]}>
          <meshStandardMaterial color="#15803d" />
        </Cylinder>
        {/* Leaves */}
        {[2, 4, 6].map((y, i) => (
          <group key={y} position={[0, y, 0]} rotation={[0, (i * Math.PI) / 2, 0]}>
            <Box args={[3, 0.1, 1.5]} position={[1.5, 0, 0]} rotation={[0, 0, Math.PI / 10]}>
              <meshStandardMaterial color="#22c55e" />
            </Box>
          </group>
        ))}
        <IndicatorArrow position={[0, 9, 0]} rotation={[0, 0, 0]} label="Photosynthesis in Action" color="#22c55e" />
      </group>

      <Text position={[0, 10, 0]} fontSize={0.7} color="#22c55e" anchorX="center">Solar Energy -> Chemical Energy</Text>
    </group>
  );
};

// --- SOUND WAVES: TUNING FORK & SPEED ---
const TuningFork = () => {
  const forkRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (forkRef.current) {
      // Vibrate the fork
      const t = state.clock.getElapsedTime();
      const vibration = Math.sin(t * 100) * 0.01;
      forkRef.current.children[1].rotation.z = Math.PI / 2 + vibration; // Prongs
      forkRef.current.children[2].rotation.z = -Math.PI / 2 - vibration;
    }
  });
  return (
    <group ref={forkRef} position={[0, 0, 0]}>
      {/* Handle */}
      <Cylinder args={[0.2, 0.2, 3]} position={[0, -1.5, 0]}>
        <meshStandardMaterial color="#94a3b8" metalness={1} roughness={0.1} />
      </Cylinder>
      {/* Base of prongs */}
      <Box args={[1.5, 0.4, 0.4]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#94a3b8" metalness={1} roughness={0.1} />
      </Box>
      {/* Prong 1 */}
      <Cylinder args={[0.2, 0.2, 4]} position={[0.75, 2, 0]}>
        <meshStandardMaterial color="#94a3b8" metalness={1} roughness={0.1} />
      </Cylinder>
      {/* Prong 2 */}
      <Cylinder args={[0.2, 0.2, 4]} position={[-0.75, 2, 0]}>
        <meshStandardMaterial color="#94a3b8" metalness={1} roughness={0.1} />
      </Cylinder>
    </group>
  );
};

const SoundRipples = () => {
  const ripplesRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ripplesRef.current) {
      ripplesRef.current.children.forEach((ripple, i) => {
        const t = (state.clock.getElapsedTime() + i * 0.5) % 3;
        ripple.scale.setScalar(1 + t * 4);
        (ripple as any).material.opacity = (3 - t) / 6;
      });
    }
  });
  return (
    <group ref={ripplesRef}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Torus key={i} args={[2, 0.05, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.3} />
        </Torus>
      ))}
    </group>
  );
};

const SoundWavesModel = () => {
  return (
    <group>
      <TuningFork />
      <SoundRipples />
      
      <IndicatorArrow position={[0, 6, 0]} rotation={[0, 0, 0]} label="Vibrating Tuning Fork" color="#38bdf8" />
      
      <group position={[0, -6, 0]}>
        <Text fontSize={0.6} color="#38bdf8" anchorX="center" anchorY="top">
          SPEED OF SOUND: ~343 m/s
        </Text>
        <Text fontSize={0.3} position={[0, -0.8, 0]} color="#94a3b8" anchorX="center" anchorY="top">
          Longitudinal Pressure Waves traveling through air
        </Text>
      </group>
    </group>
  );
};

// --- REMAINING MODELS ---
const RealisticSun = ({ position = [0, 0, 0] as [number, number, number], scale = 2 }) => {
  const coreRef = useRef<THREE.Mesh>(null);
  useFrame((state) => { if (coreRef.current) coreRef.current.rotation.y = state.clock.getElapsedTime() * 0.05; });
  return (
    <group position={position}>
      <Sphere ref={coreRef} args={[scale, 64, 64]}>
        <meshStandardMaterial color="#fff7ed" emissive="#facc15" emissiveIntensity={10} roughness={0.1} />
      </Sphere>
      <pointLight intensity={15} distance={60} color="#fff7ed" />
    </group>
  );
};

const AtomModel = () => {
  const nucleusRef = useRef<THREE.Group>(null);
  const electrons = [
    { radius: 4.0, speed: 1.5, offset: 0, tilt: [Math.PI/4, 0, 0], showArrow: true, label: "Electron (-)" },
    { radius: 6.0, speed: 1.0, offset: Math.PI / 2, tilt: [-Math.PI/4, Math.PI/4, 0], showArrow: false },
    { radius: 8.0, speed: 0.7, offset: Math.PI, tilt: [0, Math.PI/2, Math.PI/6], showArrow: false },
  ];
  const nucleons = useMemo(() => {
    const pts = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const radius = 0.7;
      pts.push({
        pos: [
          Math.cos(theta) * Math.sin(phi) * radius, 
          Math.sin(theta) * Math.sin(phi) * radius, 
          Math.cos(phi) * radius
        ],
        type: i % 2 === 0 ? 'proton' : 'neutron'
      });
    }
    return pts;
  }, []);
  useFrame((state) => {
    if (nucleusRef.current) nucleusRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
  });
  return (
    <group scale={1.1}>
      <pointLight intensity={10} distance={15} color="#ffffff" />
      <group ref={nucleusRef}>
        {nucleons.map((n, i) => (
          <Sphere key={i} position={n.pos as any} args={[0.45, 24, 24]}>
            <meshStandardMaterial color={n.type === 'proton' ? "#ff1111" : "#1144ff"} metalness={0.8} roughness={0.2} emissive={n.type === 'proton' ? "#ff0000" : "#0000ff"} emissiveIntensity={1.5} />
          </Sphere>
        ))}
      </group>
      <IndicatorArrow position={[-2.5, 2.5, 0]} rotation={[0, 0, -0.6]} label="Proton (+)" color="#ff1111" />
      <IndicatorArrow position={[2.5, -2.5, 0]} rotation={[0, 0, 2.5]} label="Neutron (0)" color="#1144ff" />
      {electrons.map((e, i) => (<ElectronOrbit key={i} {...e} radius={e.radius} speed={e.speed} offset={e.offset} tilt={e.tilt} showArrow={e.showArrow} label={e.label} />))}
      <Text position={[0, 10, 0]} fontSize={0.7} color="#22d3ee" anchorX="center">Atomic Structure</Text>
    </group>
  );
};

const ElectronOrbit: React.FC<{ radius: number, speed: number, offset: number, tilt: any, showArrow?: boolean, label?: string }> = ({ radius, speed, offset, tilt, showArrow, label }) => {
  const electronRef = useRef<THREE.Group>(null);
  const orbitRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const et = t * speed + offset;
    if (electronRef.current) {
      electronRef.current.position.x = Math.cos(et) * radius;
      electronRef.current.position.z = Math.sin(et) * radius;
    }
    if (orbitRef.current) orbitRef.current.rotation.y = t * 0.1;
  });
  return (
    <group rotation={tilt} ref={orbitRef}>
      <Torus args={[radius, 0.03, 16, 128]} rotation={[Math.PI/2, 0, 0]}>
        <meshStandardMaterial color="#00ffff" transparent opacity={0.3} emissive="#00ffff" emissiveIntensity={2} />
      </Torus>
      <group ref={electronRef}>
        <Trail width={2.5} length={12} color="#22d3ee" attenuation={(t) => t * t}>
          <Sphere args={[0.25, 20, 20]}>
            <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={10} />
          </Sphere>
        </Trail>
        {showArrow && <IndicatorArrow position={[0, 0.8, 0]} rotation={[0, 0, 0]} label={label || "Electron (-)"} color="#22d3ee" />}
      </group>
    </group>
  );
};

const BloodCell = ({ position }: { position: [number, number, number] }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.x += 0.01;
      ref.current.rotation.y += 0.015;
      ref.current.position.y += Math.sin(t + position[0]) * 0.005;
    }
  });
  return (
    <mesh ref={ref} position={position} scale={[1, 0.4, 1]}>
      <sphereGeometry args={[0.6, 32, 32]} />
      <meshStandardMaterial color="#b91c1c" metalness={0.1} roughness={0.8} emissive="#7f1d1d" emissiveIntensity={0.5} />
    </mesh>
  );
};

const Chromosome = ({ position }: { position: [number, number, number] }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.getElapsedTime() * 0.2;
  });
  return (
    <group ref={ref} position={position}>
      <Capsule args={[0.3, 3, 16, 32]} rotation={[0, 0, Math.PI / 6]}>
        <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={2} transparent opacity={0.8} />
      </Capsule>
      <Capsule args={[0.3, 3, 16, 32]} rotation={[0, 0, -Math.PI / 6]}>
        <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={2} transparent opacity={0.8} />
      </Capsule>
      <Sphere args={[0.4, 16, 16]}>
        <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={4} />
      </Sphere>
      <IndicatorArrow position={[0, 3, 0]} rotation={[0, 0, 0]} label="Chromosome" color="#ec4899" />
    </group>
  );
};

const DNAStructureModel = () => {
  const dnaRef = useRef<THREE.Group>(null);
  const helixData = useMemo(() => {
    const points = [];
    const rungs = 30;
    const radius = 1.2;
    const heightPerRung = 0.5;
    for (let i = 0; i < rungs; i++) {
      const angle = (i / rungs) * Math.PI * 6;
      const y = i * heightPerRung - (rungs * heightPerRung) / 2;
      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;
      points.push({ p1: [x1, y, z1], p2: [x2, y, z2], angle, type: i % 4 });
    }
    return points;
  }, []);
  useFrame((state) => {
    if (dnaRef.current) dnaRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
  });
  return (
    <group scale={1.2}>
      <BloodCell position={[-8, 4, -5]} />
      <BloodCell position={[-10, -2, -3]} />
      <IndicatorArrow position={[-8, 6, -5]} rotation={[0, 0, 0]} label="Red Blood Cell" color="#ef4444" />
      <Chromosome position={[7, 0, -2]} />
      <group ref={dnaRef} position={[-1, 0, 0]}>
        {helixData.map((rung, i) => (
          <group key={i}>
            <Cylinder args={[0.08, 0.08, 2.4]} position={[0, rung.p1[1], 0]} rotation={[0, 0, Math.PI / 2 + rung.angle]}>
              <meshStandardMaterial color={rung.type === 0 ? "#22d3ee" : rung.type === 1 ? "#facc15" : rung.type === 2 ? "#ec4899" : "#4ade80"} emissive={rung.type === 0 ? "#22d3ee" : rung.type === 1 ? "#facc15" : rung.type === 2 ? "#ec4899" : "#4ade80"} emissiveIntensity={3} />
            </Cylinder>
            <Sphere position={rung.p1 as any} args={[0.18, 16, 16]}><meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} /></Sphere>
            <Sphere position={rung.p2 as any} args={[0.18, 16, 16]}><meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} /></Sphere>
          </group>
        ))}
        <IndicatorArrow position={[0, 8.5, 0]} rotation={[0, 0, 0]} label="DNA Double Helix" color="#22d3ee" />
      </group>
      <Text position={[0, 11, 0]} fontSize={0.8} color="#ec4899" anchorX="center">Biological Blueprints</Text>
    </group>
  );
};

const MolecularBondingModel = () => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => { if (groupRef.current) groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.3; });
  return (
    <group ref={groupRef} scale={1.5}>
      <group position={[-2.5, 0, 0]}>
        <Sphere args={[0.8, 64, 64]}><meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={1} /></Sphere>
        <IndicatorArrow position={[0, 1.5, 0]} rotation={[0, 0, 0]} label="Sodium (Na+)" color="#8b5cf6" />
      </group>
      <group position={[2.5, 0, 0]}>
        <Sphere args={[1.4, 64, 64]}><meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1} /></Sphere>
        <IndicatorArrow position={[0, 2.2, 0]} rotation={[0, 0, 0]} label="Chlorine (Cl-)" color="#22c55e" />
      </group>
      <Cylinder args={[0.3, 0.3, 5]} rotation={[0, 0, Math.PI/2]}><meshStandardMaterial color="#ffffff" transparent opacity={0.2} emissive="#ffffff" emissiveIntensity={2} /></Cylinder>
    </group>
  );
};

const AnimaliaModel = () => (<group><Text position={[0, 5, 0]} fontSize={0.6} color="#f472b6">Biological Systems</Text></group>);
const PlantaeModel = () => (<group><Text position={[0, 6, 0]} fontSize={0.6} color="#4ade80">Vascular Plant Transport</Text></group>);

// Master Export Component
export const ScienceSimulation: React.FC<{ type: ScienceModule }> = ({ type }) => {
  switch (type) {
    case ScienceModule.ATOM: return <AtomModel />;
    case ScienceModule.NEWTON_LAWS: return <NewtonModel />;
    case ScienceModule.SOLAR_SYSTEM: return <SolarSystemModel />;
    case ScienceModule.MOLECULAR_BONDING: return <MolecularBondingModel />;
    case ScienceModule.DNA_STRUCTURE: return <DNAStructureModel />;
    case ScienceModule.MAGNETISM: return <MagnetismModel />;
    case ScienceModule.PHOTOSYNTHESIS: return <PhotosynthesisModel />;
    case ScienceModule.SOUND_WAVES: return <SoundWavesModel />;
    case ScienceModule.ANIMALIA: return <AnimaliaModel />;
    case ScienceModule.PLANTAE: return <PlantaeModel />;
    default: return <RealisticSun scale={2} />;
  }
};
