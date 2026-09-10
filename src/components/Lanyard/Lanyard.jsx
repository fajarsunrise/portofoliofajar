'use client';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';
import './Lanyard.css';

extend({ MeshLineGeometry, MeshLineMaterial });

// Path langsung ke folder public
const cardGLB = "/assets/card.glb";
const lanyard = "/assets/lanyard.png";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Lanyard WebGL/Physics Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-[320px] rounded-3xl bg-zinc-950/60 border border-zinc-800/80 p-6 text-center">
          <img src="./assets/ahmad.png" className="w-16 h-16 rounded-full mb-4 opacity-50 filter grayscale" alt="Profile avatar placeholder" />
          <p className="text-sm font-semibold text-zinc-400">Interactive 3D Profile Lanyard</p>
          <p className="text-xs text-zinc-600 mt-1">WebGL is disabled or currently unavailable</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function Lanyard({ position = [0, 0, 30], gravity = [0, -40, 0], fov = 20, transparent = true }) {
  const [physicsReady, setPhysicsReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: '150px' }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let active = true;
    import('@dimforge/rapier3d-compat')
      .then((RAPIER) => RAPIER.init())
      .then(() => {
        if (active) {
          setPhysicsReady(true);
        }
      })
      .catch((err) => {
        console.error("Rapier initialization error:", err);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="lanyard-wrapper" ref={wrapperRef}>
      <ErrorBoundary>
        {physicsReady ? (
          <Canvas
            camera={{ position: position, fov: fov }}
            dpr={[1, 1.25]}
            frameloop={isVisible ? "always" : "never"}
            gl={{
              alpha: transparent,
              antialias: false,
              powerPreference: "default"
            }}
            onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
          >
            <ambientLight intensity={Math.PI} />
            <Suspense fallback={null}>
              <Physics gravity={gravity} timeStep={1 / 60}>
                <Band />
              </Physics>
              <Environment blur={0.75}>
                <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
                <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
                <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
                <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
              </Environment>
            </Suspense>
          </Canvas>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-[320px] rounded-3xl bg-zinc-950/40 border border-zinc-800/50 p-6 text-center animate-pulse">
            <img src="./assets/ahmad.png" className="w-16 h-16 rounded-full mb-4 opacity-75" alt="Profile avatar" />
            <p className="text-sm font-semibold text-zinc-300">Interactive 3D Profile Lanyard</p>
            <p className="text-xs text-zinc-500 mt-1">Initializing 3D physics...</p>
          </div>
        )}
      </ErrorBoundary>
    </div>
  );
}

function Band({ maxSpeed = 50, minSpeed = 0 }) {
  const band = useRef(), fixed = useRef(), j1 = useRef(), j2 = useRef(), j3 = useRef(), card = useRef();
  const vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3();
  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 4, linearDamping: 4 };

  // Menggunakan data dari public
  const { nodes, materials } = useGLTF(cardGLB);
  const texture = useTexture(lanyard);

  const [curve] = useState(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.5, 0, 0),
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(1.5, 0, 0)
  ]));
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);
  const isSmall = typeof window !== 'undefined' && window.innerWidth < 1024;

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.50, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useEffect(() => {
    if (band.current?.geometry?.setPoints) {
      try {
        const initialPoints = curve.getPoints(32);
        if (initialPoints && initialPoints.length > 0) {
          band.current.geometry.setPoints(initialPoints);
        }
      } catch (err) {
        console.warn("Initial lanyard points warning:", err);
      }
    }
  }, [curve]);

  useFrame((state, delta) => {
    // Guard against large frame deltas (e.g. tab switch or backgrounding)
    const safeDelta = Math.min(Math.max(delta, 0.001), 0.033);

    const isValidVec = (v) =>
      v &&
      Number.isFinite(v.x) &&
      Number.isFinite(v.y) &&
      Number.isFinite(v.z) &&
      Math.abs(v.x) < 50 &&
      Math.abs(v.y) < 50 &&
      Math.abs(v.z) < 50;

    if (dragged && card.current) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp?.());
      if (
        Number.isFinite(vec.x) && Number.isFinite(vec.y) && Number.isFinite(vec.z) &&
        Number.isFinite(dragged.x) && Number.isFinite(dragged.y) && Number.isFinite(dragged.z)
      ) {
        card.current.setNextKinematicTranslation({
          x: vec.x - dragged.x,
          y: vec.y - dragged.y,
          z: vec.z - dragged.z
        });
      }
    }

    if (fixed.current && j1.current && j2.current && j3.current && card.current) {
      const fixedTrans = fixed.current.translation?.();
      const j1Trans = j1.current.translation?.();
      const j2Trans = j2.current.translation?.();
      const j3Trans = j3.current.translation?.();

      // Check for physics explosion / runaway values
      if (!isValidVec(j1Trans) || !isValidVec(j2Trans) || !isValidVec(j3Trans)) {
        // Recover physics bodies back to resting state
        j1.current.setTranslation?.({ x: 0.5, y: 0, z: 0 }, true);
        j2.current.setTranslation?.({ x: 1, y: 0, z: 0 }, true);
        j3.current.setTranslation?.({ x: 1.5, y: 0, z: 0 }, true);
        card.current.setTranslation?.({ x: 2, y: 0, z: 0 }, true);
        card.current.setLinvel?.({ x: 0, y: 0, z: 0 }, true);
        card.current.setAngvel?.({ x: 0, y: 0, z: 0 }, true);
        return;
      }

      // Smoothly lerp joints with strictly bounded alpha
      [
        { ref: j1, target: j1Trans },
        { ref: j2, target: j2Trans }
      ].forEach(({ ref, target }) => {
        if (!ref.current.lerped || !isValidVec(ref.current.lerped)) {
          ref.current.lerped = new THREE.Vector3(target.x, target.y, target.z);
        } else {
          const dist = ref.current.lerped.distanceTo(target);
          const clampedDistance = Math.max(0.1, Math.min(1, Number.isFinite(dist) ? dist : 0.1));
          const speed = minSpeed + clampedDistance * (maxSpeed - minSpeed);
          // Clamp alpha to [0, 1] to prevent exponential divergence
          const alpha = Math.min(1, Math.max(0, safeDelta * Math.min(speed, 25)));
          ref.current.lerped.lerp(target, alpha);
        }
      });

      const p0 = j3Trans;
      const p1 = j2.current.lerped;
      const p2 = j1.current.lerped;
      const p3 = fixedTrans;

      if (isValidVec(p0) && isValidVec(p1) && isValidVec(p2) && isValidVec(p3)) {
        curve.points[0].copy(p0);
        curve.points[1].copy(p1);
        curve.points[2].copy(p2);
        curve.points[3].copy(p3);

        const pts = curve.getPoints(32);
        if (pts && pts.length > 0 && pts.every(isValidVec)) {
          if (band.current?.geometry?.setPoints) {
            band.current.geometry.setPoints(pts);
          }
        }
      }

      const cardAng = card.current.angvel?.();
      const cardRot = card.current.rotation?.();
      if (cardAng && cardRot && isValidVec(cardAng) && Number.isFinite(cardRot.y)) {
        ang.copy(cardAng);
        rot.copy(cardRot);
        card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
      }
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group scale={2.25} position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)} onPointerOut={() => hover(false)}
            onPointerUp={(e) => (e.target.releasePointerCapture(e.pointerId), drag(false))}
            onPointerDown={(e) => {
              e.target.setPointerCapture(e.pointerId);
              const cardTrans = card.current?.translation?.();
              if (cardTrans && Number.isFinite(cardTrans.x) && Number.isFinite(cardTrans.y) && Number.isFinite(cardTrans.z)) {
                drag(new THREE.Vector3().copy(e.point).sub(vec.copy(cardTrans)));
              }
            }}>
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial map={materials.base.map} map-anisotropy={16} clearcoat={1} clearcoatRoughness={0.15} roughness={0.9} metalness={0.8} />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial color="white" depthTest={false} resolution={isSmall ? [1000, 2000] : [1000, 1000]} useMap map={texture} repeat={[-4, 1]} lineWidth={1} />
      </mesh>
    </>
  );
}
// Preload model agar tidak lag
useGLTF.preload(cardGLB);