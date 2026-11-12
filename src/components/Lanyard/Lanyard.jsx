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
const cardBack = "/assets/card_back.png";

// Helper memuat gambar secara aman tanpa menodai (tainting) canvas WebGL
function loadSafeImage(url) {
  return new Promise((resolve) => {
    if (!url) return resolve(null);

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => resolve(img);
    img.onerror = () => {
      // Jika mode anonymous diblokir CORS langsung oleh server gambar,
      // coba ambil sebagai Blob via fetch untuk membuat blob: url lokal
      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error('Fetch failed');
          return res.blob();
        })
        .then((blob) => {
          const blobUrl = URL.createObjectURL(blob);
          const blobImg = new Image();
          blobImg.onload = () => resolve(blobImg);
          blobImg.onerror = () => {
            URL.revokeObjectURL(blobUrl);
            resolve(null);
          };
          blobImg.src = blobUrl;
        })
        .catch(() => {
          // Jika tetap gagal, kembalikan null agar canvas TIDAK ternodai (SecurityError)
          resolve(null);
        });
    };

    img.src = url;
  });
}

// Helper menggambar tekstur kartu ID 3D (1024x768)
// Sisi Kiri (0..512): Wajah Depan Kartu
// Sisi Kanan (512..1024): Sisi Belakang Kartu (Tech Stack)
function drawCardTexture(canvas, photoImg, name, backImg) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = 1024;
  const h = 768;

  // 1. Bersihkan seluruh canvas
  ctx.clearRect(0, 0, w, h);

  // 2. Sisi Belakang (x: 512..1024)
  if (backImg && backImg.width > 0) {
    ctx.drawImage(backImg, 512, 0, 512, 768);
  } else {
    // Background dasar sisi belakang jika gambar belum termuat
    ctx.fillStyle = '#0b0b12';
    ctx.fillRect(512, 0, 512, 768);

    // Grid aksen teknologi
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 540; x < 1000; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 768);
      ctx.stroke();
    }
  }

  // 3. Sisi Depan: Background Dark Gradient Utama (x: 0..425)
  const frontGrad = ctx.createLinearGradient(0, 0, 425, 768);
  frontGrad.addColorStop(0, '#0f0f18');
  frontGrad.addColorStop(0.5, '#151424');
  frontGrad.addColorStop(1, '#0c0c14');
  ctx.fillStyle = frontGrad;
  ctx.fillRect(0, 0, 425, 768);

  // Garis aksen grid halus di sisi depan
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
  ctx.lineWidth = 1;
  for (let y = 0; y < 768; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(425, y);
    ctx.stroke();
  }

  // 4. Sisi Depan: Pita Aksen Vertikal Kanan (x: 425..512)
  const stripGrad = ctx.createLinearGradient(425, 0, 512, 768);
  stripGrad.addColorStop(0, '#7c3aed');
  stripGrad.addColorStop(0.5, '#4f46e5');
  stripGrad.addColorStop(1, '#0e7490');
  ctx.fillStyle = stripGrad;
  ctx.fillRect(425, 0, 87, 768);

  // Garis pembatas bercahaya antara wajah kartu dan pita
  ctx.strokeStyle = '#a78bfa';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(425, 0);
  ctx.lineTo(425, 768);
  ctx.stroke();

  // Teks vertikal pada pita kanan
  ctx.save();
  ctx.translate(470, 720);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px sans-serif';
  ctx.fillText('PORTFOLIO 2026', 0, 0);
  ctx.restore();

  // 5. Header Badge: "PORTFOLIO ID"
  ctx.fillStyle = 'rgba(139, 92, 246, 0.18)';
  ctx.fillRect(40, 42, 165, 30);
  ctx.strokeStyle = 'rgba(139, 92, 246, 0.55)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(40, 42, 165, 30);

  // Titik status hijau pada badge
  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(56, 57, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '600 13px sans-serif';
  ctx.fillText('PORTFOLIO ID', 70, 62);

  // 6. Frame Foto Profil (x: 40, y: 88, w: 345, h: 390)
  const frameX = 40;
  const frameY = 88;
  const frameW = 345;
  const frameH = 390;
  const radius = 22;

  // Path frame foto dengan sudut membulat
  const makeRoundedRect = () => {
    ctx.beginPath();
    ctx.moveTo(frameX + radius, frameY);
    ctx.lineTo(frameX + frameW - radius, frameY);
    ctx.quadraticCurveTo(frameX + frameW, frameY, frameX + frameW, frameY + radius);
    ctx.lineTo(frameX + frameW, frameY + frameH - radius);
    ctx.quadraticCurveTo(frameX + frameW, frameY + frameH, frameX + frameW - radius, frameY + frameH);
    ctx.lineTo(frameX + radius, frameY + frameH);
    ctx.quadraticCurveTo(frameX, frameY + frameH, frameX, frameY + frameH - radius);
    ctx.lineTo(frameX, frameY + radius);
    ctx.quadraticCurveTo(frameX, frameY, frameX + radius, frameY);
    ctx.closePath();
  };

  if (photoImg && photoImg.width > 0) {
    ctx.save();
    makeRoundedRect();
    ctx.clip();

    // Gambar foto secara aspect-ratio cover
    const imgAspect = photoImg.width / photoImg.height;
    const frameAspect = frameW / frameH;
    let dw, dh, dx, dy;
    if (imgAspect > frameAspect) {
      dh = frameH;
      dw = frameH * imgAspect;
      dx = frameX + (frameW - dw) / 2;
      dy = frameY;
    } else {
      dw = frameW;
      dh = frameW / imgAspect;
      dx = frameX;
      dy = frameY + (frameH - dh) / 2;
    }
    ctx.drawImage(photoImg, dx, dy, dw, dh);

    // Vignette halus di bagian bawah foto
    const vig = ctx.createLinearGradient(0, frameY + frameH - 100, 0, frameY + frameH);
    vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vig.addColorStop(1, 'rgba(12, 12, 20, 0.7)');
    ctx.fillStyle = vig;
    ctx.fillRect(frameX, frameY + frameH - 100, frameW, 100);

    ctx.restore();

    // Border bingkai foto profil
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 3;
    makeRoundedRect();
    ctx.stroke();
  } else {
    // Fallback bersih saat foto kosong/sedang dimuat: placeholder modern berwarna solid elegan
    ctx.save();
    makeRoundedRect();
    ctx.clip();

    const phGrad = ctx.createLinearGradient(frameX, frameY, frameX + frameW, frameY + frameH);
    phGrad.addColorStop(0, '#1e1b4b');
    phGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = phGrad;
    ctx.fillRect(frameX, frameY, frameW, frameH);

    // Initial avatar besar
    const initial = (name && name.trim()) ? name.trim().charAt(0).toUpperCase() : 'F';
    ctx.fillStyle = '#a78bfa';
    ctx.font = 'bold 120px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initial, frameX + frameW / 2, frameY + frameH / 2 - 20);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 18px monospace';
    ctx.fillText('DEVELOPER', frameX + frameW / 2, frameY + frameH / 2 + 65);

    ctx.restore();

    // Border placeholder
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
    ctx.lineWidth = 2.5;
    makeRoundedRect();
    ctx.stroke();
  }

  // 7. Nama Dinamis Pengguna
  const rawName = (name && name.trim()) ? name.trim() : 'FAJAR';
  const displayName = rawName.toUpperCase();

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.font = displayName.length > 14 ? 'bold 30px sans-serif' : 'bold 38px sans-serif';
  ctx.fillText(displayName, 42, 528);

  // 8. Role Subtitle (Cyan Glowing Theme)
  ctx.fillStyle = '#38bdf8';
  ctx.font = '600 20px monospace';
  ctx.fillText('WEB DEVELOPER', 42, 568);

  // 9. Status Aktif
  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(50, 612, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '500 15px sans-serif';
  ctx.fillText('ONLINE • ACTIVE', 66, 617);

  // 10. Security ID / Bottom Decorative
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.font = '13px monospace';
  const idCode = (rawName.substring(0, 4) + '-DEV-2026').toUpperCase();
  ctx.fillText(`ID: ${idCode}`, 42, 690);

  // Barcode dekoratif halus di kanan bawah
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  const bars = [3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 2, 4, 2, 1, 3];
  let barX = 260;
  for (const b of bars) {
    ctx.fillRect(barX, 675, b, 20);
    barX += b + 3;
  }
}

// Inisialisasi awal Rapier Physics Engine secara eager agar instan saat toggle
let rapierInitPromise = null;
const initRapier = () => {
  if (!rapierInitPromise) {
    rapierInitPromise = import('@dimforge/rapier3d-compat')
      .then((m) => {
        const rapier = m.default || m;
        return typeof rapier.init === 'function' ? rapier.init() : rapier;
      })
      .catch((err) => {
        console.error("Rapier preload error:", err);
      });
  }
  return rapierInitPromise;
};

// Eager preload saat aplikasi pertama kali dimuat
if (typeof window !== 'undefined') {
  initRapier();
}

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
          {this.props.avatarUrl ? (
            <img src={this.props.avatarUrl} className="w-16 h-16 rounded-full mb-4 opacity-50 filter grayscale object-cover" alt="Profile avatar placeholder" />
          ) : (
            <div className="w-16 h-16 rounded-full mb-4 bg-zinc-800 border border-zinc-700/50 flex items-center justify-center text-zinc-400 font-bold text-xl">
              {this.props.name ? this.props.name.charAt(0).toUpperCase() : ""}
            </div>
          )}
          <p className="text-sm font-semibold text-zinc-400">Interactive 3D Profile Lanyard</p>
          <p className="text-xs text-zinc-600 mt-1">WebGL is disabled or currently unavailable</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  avatarUrl = "",
  name = "",
}) {
  const [physicsReady, setPhysicsReady] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
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
    initRapier().then(() => {
      if (active) {
        setPhysicsReady(true);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="lanyard-wrapper" ref={wrapperRef}>
      <ErrorBoundary avatarUrl={avatarUrl} name={name}>
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
                <Band avatarUrl={avatarUrl} name={name} />
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
            {avatarUrl ? (
              <img src={avatarUrl} className="w-16 h-16 rounded-full mb-4 opacity-75 object-cover" alt="Profile avatar" />
            ) : (
              <div className="w-16 h-16 rounded-full mb-4 bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-300 font-bold text-xl">
                {name ? name.charAt(0).toUpperCase() : ""}
              </div>
            )}
            <p className="text-sm font-semibold text-zinc-300">
              {name ? `${name}'s 3D ID Card` : "Interactive 3D Profile Lanyard"}
            </p>
            <p className="text-xs text-zinc-500 mt-1">Initializing 3D physics...</p>
          </div>
        )}
      </ErrorBoundary>
    </div>
  );
}

function Band({ maxSpeed = 50, minSpeed = 0, avatarUrl = "", name = "" }) {
  const band = useRef(), fixed = useRef(), j1 = useRef(), j2 = useRef(), j3 = useRef(), card = useRef();
  const vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3();
  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 4, linearDamping: 4 };

  // Menggunakan data dari public
  const { nodes, materials } = useGLTF(cardGLB);
  const texture = useTexture(lanyard);

  const canvasRef = useRef(null);
  const textureRef = useRef(null);
  const materialRef = useRef(null);
  const backImgRef = useRef(null);
  const currentPhotoRef = useRef(null);

  // Inisialisasi tekstur dinamis kartu secara persisten dan sinkron
  // agar kartu TIDAK PERNAH tampil hitam bahkan sebelum gambar API selesai dimuat
  const cardTexture = React.useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 768;
    canvasRef.current = canvas;

    // Gambar layout awal kartu seketika
    drawCardTexture(canvas, null, name, null);

    const tex = new THREE.CanvasTexture(canvas);
    tex.flipY = false;
    tex.anisotropy = 16;
    tex.needsUpdate = true;
    textureRef.current = tex;
    return tex;
  }, []);

  // Muat gambar sisi belakang kartu (ikon teknologi)
  useEffect(() => {
    const back = new Image();
    back.onload = () => {
      backImgRef.current = back;
      if (canvasRef.current && textureRef.current) {
        drawCardTexture(canvasRef.current, currentPhotoRef.current, name, back);
        textureRef.current.needsUpdate = true;
        if (materialRef.current) materialRef.current.needsUpdate = true;
      }
    };
    back.src = cardBack;
  }, [name]);

  // Melukis foto dan nama dinamis dari API secara reaktif
  useEffect(() => {
    let isCancelled = false;

    // Render ulang teks / initial kartu seketika saat prop name berubah
    if (canvasRef.current && textureRef.current) {
      drawCardTexture(canvasRef.current, currentPhotoRef.current, name, backImgRef.current);
      textureRef.current.needsUpdate = true;
      if (materialRef.current) materialRef.current.needsUpdate = true;
    }

    if (avatarUrl) {
      loadSafeImage(avatarUrl).then((loadedImg) => {
        if (isCancelled) return;
        currentPhotoRef.current = loadedImg;
        if (canvasRef.current && textureRef.current) {
          drawCardTexture(canvasRef.current, loadedImg, name, backImgRef.current);
          textureRef.current.needsUpdate = true;
          if (materialRef.current) materialRef.current.needsUpdate = true;
        }
      });
    } else {
      currentPhotoRef.current = null;
      if (canvasRef.current && textureRef.current) {
        drawCardTexture(canvasRef.current, null, name, backImgRef.current);
        textureRef.current.needsUpdate = true;
        if (materialRef.current) materialRef.current.needsUpdate = true;
      }
    }

    return () => {
      isCancelled = true;
    };
  }, [avatarUrl, name]);

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
              <meshPhysicalMaterial
                ref={materialRef}
                map={cardTexture || materials.base.map}
                map-anisotropy={16}
                clearcoat={1.0}
                clearcoatRoughness={0.12}
                roughness={0.25}
                metalness={0.05}
              />
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