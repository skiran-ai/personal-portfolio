import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Universal ThreeCanvas with resilient WebGL detection and high-performance 2D fallback.
 * Ensures 100% crash-proof rendering on:
 * - Desktop Chrome, Firefox, Edge, Safari (Full 3D WebGL cosmos)
 * - Mobile Chrome, Safari iOS, Samsung Internet
 * - Opera Mini, low-power devices & browsers where WebGL is unsupported or disabled (Smooth 2D Canvas + CSS nebula)
 */
export default function ThreeCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Clean previous children
    while (mount.firstChild) {
      mount.removeChild(mount.firstChild);
    }

    // Helper: Test WebGL availability
    const isWebGLSupported = () => {
      try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      } catch (e) {
        return false;
      }
    };

    let cleanup = () => {};

    // ----------------------------------------------------
    // Fallback: Smooth 2D Canvas Starfield (for Opera Mini & non-WebGL devices)
    // ----------------------------------------------------
    const init2DFallback = () => {
      const canvas = document.createElement('canvas');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.display = 'block';
      mount.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const pCount = Math.min(160, Math.floor(window.innerWidth / 8));
      const particles = [];
      const colors = ['#00f2fe', '#a855f7', '#38bdf8', '#ffffff'];

      for (let i = 0; i < pCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.6 + 0.6,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          alpha: Math.random() * 0.6 + 0.2
        });
      }

      let animId;
      const render2D = () => {
        animId = requestAnimationFrame(render2D);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
        });
      };

      const handle2DResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      window.addEventListener('resize', handle2DResize);
      render2D();

      cleanup = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', handle2DResize);
        if (mount.contains(canvas)) mount.removeChild(canvas);
      };
    };

    // ----------------------------------------------------
    // Primary: 3D WebGL Particle Cosmos & Holographic Core
    // ----------------------------------------------------
    const initThreeJS = () => {
      try {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 25;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        mount.appendChild(renderer.domElement);

        // Particle Cosmos
        const particleCount = window.innerWidth < 768 ? 700 : 1400;
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

          const rand = Math.random();
          const chosenColor = rand > 0.6 ? cyanColor : rand > 0.3 ? purpleColor : blueColor;
          colors[i * 3] = chosenColor.r;
          colors[i * 3 + 1] = chosenColor.g;
          colors[i * 3 + 2] = chosenColor.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
          size: window.innerWidth < 768 ? 0.22 : 0.18,
          vertexColors: true,
          transparent: true,
          opacity: 0.75,
          blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(geometry, particleMaterial);
        scene.add(particles);

        // Floating Cyber Icosahedron
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

        // Surrounding Torus Ring
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

        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        const handleMouseMove = (e) => {
          mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
          mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        let scrollY = window.scrollY;
        const handleScroll = () => {
          scrollY = window.scrollY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });

        const handleResize = () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        let animationId;
        const startTime = performance.now();

        const animate = () => {
          animationId = requestAnimationFrame(animate);
          const elapsedTime = (performance.now() - startTime) * 0.001;

          targetX += (mouseX - targetX) * 0.05;
          targetY += (mouseY - targetY) * 0.05;

          const scrollFactor = scrollY * 0.012;
          camera.position.y = -scrollFactor * 0.8 + targetY * 1.5;
          camera.position.x = targetX * 2;
          camera.rotation.z = Math.sin(scrollFactor * 0.05) * 0.08;

          particles.rotation.y = elapsedTime * 0.03 + scrollFactor * 0.04;
          particles.rotation.x = elapsedTime * 0.015;

          coreMesh.rotation.x = elapsedTime * 0.2 + scrollFactor * 0.1;
          coreMesh.rotation.y = elapsedTime * 0.25;
          ringMesh.rotation.z = elapsedTime * 0.15;
          ringMesh.rotation.y = -elapsedTime * 0.1;

          renderer.render(scene, camera);
        };

        animate();

        cleanup = () => {
          cancelAnimationFrame(animationId);
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('scroll', handleScroll);
          window.removeEventListener('resize', handleResize);
          if (mount.contains(renderer.domElement)) {
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
            // Disposed
          }
        };
      } catch (err) {
        console.warn("WebGL initialization failed, switching to 2D canvas fallback:", err);
        init2DFallback();
      }
    };

    if (isWebGLSupported()) {
      initThreeJS();
    } else {
      init2DFallback();
    }

    return () => cleanup();
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
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 80% 20%, rgba(168, 85, 247, 0.12) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(0, 242, 254, 0.08) 0%, transparent 60%)'
      }}
    />
  );
}
