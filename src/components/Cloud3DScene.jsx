import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Move3d } from 'lucide-react';

export default function Cloud3DScene() {
  const containerRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();

    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.25, 4.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xbae6fd, 1.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 2.5);
    sunLight.position.set(4, 5, 4);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const skyFill = new THREE.DirectionalLight(0x38bdf8, 1.8);
    skyFill.position.set(-4, -2, -2);
    scene.add(skyFill);

    const warmUnderGlow = new THREE.PointLight(0xfce7f3, 0.9, 10);
    warmUnderGlow.position.set(0, -1.5, 2);
    scene.add(warmUnderGlow);

    // --- Cloud Group ---
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    const cloudGroup = new THREE.Group();
    mainGroup.add(cloudGroup);

    // Fluffy White Cloud Material
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.5,
      metalness: 0.05,
    });

    // Cloud Puff Spheres (Carefully balanced for a cute, cuddly silhouette)
    const puffs = [
      { r: 0.76, x: 0, y: 0.02, z: 0 },
      { r: 0.62, x: -0.7, y: -0.06, z: 0.05 },
      { r: 0.62, x: 0.7, y: -0.06, z: 0.05 },
      { r: 0.46, x: -1.18, y: -0.22, z: 0 },
      { r: 0.46, x: 1.18, y: -0.22, z: 0 },
      { r: 0.54, x: -0.38, y: 0.45, z: -0.05 },
      { r: 0.54, x: 0.38, y: 0.45, z: -0.05 },
      { r: 0.42, x: 0, y: -0.32, z: 0.2 }, // bottom support
    ];

    puffs.forEach((p) => {
      const geo = new THREE.SphereGeometry(p.r, 32, 32);
      const mesh = new THREE.Mesh(geo, cloudMat);
      mesh.position.set(p.x, p.y, p.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      cloudGroup.add(mesh);
    });

    // --- Cute Kawaii Happy Face ---
    const faceGroup = new THREE.Group();
    cloudGroup.add(faceGroup);

    // 1. Happy Big Smile (Torus curve opening upward like ◡)
    const smileGeo = new THREE.TorusGeometry(0.13, 0.024, 16, 32, Math.PI);
    const darkFeatureMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });
    const smile = new THREE.Mesh(smileGeo, darkFeatureMat);
    // Rotate so arc points down and opening is up
    smile.rotation.z = Math.PI;
    smile.position.set(0, -0.08, 0.74);
    faceGroup.add(smile);

    // 2. Cute Happy Eyes with Highlights
    const eyeGeo = new THREE.SphereGeometry(0.065, 24, 24);
    const leftEye = new THREE.Mesh(eyeGeo, darkFeatureMat);
    leftEye.position.set(-0.28, 0.08, 0.72);
    faceGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, darkFeatureMat);
    rightEye.position.set(0.28, 0.08, 0.72);
    faceGroup.add(rightEye);

    // Twinkling white specular dots in eyes
    const shineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const shineGeo = new THREE.SphereGeometry(0.022, 16, 16);

    const leftShine = new THREE.Mesh(shineGeo, shineMat);
    leftShine.position.set(-0.26, 0.1, 0.78);
    faceGroup.add(leftShine);

    const rightShine = new THREE.Mesh(shineGeo, shineMat);
    rightShine.position.set(0.3, 0.1, 0.78);
    faceGroup.add(rightShine);

    // 3. Cute Blushing Rosy Cheeks
    const cheekMat = new THREE.MeshStandardMaterial({
      color: 0xfb7185,
      roughness: 0.3,
      emissive: 0xfb7185,
      emissiveIntensity: 0.35,
    });
    const cheekGeo = new THREE.SphereGeometry(0.12, 24, 24);

    const leftCheek = new THREE.Mesh(cheekGeo, cheekMat);
    leftCheek.position.set(-0.52, -0.06, 0.58);
    leftCheek.scale.set(1, 0.65, 0.35);
    faceGroup.add(leftCheek);

    const rightCheek = new THREE.Mesh(cheekGeo, cheekMat);
    rightCheek.position.set(0.52, -0.06, 0.58);
    rightCheek.scale.set(1, 0.65, 0.35);
    faceGroup.add(rightCheek);

    // --- Heart on Top (Right Side Up with lobes at top and tip at bottom) ---
    const heartShape = new THREE.Shape();
    // Tip at bottom (0, -0.4)
    heartShape.moveTo(0, -0.38);
    // Curve up left
    heartShape.bezierCurveTo(-0.48, -0.1, -0.48, 0.34, -0.24, 0.44);
    // Dip at top center
    heartShape.bezierCurveTo(-0.08, 0.44, 0, 0.28, 0, 0.2);
    // Curve up right
    heartShape.bezierCurveTo(0, 0.28, 0.08, 0.44, 0.24, 0.44);
    // Curve down to bottom tip
    heartShape.bezierCurveTo(0.48, 0.34, 0.48, -0.1, 0, -0.38);

    const extrudeSettings = {
      depth: 0.12,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    };
    const heartGeo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    heartGeo.center();

    const heartMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      roughness: 0.25,
      metalness: 0.15,
      emissive: 0xf43f5e,
      emissiveIntensity: 0.35,
    });
    const floatingHeart = new THREE.Mesh(heartGeo, heartMat);
    floatingHeart.position.set(0, 1.12, 0.05);
    floatingHeart.scale.set(0.4, 0.4, 0.4);
    cloudGroup.add(floatingHeart);

    // --- Floating Golden / Pastel Stars & Sparkles (NO RAIN!) ---
    const sparklesCount = 12;
    const sparkles = [];
    const sparkleGeo = new THREE.OctahedronGeometry(0.08, 0);
    const sparkleMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      roughness: 0.2,
      emissive: 0xfbbf24,
      emissiveIntensity: 0.6,
    });

    for (let i = 0; i < sparklesCount; i++) {
      const sp = new THREE.Mesh(sparkleGeo, sparkleMat);
      const angle = (i / sparklesCount) * Math.PI * 2;
      const radius = 1.6 + Math.random() * 0.7;
      sp.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 1.6,
        Math.sin(angle) * radius * 0.5
      );
      sp.scale.setScalar(0.7 + Math.random() * 0.8);
      sp.userData = {
        speed: 0.8 + Math.random() * 1.2,
        offset: Math.random() * Math.PI * 2,
        baseY: sp.position.y,
      };
      mainGroup.add(sp);
      sparkles.push(sp);
    }

    // --- Touch & Mouse Rotation Interaction ---
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;
    let autoRotateVelocity = 0.005;

    const onPointerDown = (e) => {
      isDragging = true;
      setIsInteracting(true);
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;

      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.005;

      // Clamp vertical tilt
      targetRotationX = Math.max(-0.3, Math.min(0.3, targetRotationX));

      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
      setIsInteracting(false);
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // --- Resize Handler ---
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // --- Animation Loop ---
    let clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Cloud gentle bobbing (floating breath effect)
      cloudGroup.position.y = Math.sin(elapsedTime * 1.8) * 0.08;

      // Heart gentle heartbeat pulse and floating
      const heartPulse = 1 + Math.sin(elapsedTime * 4.5) * 0.07;
      floatingHeart.scale.set(0.4 * heartPulse, 0.4 * heartPulse, 0.4 * heartPulse);
      floatingHeart.position.y = 1.12 + Math.sin(elapsedTime * 2.2) * 0.05;
      floatingHeart.rotation.y = Math.sin(elapsedTime * 1.5) * 0.3;

      // Gentle auto-rotation when user isn't dragging
      if (!isDragging) {
        targetRotationY += autoRotateVelocity;
      }

      // Smooth damping / inertia
      mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.08;
      mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.08;

      // Twinkling floating stars
      sparkles.forEach((sp) => {
        sp.rotation.x += 0.02 * sp.userData.speed;
        sp.rotation.y += 0.03 * sp.userData.speed;
        sp.position.y = sp.userData.baseY + Math.sin(elapsedTime * sp.userData.speed + sp.userData.offset) * 0.15;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      dom.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[320px] sm:h-[380px] flex items-center justify-center select-none cursor-grab active:cursor-grabbing">
      {/* 3D Canvas Container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Touch instruction badge */}
      <div className={`absolute bottom-2 inset-x-0 flex justify-center pointer-events-none transition-opacity duration-300 ${isInteracting ? 'opacity-0' : 'opacity-80'}`}>
        <span className="glass-pill px-3 py-1 rounded-full text-[11px] font-semibold text-sky-800 flex items-center gap-1.5 shadow-sm">
          <Move3d className="w-3.5 h-3.5 text-sky-600" />
          <span>Gira la nubecita con tu dedo</span>
        </span>
      </div>
    </div>
  );
}
