import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Clean any previous canvas if re-mounted
    while (mount.firstChild) {
      mount.removeChild(mount.firstChild);
    }

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 25;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // 1. Particle Cosmos (1500 particles with cyber cyan & purple colors)
    const particleCount = 1400;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const cyanColor = new THREE.Color('#00f2fe');
    const purpleColor = new THREE.Color('#a855f7');
    const blueColor = new THREE.Color('#38bdf8');

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

      // Color distribution
      const rand = Math.random();
      const chosenColor = rand > 0.6 ? cyanColor : rand > 0.3 ? purpleColor : blueColor;
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);

    // 2. 3D Floating Cyber Icosahedron (Tech Core)
    const coreGeo = new THREE.IcosahedronGeometry(4.2, 1);
    const coreWireMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.28
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreWireMat);
    coreMesh.position.set(12, 2, -5);
    scene.add(coreMesh);

    // 3. Surrounding Torus Knot (AI Neural Ring)
    const ringGeo = new THREE.TorusGeometry(6.5, 0.08, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.35
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.set(12, 2, -5);
    ringMesh.rotation.x = Math.PI / 3;
    scene.add(ringMesh);

    // Mouse Tracking for Interactive Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Scroll Tracking for 3D Scrolling Animation
    let scrollY = window.scrollY;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Window Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationId;
    const startTime = performance.now();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Smooth mouse lerp
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // 3D Scrolling Camera Physics
      const scrollFactor = scrollY * 0.012;
      camera.position.y = -scrollFactor * 0.8 + targetY * 1.5;
      camera.position.x = targetX * 2;
      camera.rotation.z = Math.sin(scrollFactor * 0.05) * 0.08;

      // Gentle continuous rotation of particles
      particles.rotation.y = elapsedTime * 0.03 + scrollFactor * 0.04;
      particles.rotation.x = elapsedTime * 0.015;

      // Floating 3D Core Animation
      coreMesh.rotation.x = elapsedTime * 0.2 + scrollFactor * 0.1;
      coreMesh.rotation.y = elapsedTime * 0.25;
      ringMesh.rotation.z = elapsedTime * 0.15;
      ringMesh.rotation.y = -elapsedTime * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (mount && renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      try {
        geometry.dispose();
        particleMaterial.dispose();
        coreGeo.dispose();
        coreWireMat.dispose();
        ringGeo.dispose();
        ringMat.dispose();
        renderer.dispose();
      } catch (e) {
        // Safe disposal
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
    />
  );
}
