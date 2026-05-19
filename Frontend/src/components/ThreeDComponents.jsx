import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Torus, Box, Text3D, Center } from "@react-three/drei";
import * as THREE from "three";

// Floating 3D coins for the hero section
function FloatingCoins() {
  const groupRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.2;
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.1;
  });

  return (
    <group ref={groupRef} position={[2, 0, 0]}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.08, 32]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </mesh>
      </Float>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
        <mesh position={[-0.5, -0.3, 0.3]}>
          <cylinderGeometry args={[0.3, 0.3, 0.06, 32]} />
          <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
        </mesh>
      </Float>
      <Float speed={2.5} rotationIntensity={0.4} floatIntensity={0.6}>
        <mesh position={[0.6, -0.5, -0.2]}>
          <cylinderGeometry args={[0.25, 0.25, 0.05, 32]} />
          <meshStandardMaterial color="#CD7F32" metalness={0.7} roughness={0.3} />
        </mesh>
      </Float>
    </group>
  );
}

// Animated sphere with distortion
function AnimatedSphere({ color, position, scale = 1 }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.position.y = position[1] + Math.sin(t + position[0]) * 0.1;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <MeshDistortMaterial color={color} speed={2} distort={0.3} />
      </mesh>
    </Float>
  );
}

// 3D Ring torus
function AnimatedTorus({ color, position, scale = 1 }) {
  const torusRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    torusRef.current.rotation.x = t * 0.5;
    torusRef.current.rotation.y = t * 0.3;
  });

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
      <mesh ref={torusRef} position={position} scale={scale}>
        <torusGeometry args={[0.4, 0.15, 16, 100]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} />
      </mesh>
    </Float>
  );
}

// 3D Card representation
function ExpenseCard3D({ color, delay = 0 }) {
  const cardRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    cardRef.current.rotation.x = Math.sin(t + delay) * 0.1;
    cardRef.current.rotation.y = Math.cos(t * 0.5 + delay) * 0.1;
  });

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.4}>
      <mesh ref={cardRef}>
        <boxGeometry args={[0.8, 0.5, 0.05]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.5} />
      </mesh>
    </Float>
  );
}

// Main 3D Scene for Home Page
export function HomeScene() {
  return (
    <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '100%', pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#4f46e5" intensity={0.5} />
        
        <FloatingCoins />
        <AnimatedSphere color="#22c55e" position={[-1.5, 1, 0]} scale={0.6} />
        <AnimatedSphere color="#3b82f6" position={[1.5, -0.5, 0]} scale={0.5} />
        <AnimatedTorus color="#fbbf24" position={[0, -1, 0]} scale={0.7} />
      </Canvas>
    </div>
  );
}

// 3D Background for Navbar
export function Navbar3D() {
  return (
    <Canvas
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.15
      }}
      camera={{ position: [0, 0, 3], fov: 50 }}
    >
      <ambientLight intensity={0.3} />
      <AnimatedSphere color="#6366f1" position={[-1, 0, 0]} scale={0.3} />
      <AnimatedSphere color="#ec4899" position={[1, 0, 0]} scale={0.3} />
    </Canvas>
  );
}

// 3D Stats Card
export function StatsCard3D({ color }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.3;
    meshRef.current.rotation.y = t * 0.2;
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.3} />
      </mesh>
    </Float>
  );
}

// Particle field background
export function ParticleField() {
  const count = 50;
  const meshRef = useRef();
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * Math.PI * 2;
      const f = Math.random() * Math.PI;
      const radius = 2 + Math.random() * 2;
      temp.push({
        position: [
          radius * Math.sin(f) * Math.cos(t),
          radius * Math.sin(f) * Math.sin(t),
          radius * Math.cos(f)
        ],
        scale: 0.02 + Math.random() * 0.03
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.05;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={new Float32Array(particles.flatMap(p => p.position))}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#6366f1" transparent opacity={0.6} />
    </points>
  );
}

// Full page 3D background
export function FullPage3DBackground() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, -5, 5]} color="#ec4899" intensity={0.4} />
        
        <ParticleField />
        
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
          <mesh position={[-2, 1, -1]}>
            <torusGeometry args={[0.3, 0.1, 16, 32]} />
            <meshStandardMaterial color="#22c55e" metalness={0.6} roughness={0.2} />
          </mesh>
        </Float>
        
        <Float speed={2} rotationIntensity={0.15} floatIntensity={0.3}>
          <mesh position={[2, -1, -0.5]}>
            <icosahedronGeometry args={[0.3, 0]} />
            <meshStandardMaterial color="#3b82f6" metalness={0.5} roughness={0.3} />
          </mesh>
        </Float>
      </Canvas>
    </div>
  );
}

export default { HomeScene, Navbar3D, StatsCard3D, ParticleField, FullPage3DBackground };