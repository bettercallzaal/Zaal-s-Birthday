import React, { Suspense, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Float, 
  Text, 
  Stars, 
  MeshDistortMaterial,
  Environment,
  PresentationControls,
  ContactShadows
} from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

// --- Constants ---
const PAYPAL_PAYMENT_LINK = "https://paypal.com/paypalme/zaalpanthaki";
const GIVETH_LINK = "https://giveth.io/project/sustaining-zao-festivals-creativity-technology";
const DONATE_HUB_LINK = "https://donate.zaostock.com";

const COLORS = {
  zabalRed: '#DC2626',
  zabalWhite: '#FFFFFF',
  zabalBlack: '#000000',
  navyBG: '#0a0a20',
  zaoYellow: '#FACC15',
};

// --- Components ---

/**
 * Animated Confetti Burst
 */
const fireConfetti = () => {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    colors: [COLORS.zabalRed, COLORS.zaoYellow, COLORS.zabalWhite]
  });
};

/**
 * Floating Gift Box (Main CTA)
 */
function GiftButton({ onClick }: { onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.01;
    meshRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.2;
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
      <group onClick={() => { fireConfetti(); onClick(); }} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        {/* The Gift Box */}
        <mesh ref={meshRef} castShadow receiveShadow>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshStandardMaterial 
            color={hovered ? COLORS.zaoYellow : COLORS.zabalRed} 
            emissive={hovered ? COLORS.zaoYellow : COLORS.zabalRed}
            emissiveIntensity={hovered ? 0.8 : 0.2}
            roughness={0.1}
            metalness={0.2}
          />
        </mesh>
        
        {/* Ribbon - Vertical */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.6, 1.55, 0.4]} />
          <meshStandardMaterial color={COLORS.zabalWhite} roughness={0.3} />
        </mesh>
        {/* Ribbon - Horizontal */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.4, 1.55, 1.6]} />
          <meshStandardMaterial color={COLORS.zabalWhite} roughness={0.3} />
        </mesh>

        {/* Text */}
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.35}
          color={COLORS.zabalWhite}
          maxWidth={2}
          textAlign="center"
        >
          {hovered ? "CLICK TO GIFT!" : "GIFT ZAAL"}
        </Text>
      </group>
    </Float>
  );
}

/**
 * Floating Balloons
 */
function Balloon({ position, color }: { position: [number, number, number], color: string }) {
  const ref = useRef<THREE.Group>(null);
  const initialY = position[1];
  
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = initialY + Math.sin(state.clock.getElapsedTime() + position[0]) * 0.5;
    ref.current.rotation.y += 0.005;
  });

  return (
    <group ref={ref} position={position}>
      <mesh castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.05} metalness={0.6} />
      </mesh>
      <mesh position={[0, -0.6, 0]}>
        <coneGeometry args={[0.1, 0.2, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

/**
 * Floor Decorations (Wrapped Gifts)
 */
function FloorGifts() {
  const gifts = useMemo(() => [
    { pos: [-3, -3.4, -2] as [number, number, number], color: COLORS.zabalRed, size: 0.6 },
    { pos: [4, -3.2, -1] as [number, number, number], color: COLORS.zaoYellow, size: 0.8 },
    { pos: [2, -3.5, -4] as [number, number, number], color: COLORS.zabalWhite, size: 0.5 },
  ], []);

  return (
    <>
      {gifts.map((g, i) => (
        <mesh key={i} position={g.pos} castShadow receiveShadow>
          <boxGeometry args={[g.size, g.size, g.size]} />
          <meshStandardMaterial color={g.color} roughness={0.4} />
        </mesh>
      ))}
    </>
  );
}

/**
 * Music Decor: Floating Vinyl Record
 */
function VinylRecord({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z += 0.02;
    ref.current.position.y += Math.sin(state.clock.getElapsedTime() * 0.5) * 0.002;
  });

  return (
    <group ref={ref} position={position} rotation={[Math.PI / 3, 0, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.8, 0.8, 0.02, 64]} />
        <meshStandardMaterial color="#080808" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.015, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.02, 32]} />
        <meshStandardMaterial color={COLORS.zabalRed} emissive={COLORS.zabalRed} emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

/**
 * Geometric Wall Decoration
 */
function WallDecor() {
  return (
    <group position={[0, 0, -8]}>
      {/* Large Neon Sign Background */}
      <mesh position={[0, 3, 0]}>
        <planeGeometry args={[8, 2]} />
        <meshStandardMaterial color={COLORS.navyBG} emissive={COLORS.zabalRed} emissiveIntensity={0.2} transparent opacity={0.5} />
      </mesh>
      <Text
        position={[0, 3, 0.1]}
        fontSize={1}
        color={COLORS.zabalWhite}
        anchorX="center"
        anchorY="middle"
      >
        ZABAL
      </Text>
      
      {/* Geometric Triangles */}
      <mesh position={[-5, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
        <coneGeometry args={[1, 2, 3]} />
        <meshStandardMaterial color={COLORS.zaoYellow} wireframe />
      </mesh>
      <mesh position={[5, -1, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <coneGeometry args={[0.8, 1.5, 3]} />
        <meshStandardMaterial color={COLORS.zabalRed} wireframe />
      </mesh>

      {/* ZAO Poster */}
      <group position={[0, -2, 0.1]}>
        <mesh>
          <planeGeometry args={[4, 2.5]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <Text
          position={[0, 0, 0.05]}
          fontSize={0.4}
          color={COLORS.zaoYellow}
          anchorX="center"
        >
          THE ZAO
        </Text>
        <Text
          position={[0, -0.6, 0.05]}
          fontSize={0.15}
          color={COLORS.zabalWhite}
          anchorX="center"
        >
          MUSIC • COMMUNITY • ARTISTS
        </Text>
      </group>
    </group>
  );
}

/**
 * Falling Confetti Particles (Continuous)
 */
function FallingConfetti({ count = 100 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const light = useRef<THREE.Group>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -10 + Math.random() * 20;
      const yFactor = -10 + Math.random() * 20;
      const zFactor = -10 + Math.random() * 20;
      const color = new THREE.Color(Math.random() > 0.5 ? COLORS.zabalRed : COLORS.zaoYellow);
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, color });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      
      dummy.position.set(
        (particle.xFactor) + (Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10),
        (particle.yFactor) + (Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10),
        (particle.zFactor) + (Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10)
      );
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
      mesh.current!.setColorAt(i, particle.color);
    });
    mesh.current!.instanceMatrix.needsUpdate = true;
    if (mesh.current!.instanceColor) mesh.current!.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <planeGeometry args={[0.05, 0.05]} />
      <meshStandardMaterial metalness={0.5} roughness={0.1} side={THREE.DoubleSide} />
    </instancedMesh>
  );
}

/**
 * Birthday Cake Component
 */
function BirthdayCake({ position }: { position: [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y += 0.005;
    group.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 2) * 0.05;
  });

  return (
    <group ref={group} position={position}>
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, 0.6, 32]} />
        <meshStandardMaterial color={COLORS.zabalWhite} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 0.7, 0.5, 32]} />
        <meshStandardMaterial color={COLORS.zabalRed} />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow>
        <torusGeometry args={[0.7, 0.05, 16, 100]} />
        <meshStandardMaterial color={COLORS.zaoYellow} />
      </mesh>
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
        <meshStandardMaterial color={COLORS.zabalWhite} />
      </mesh>
      <mesh position={[0, 1.25, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={COLORS.zaoYellow} emissive={COLORS.zaoYellow} emissiveIntensity={10} />
      </mesh>
      <pointLight position={[0, 1.3, 0]} intensity={10} color={COLORS.zaoYellow} distance={3} />
    </group>
  );
}

/**
 * Dancing Festival Lights
 */
function FestivalLights() {
  const lightRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!lightRef.current) return;
    lightRef.current.rotation.y = state.clock.getElapsedTime() * 0.8;
  });

  return (
    <group ref={lightRef}>
       <spotLight position={[8, 8, 8]} angle={0.4} penumbra={1} intensity={100} color={COLORS.zabalRed} castShadow shadow-bias={-0.0001} />
       <spotLight position={[-8, 8, 8]} angle={0.4} penumbra={1} intensity={100} color={COLORS.zaoYellow} castShadow shadow-bias={-0.0001} />
       <spotLight position={[0, 8, -8]} angle={0.4} penumbra={1} intensity={100} color={COLORS.zabalWhite} castShadow shadow-bias={-0.0001} />
    </group>
  );
}

/**
 * Speaker Component
 */
function Speaker({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 1.8, 0.8]} />
        <meshStandardMaterial color="#050505" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.3, 0.41]}>
        <circleGeometry args={[0.35, 32]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0, 0.4, 0.41]}>
        <circleGeometry args={[0.2, 32]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    </group>
  );
}

/**
 * Microphone Component
 */
function Microphone({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, -2, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0, -0.5, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 3, 8]} />
        <meshStandardMaterial color="#aaa" metalness={1} roughness={0} />
      </mesh>
      <mesh position={[0, 1.1, 0]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#666" metalness={1} roughness={0.1} wireframe />
      </mesh>
    </group>
  );
}

/**
 * Party Room Scene
 */
function PartyRoom({ onGiftClick }: { onGiftClick: () => void }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 12]} fov={45} />
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        maxPolarAngle={Math.PI / 1.6} 
        minPolarAngle={Math.PI / 2.4}
        autoRotate
        autoRotateSpeed={0.2}
      />
      
      <ambientLight intensity={0.1} />
      
      {/* High-contrast Main Stage Light */}
      <spotLight 
        position={[0, 15, 0]} 
        intensity={250} 
        color={COLORS.zabalWhite} 
        angle={0.6} 
        penumbra={1} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />
      
      {/* Rim Lighting (Backlight for silhouette) */}
      <pointLight position={[0, 5, -15]} intensity={100} color={COLORS.zabalRed} />
      
      {/* Dynamic Party Glows */}
      <pointLight position={[10, 5, 5]} intensity={50} color={COLORS.zaoYellow} />
      <pointLight position={[-10, 5, 5]} intensity={50} color={COLORS.zabalRed} />
      
      <FestivalLights />
      
      <ContactShadows 
        position={[0, -3.95, 0]} 
        opacity={0.6} 
        scale={20} 
        blur={2} 
        far={4.5} 
      />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* 3D Room Visuals */}
      <GiftButton onClick={onGiftClick} />
      <FallingConfetti count={200} />
      
      <BirthdayCake position={[5, -3.5, -3]} />
      
      <Balloon position={[-6, 4, -4]} color={COLORS.zabalRed} />
      <Balloon position={[6, 3, -5]} color={COLORS.zaoYellow} />
      <Balloon position={[-8, 1, -8]} color={COLORS.zabalWhite} />
      <Balloon position={[8, 5, -3]} color={COLORS.zabalRed} />
      <Balloon position={[0, 6, -10]} color={COLORS.zaoYellow} />
      <Balloon position={[3, 5, -8]} color={COLORS.zabalRed} />
      <Balloon position={[-3, 4, -7]} color={COLORS.zabalWhite} />

      <VinylRecord position={[-5, 0, -2]} />
      <VinylRecord position={[6, 4, -6]} />
      <VinylRecord position={[0, 5, -4]} />

      <Speaker position={[-8, -3.1, -5]} rotation={[0, Math.PI / 4, 0]} />
      <Speaker position={[8, -3.1, -5]} rotation={[0, -Math.PI / 4, 0]} />
      <Microphone position={[-3.5, -2, 1]} />

      <WallDecor />
      <FloorGifts />

      {/* Floor */}
      <mesh position={[0, -4, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#020205" roughness={0.1} metalness={0.8} />
      </mesh>

      <Environment preset="night" />
    </>
  );
}

/**
 * Main UI Components
 */
const UIOverlay = ({ onGiftClick }: { onGiftClick: () => void }) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 md:p-12 text-white">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="bg-red-600 px-6 py-3 font-varsity text-4xl italic tracking-tighter border-2 border-white shadow-[6px_6px_0px_white] rotate-[-2deg]">
            ZABAL
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-yellow-400">ZAO-STOCK</h1>
            <p className="text-[10px] text-blue-300 font-bold tracking-widest bg-blue-900/50 px-2 py-0.5 rounded">ZAO FESTIVALS • EST. 2024</p>
          </div>
        </div>
      </motion.div>

      {/* Main Copy (Right Side Desktop) */}
      <div className="flex-1 flex flex-col justify-end md:justify-center items-end pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="max-w-md bg-black/60 backdrop-blur-xl p-10 border-2 border-white/20 rounded-[2.5rem] pointer-events-auto relative overflow-hidden"
        >
          {/* Subtle decoration in card */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 blur-3xl -z-10" />
          
          <h2 className="text-5xl font-black mb-6 leading-none italic uppercase tracking-tighter text-white">
            Gift Zaal for <br /><span className="text-red-500 font-varsity">ZAO-STOCK</span>
          </h2>
          <p className="text-yellow-400 font-black text-lg mb-6 leading-tight">
            Help fuel the biggest celebration in Ellsworth, Maine.
          </p>
          <div className="space-y-4 mb-8">
            <p className="text-gray-300 text-sm leading-relaxed">
              Zaal is throwing <strong>ZAO-STOCK</strong>: a community-powered festival on <span className="text-white font-bold">October 3, 2026</span>.
            </p>
            <p className="text-gray-400 text-xs italic">
              Your gift directly powers the stage, the artists, and the community vibe that makes ZAO legendary.
            </p>
          </div>
          
          <button
            onClick={onGiftClick}
            className="w-full bg-red-600 hover:bg-white hover:text-black text-white font-black py-5 px-8 rounded-2xl transition-all shadow-[0_0_40px_rgba(220,38,38,0.3)] flex items-center justify-center gap-3 group text-xl"
          >
            SEND VIA PAYPAL
            <span className="group-hover:translate-x-2 transition-transform text-2xl">→</span>
          </button>

          <a
            href={GIVETH_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 w-full block bg-white/[0.08] hover:bg-white/[0.16] text-white font-bold py-3 px-6 rounded-xl transition-all text-center text-sm"
          >
            Send crypto via Giveth →
          </a>

          <a
            href={DONATE_HUB_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-center text-xs text-gray-400 hover:text-white underline underline-offset-4"
          >
            Tax-deductible + more options at donate.zaostock.com
          </a>

          <div className="mt-6 flex justify-center gap-4 grayscale opacity-50">
            <div className="text-[8px] font-bold border border-white px-2 py-1 uppercase">ZAOstock</div>
            <div className="text-[8px] font-bold border border-white px-2 py-1 uppercase">Music</div>
            <div className="text-[8px] font-bold border border-white px-2 py-1 uppercase">Community</div>
          </div>
        </motion.div>
      </div>

      {/* Footer Info */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 flex flex-col md:flex-row justify-between items-center gap-6 border-t-2 border-white/10 pt-8"
      >
        <div className="text-xs font-black text-gray-500 italic tracking-[0.2em] flex gap-4 flex-wrap justify-center">
          <span>THE ZAO</span>
          <span className="text-red-600">•</span>
          <span>WAVEWARZ</span>
          <span className="text-red-600">•</span>
          <span>THE ZABAL</span>
          <span className="text-red-600">•</span>
          <span>BETTERCALL ZAAL STRATEGIES</span>
        </div>
        <div className="text-[10px] text-gray-600 font-mono tracking-tighter">
          ZAO-STOCK 2026 • BUILT FOR THE ARTISTS
        </div>
      </motion.div>
    </div>
  );
};


export default function App() {
  const handleGiftClick = () => {
    window.open(PAYPAL_PAYMENT_LINK, '_blank');
  };

  return (
    <div className="relative w-full h-screen bg-[#0a0a20] overflow-hidden font-sans">
      {/* 3D Viewport */}
      <div className="absolute inset-0">
        <Canvas shadows gl={{ antialias: true }}>
          <Suspense fallback={<Text color="white" position={[0,0,0]}>LOADING PARTY...</Text>}>
            <PartyRoom onGiftClick={handleGiftClick} />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <UIOverlay onGiftClick={handleGiftClick} />

      {/* Mobile Hint */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 md:hidden text-white/50 text-[10px] uppercase tracking-widest pointer-events-none">
        Slide to look around
      </div>
    </div>
  );
}
