import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function Python3DLogo() {
  const mountRef = useRef(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    // WebGL support verification
    const isWebGLSupported = () => {
      try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      } catch (e) {
        return false;
      }
    };

    if (!isWebGLSupported()) {
      setHasWebGL(false);
      return;
    }

    const mount = mountRef.current;
    if (!mount) return;

    while (mount.firstChild) {
      mount.removeChild(mount.firstChild);
    }

    const width = mount.clientWidth || 220;
    const height = mount.clientHeight || 220;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'default' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      mount.appendChild(renderer.domElement);
    } catch (err) {
      console.warn("WebGL not supported for Python 3D Logo, rendering vector fallback:", err);
      setHasWebGL(false);
      return;
    }

    // Scene, Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 7.5;

    // Group for the entire Python 3D emblem
    const pythonGroup = new THREE.Group();

    // Helper to create snake shape
    const createSnakeShape = () => {
      const s = new THREE.Shape();
      s.moveTo(-0.2, 0.2);
      s.lineTo(-0.2, 1.2);
      s.quadraticCurveTo(-0.2, 1.8, 0.4, 1.8);
      s.lineTo(1.1, 1.8);
      s.quadraticCurveTo(1.7, 1.8, 1.7, 1.2);
      s.lineTo(1.7, 0.6);
      s.quadraticCurveTo(1.7, 0.0, 1.1, 0.0);
      s.lineTo(0.6, 0.0);
      s.lineTo(0.6, -0.5);
      s.quadraticCurveTo(0.6, -0.9, 0.2, -0.9);
      s.lineTo(-0.5, -0.9);
      s.quadraticCurveTo(-0.9, -0.9, -0.9, -0.5);
      s.lineTo(-0.9, -0.2);
      s.quadraticCurveTo(-0.9, 0.2, -0.2, 0.2);
      return s;
    };

    const extrudeSettings = {
      depth: 0.4,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 2,
      bevelSize: 0.1,
      bevelThickness: 0.1
    };

    const snakeGeo = new THREE.ExtrudeGeometry(createSnakeShape(), extrudeSettings);
    snakeGeo.center();

    // Top Snake (Python Blue / Cyan)
    const blueMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.65,
      roughness: 0.2,
      emissive: 0x0284c7,
      emissiveIntensity: 0.35
    });
    const blueSnake = new THREE.Mesh(snakeGeo, blueMat);
    blueSnake.position.set(-0.25, 0.25, 0);

    // Eye 1 (Blue Snake Eye)
    const eyeGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const eyeMat1 = new THREE.MeshBasicMaterial({ color: 0x00f2fe });
    const eye1 = new THREE.Mesh(eyeGeo, eyeMat1);
    eye1.position.set(0.65, 0.95, 0.28);
    blueSnake.add(eye1);

    // Bottom Snake (Python Yellow / Amber)
    const yellowMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      metalness: 0.65,
      roughness: 0.2,
      emissive: 0xd97706,
      emissiveIntensity: 0.35
    });
    const yellowSnake = new THREE.Mesh(snakeGeo, yellowMat);
    yellowSnake.rotation.z = Math.PI;
    yellowSnake.position.set(0.25, -0.25, 0);

    // Eye 2 (Yellow Snake Eye)
    const eyeMat2 = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const eye2 = new THREE.Mesh(eyeGeo, eyeMat2);
    eye2.position.set(0.65, 0.95, 0.28);
    yellowSnake.add(eye2);

    pythonGroup.add(blueSnake);
    pythonGroup.add(yellowSnake);

    // Outer Orbiting Cyber Ring
    const orbitGeo = new THREE.TorusGeometry(2.3, 0.03, 16, 80);
    const orbitMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.45,
      wireframe: false
    });
    const orbitRing = new THREE.Mesh(orbitGeo, orbitMat);
    orbitRing.rotation.x = Math.PI / 2.8;
    pythonGroup.add(orbitRing);

    // Orbiting Golden Ring
    const orbitGeo2 = new THREE.TorusGeometry(2.5, 0.02, 16, 80);
    const orbitMat2 = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.35
    });
    const orbitRing2 = new THREE.Mesh(orbitGeo2, orbitMat2);
    orbitRing2.rotation.y = Math.PI / 3;
    pythonGroup.add(orbitRing2);

    // Floating particles around Python symbol
    const pCount = 35;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const radius = 2.0 + Math.random() * 1.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      pPositions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      pPositions[i * 3 + 1] = radius * Math.sin(phi);
      pPositions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.08,
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.8
    });
    const pCloud = new THREE.Points(pGeo, pMat);
    pythonGroup.add(pCloud);

    scene.add(pythonGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const blueLight = new THREE.PointLight(0x00f2fe, 3.5, 15);
    blueLight.position.set(-3, 3, 4);
    scene.add(blueLight);

    const goldLight = new THREE.PointLight(0xf59e0b, 3.5, 15);
    goldLight.position.set(3, -3, 4);
    scene.add(goldLight);

    const frontLight = new THREE.DirectionalLight(0xffffff, 1.8);
    frontLight.position.set(0, 2, 5);
    scene.add(frontLight);

    // Mouse tracking for tilt
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const onMouseMove = (e) => {
      const rect = mount.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetRotY = x * 0.8;
      targetRotX = -y * 0.8;
    };
    mount.addEventListener('mousemove', onMouseMove);

    const onMouseLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
    };
    mount.addEventListener('mouseleave', onMouseLeave);

    // Animation Loop
    let animationId;
    const startTime = performance.now();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) * 0.001;

      pythonGroup.rotation.y += (targetRotY - pythonGroup.rotation.y) * 0.08;
      pythonGroup.rotation.x += (targetRotX - pythonGroup.rotation.x) * 0.08;

      blueSnake.position.y = 0.25 + Math.sin(elapsed * 2) * 0.04;
      yellowSnake.position.y = -0.25 - Math.sin(elapsed * 2) * 0.04;

      orbitRing.rotation.z = elapsed * 0.6;
      orbitRing2.rotation.x = -elapsed * 0.5;
      pCloud.rotation.y = elapsed * 0.2;

      pythonGroup.rotation.y += 0.008;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      mount.removeEventListener('mousemove', onMouseMove);
      mount.removeEventListener('mouseleave', onMouseLeave);
      if (mount && renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      try {
        snakeGeo.dispose();
        blueMat.dispose();
        yellowMat.dispose();
        eyeGeo.dispose();
        eyeMat1.dispose();
        eyeMat2.dispose();
        orbitGeo.dispose();
        orbitMat.dispose();
        orbitGeo2.dispose();
        orbitMat2.dispose();
        pGeo.dispose();
        pMat.dispose();
        renderer.dispose();
      } catch (e) {
        // Disposed
      }
    };
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {hasWebGL ? (
        <div
          ref={mountRef}
          style={{
            width: '200px',
            height: '200px',
            cursor: 'grab',
            position: 'relative'
          }}
          title="Interactive 3D Python Core - Drag or hover to rotate"
        />
      ) : (
        /* Fallback: Ultra-crisp glowing vector emblem for Opera Mini & non-WebGL browsers */
        <div
          style={{
            width: '200px',
            height: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            animation: 'floatAnimation 5s ease-in-out infinite'
          }}
          title="Python Core Emblem"
        >
          {/* Glowing Aura Rings */}
          <div
            style={{
              position: 'absolute',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              border: '2px dashed rgba(0, 242, 254, 0.4)',
              animation: 'spin 20s linear infinite'
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              border: '1px solid rgba(245, 158, 11, 0.35)'
            }}
          />
          {/* Python SVG Symbol */}
          <svg width="110" height="110" viewBox="0 0 128 128" fill="none">
            <defs>
              <linearGradient id="pyBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
              <linearGradient id="pyYellow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {/* Blue Snake */}
            <path
              d="M63.5 12c-27.4 0-25.7 11.9-25.7 11.9l.03 12.3h26.2v3.7H27.5C15.6 39.9 5 53.6 5 66.8c0 14.8 10.4 24.2 24.2 24.2h8.2v-11.4c0-13.8 11.9-13.8 11.9-13.8h26.1c11.4 0 11.4-11 11.4-11V23.9c0-11.9-11.4-11.9-23.3-11.9zm-13.7 7.4c2.5 0 4.5 2 4.5 4.5s-2 4.5-4.5 4.5-4.5-2-4.5-4.5 2-4.5 4.5-4.5z"
              fill="url(#pyBlue)"
              filter="url(#glow)"
            />
            {/* Yellow Snake */}
            <path
              d="M64.5 116c27.4 0 25.7-11.9 25.7-11.9l-.03-12.3H64v-3.7h36.5c11.9 0 22.5-13.7 22.5-26.9 0-14.8-10.4-24.2-24.2-24.2h-8.2v11.4c0 13.8-11.9 13.8-11.9 13.8H52.6c-11.4 0-11.4 11-11.4 11v30.9c0 11.9 11.4 11.9 23.3 11.9zm13.7-7.4c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5-2 4.5-4.5 4.5z"
              fill="url(#pyYellow)"
              filter="url(#glow)"
            />
          </svg>
        </div>
      )}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(0, 242, 254, 0.3)',
          marginTop: '-6px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
        }}
      >
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }}></span>
        <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#f8fafc', letterSpacing: '0.04em' }}>
          PYTHON 3D CORE
        </span>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fbbf24', boxShadow: '0 0 8px #fbbf24' }}></span>
      </div>
    </div>
  );
}
