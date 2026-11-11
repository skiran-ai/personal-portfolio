import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

function checkWebGLSupport() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

export default function Python3DLogo() {
  const mountRef = useRef(null);
  const [hasWebGL, setHasWebGL] = useState(() =>
    typeof window !== 'undefined' ? checkWebGLSupport() : true
  );

  useEffect(() => {
    if (!hasWebGL) return;

    const mount = mountRef.current;
    if (!mount) return;

    while (mount.firstChild) {
      mount.removeChild(mount.firstChild);
    }

    const width = mount.clientWidth || 120;
    const height = mount.clientHeight || 120;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'default' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.display = 'block';
      mount.appendChild(renderer.domElement);
    } catch {
      setHasWebGL(false);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 7.6;

    const pythonGroup = new THREE.Group();

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

    const snakeGeo = new THREE.ExtrudeGeometry(createSnakeShape(), {
      depth: 0.4,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 2,
      bevelSize: 0.1,
      bevelThickness: 0.1,
    });
    snakeGeo.center();

    const blueMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.65,
      roughness: 0.22,
      emissive: 0x0284c7,
      emissiveIntensity: 0.3,
    });
    const blueSnake = new THREE.Mesh(snakeGeo, blueMat);
    blueSnake.position.set(-0.25, 0.25, 0);

    const eyeGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const eyeMat1 = new THREE.MeshBasicMaterial({ color: 0x22d3ee });
    const eye1 = new THREE.Mesh(eyeGeo, eyeMat1);
    eye1.position.set(0.65, 0.95, 0.28);
    blueSnake.add(eye1);

    const yellowMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      metalness: 0.65,
      roughness: 0.22,
      emissive: 0xd97706,
      emissiveIntensity: 0.3,
    });
    const yellowSnake = new THREE.Mesh(snakeGeo, yellowMat);
    yellowSnake.rotation.z = Math.PI;
    yellowSnake.position.set(0.25, -0.25, 0);

    const eyeMat2 = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const eye2 = new THREE.Mesh(eyeGeo, eyeMat2);
    eye2.position.set(0.65, 0.95, 0.28);
    yellowSnake.add(eye2);

    pythonGroup.add(blueSnake);
    pythonGroup.add(yellowSnake);

    const orbitGeo = new THREE.TorusGeometry(2.3, 0.03, 16, 72);
    const orbitMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.45 });
    const orbitRing = new THREE.Mesh(orbitGeo, orbitMat);
    orbitRing.rotation.x = Math.PI / 2.8;
    pythonGroup.add(orbitRing);

    const orbitGeo2 = new THREE.TorusGeometry(2.5, 0.02, 16, 72);
    const orbitMat2 = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.35 });
    const orbitRing2 = new THREE.Mesh(orbitGeo2, orbitMat2);
    orbitRing2.rotation.y = Math.PI / 3;
    pythonGroup.add(orbitRing2);

    scene.add(pythonGroup);

    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const blueLight = new THREE.PointLight(0x22d3ee, 3.2, 15);
    blueLight.position.set(-3, 3, 4);
    scene.add(blueLight);
    const goldLight = new THREE.PointLight(0xf59e0b, 3.2, 15);
    goldLight.position.set(3, -3, 4);
    scene.add(goldLight);

    let targetRotX = 0;
    let targetRotY = 0;

    const onMouseMove = (e) => {
      const rect = mount.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetRotY = x * 0.8;
      targetRotX = -y * 0.8;
    };
    const onMouseLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
    };
    mount.addEventListener('mousemove', onMouseMove);
    mount.addEventListener('mouseleave', onMouseLeave);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(64, Math.floor(entry.contentRect.width));
        const h = Math.max(64, Math.floor(entry.contentRect.height));
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      }
    });
    resizeObserver.observe(mount);

    let animationId;
    const startTime = performance.now();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (document.hidden) return;
      const elapsed = (performance.now() - startTime) * 0.001;

      pythonGroup.rotation.y += (targetRotY - pythonGroup.rotation.y) * 0.08 + 0.008;
      pythonGroup.rotation.x += (targetRotX - pythonGroup.rotation.x) * 0.08;
      blueSnake.position.y = 0.25 + Math.sin(elapsed * 2) * 0.04;
      yellowSnake.position.y = -0.25 - Math.sin(elapsed * 2) * 0.04;
      orbitRing.rotation.z = elapsed * 0.6;
      orbitRing2.rotation.x = -elapsed * 0.5;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
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
        renderer.dispose();
      } catch {
        // Disposed
      }
    };
  }, [hasWebGL]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {hasWebGL ? (
        <div
          ref={mountRef}
          style={{ width: '100%', height: '100%', cursor: 'grab' }}
          title="Interactive 3D Python Core"
        />
      ) : (
        <svg viewBox="0 0 128 128" style={{ width: '80%', height: '80%' }} fill="none">
          <path d="M63.5 12c-27.4 0-25.7 11.9-25.7 11.9l.03 12.3h26.2v3.7H27.5C15.6 39.9 5 53.6 5 66.8c0 14.8 10.4 24.2 24.2 24.2h8.2v-11.4c0-13.8 11.9-13.8 11.9-13.8h26.1c11.4 0 11.4-11 11.4-11V23.9c0-11.9-11.4-11.9-23.3-11.9zm-13.7 7.4c2.5 0 4.5 2 4.5 4.5s-2 4.5-4.5 4.5-4.5-2-4.5-4.5 2-4.5 4.5-4.5z" fill="#38bdf8" />
          <path d="M64.5 116c27.4 0 25.7-11.9 25.7-11.9l-.03-12.3H64v-3.7h36.5c11.9 0 22.5-13.7 22.5-26.9 0-14.8-10.4-24.2-24.2-24.2h-8.2v11.4c0 13.8-11.9 13.8-11.9 13.8H52.6c-11.4 0-11.4 11-11.4 11v30.9c0 11.9 11.4 11.9 23.3 11.9zm13.7-7.4c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5-2 4.5-4.5 4.5z" fill="#fbbf24" />
        </svg>
      )}
    </div>
  );
}
