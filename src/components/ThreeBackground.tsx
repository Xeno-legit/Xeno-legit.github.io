import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Scene setup ──
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 300;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // ── Stars ──
    const STAR_COUNT = 2500;
    const positions = new Float32Array(STAR_COUNT * 3);
    const sizes = new Float32Array(STAR_COUNT);
    const twinklePhases = new Float32Array(STAR_COUNT);
    const twinkleSpeeds = new Float32Array(STAR_COUNT);

    for (let i = 0; i < STAR_COUNT; i++) {
      const i3 = i * 3;
      // Spread stars in a large sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 150 + Math.random() * 400;

      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = r * Math.cos(phi);

      sizes[i] = 0.5 + Math.random() * 2.5;
      twinklePhases[i] = Math.random() * Math.PI * 2;
      twinkleSpeeds[i] = 0.3 + Math.random() * 1.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Custom shader for smooth round points with twinkle
    const vertexShader = `
      attribute float size;
      varying float vAlpha;
      uniform float uTime;
      
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (800.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
        
        // Twinkle based on position hash
        float phase = position.x * 0.01 + position.y * 0.013 + position.z * 0.007;
        float speed = 0.4 + fract(sin(phase * 43758.5453) * 1000.0) * 1.2;
        vAlpha = 0.6 + 0.4 * sin(uTime * speed + phase);
      }
    `;

    const fragmentShader = `
      varying float vAlpha;
      
      void main() {
        // Smooth circle
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        
        float alpha = vAlpha * (1.0 - smoothstep(0.2, 0.5, dist));
        
        // Slightly warm-silver color
        gl_FragColor = vec4(0.85, 0.87, 0.9, alpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // ── Subtle nebula fog planes ──
    const nebulaGeo = new THREE.PlaneGeometry(800, 800);
    const nebulaMat = new THREE.MeshBasicMaterial({
      color: 0x1a1a2e,
      transparent: true,
      opacity: 0.04,
      side: THREE.DoubleSide,
    });
    const nebula1 = new THREE.Mesh(nebulaGeo, nebulaMat);
    nebula1.position.z = -200;
    nebula1.rotation.z = 0.3;
    scene.add(nebula1);

    const nebulaMat2 = new THREE.MeshBasicMaterial({
      color: 0x0a0a1a,
      transparent: true,
      opacity: 0.03,
      side: THREE.DoubleSide,
    });
    const nebula2 = new THREE.Mesh(nebulaGeo, nebulaMat2);
    nebula2.position.z = -100;
    nebula2.rotation.z = -0.5;
    scene.add(nebula2);

    // TEST CUBE
    const box = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), new THREE.MeshBasicMaterial({color: 0xff0000}));
    scene.add(box);


    // ── Mouse tracking ──
    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      targetRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // ── Resize ──
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // ── Animate ──
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Update time uniform for twinkle
      material.uniforms.uTime.value = elapsed;

      // Slow continuous drift
      points.rotation.y = elapsed * 0.008;
      points.rotation.x = elapsed * 0.003;

      // Smooth mouse parallax (lerp toward target)
      mouseRef.current.x += (targetRef.current.x - mouseRef.current.x) * 0.02;
      mouseRef.current.y += (targetRef.current.y - mouseRef.current.y) * 0.02;

      points.rotation.y += mouseRef.current.x * 0.015;
      points.rotation.x += mouseRef.current.y * 0.01;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="three-bg"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
