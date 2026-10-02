import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Python3DLogo() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    while (mount.firstChild) {
      mount.removeChild(mount.firstChild);
    }

    const width = mount.clientWidth || 220;
    const height = mount.clientHeight || 220;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 7.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Group for the entire Python 3D emblem
    const pythonGroup = new THREE.Group();

    // Helper to create snake shape
    const createSnakeShape = () => {
      const s = new THREE.Shape();
      // Outer contour of one Python snake half
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
    const pCount = 45;
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

      // Smooth mouse lerp
      pythonGroup.rotation.y += (targetRotY - pythonGroup.rotation.y) * 0.08;
      pythonGroup.rotation.x += (targetRotX - pythonGroup.rotation.x) * 0.08;

      // Continuous 3D rotation & hover levitation
      blueSnake.position.y = 0.25 + Math.sin(elapsed * 2) * 0.04;
      yellowSnake.position.y = -0.25 - Math.sin(elapsed * 2) * 0.04;

      orbitRing.rotation.z = elapsed * 0.6;
      orbitRing2.rotation.x = -elapsed * 0.5;
      pCloud.rotation.y = elapsed * 0.2;

      // Subtle base rotation
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
