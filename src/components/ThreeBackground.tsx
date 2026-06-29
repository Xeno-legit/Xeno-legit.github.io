import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 55, 120);
    camera.lookAt(0, 25, -400);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0b0420, 1);

    // ═══ SYNTHWAVE GRID FLOOR ═══
    const gridMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec3 vWorldPos;
        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec3 vWorldPos;

        void main() {
          float gridScale = 40.0;
          vec2 gridUV = vWorldPos.xz / gridScale;
          gridUV.y += uTime * 1.2;

          // Crisp grid lines
          vec2 grid = abs(fract(gridUV - 0.5) - 0.5);
          float lineX = smoothstep(0.04, 0.01, grid.x);
          float lineZ = smoothstep(0.04, 0.01, grid.y);
          float line = max(lineX, lineZ);

          // Distance-based fade
          float distFromCenter = length(vWorldPos.xz) / 600.0;
          float fade = 1.0 - smoothstep(0.0, 1.0, distFromCenter);
          fade = pow(fade, 0.7);

          // Color: cyan lines that shift to pink at edges
          float edgeMix = abs(vWorldPos.x) / 400.0;
          edgeMix = clamp(edgeMix, 0.0, 1.0);
          vec3 cyan = vec3(0.0, 0.94, 1.0);
          vec3 pink = vec3(1.0, 0.18, 0.58);
          vec3 color = mix(cyan, pink, edgeMix * 0.6);

          float alpha = line * fade * 0.85;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      side: THREE.DoubleSide,
    });

    const gridGeo = new THREE.PlaneGeometry(1600, 1600, 1, 1);
    gridGeo.rotateX(-Math.PI / 2);
    const gridMesh = new THREE.Mesh(gridGeo, gridMat);
    gridMesh.position.y = -25;
    scene.add(gridMesh);

    // ═══ RETRO SUN — clean circle with horizontal stripe cutouts ═══
    const sunMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;

        void main() {
          vec2 uv = (vUv - 0.5) * 2.0;
          float dist = length(uv);

          // Animated pulse — sun breathes gently
          float pulse = 1.0 + sin(uTime * 0.8) * 0.03;
          float scaledDist = dist / pulse;

          // Clean circle with soft edge
          float circle = 1.0 - smoothstep(0.72, 0.76, scaledDist);

          // Gradient: hot pink top → orange-amber bottom
          vec3 topColor = vec3(1.0, 0.18, 0.58);
          vec3 midColor = vec3(1.0, 0.45, 0.2);
          vec3 botColor = vec3(1.0, 0.72, 0.0);

          float t = (uv.y + 1.0) * 0.5;
          vec3 color;
          if (t > 0.5) {
            color = mix(midColor, topColor, (t - 0.5) * 2.0);
          } else {
            color = mix(botColor, midColor, t * 2.0);
          }

          // Horizontal stripe cutouts — scrolling slowly
          float stripeRegion = step(uv.y, 0.0);
          float stripeY = uv.y * 8.0 - uTime * 0.15;
          float stripeThickness = 0.3 + (1.0 - t) * 0.25;
          float stripe = step(stripeThickness, fract(stripeY));
          float stripeAlpha = 1.0 - (stripeRegion * (1.0 - stripe));

          // Outer glow — faded smoothly so it hits zero well inside the plane edges
          float glow = exp(-scaledDist * 2.5) * 0.35;
          // Kill glow before it reaches the plane boundary
          float edgeFade = 1.0 - smoothstep(0.7, 0.98, abs(vUv.x - 0.5) * 2.0);
          edgeFade *= 1.0 - smoothstep(0.7, 0.98, abs(vUv.y - 0.5) * 2.0);
          glow *= edgeFade;

          vec3 glowColor = vec3(1.0, 0.18, 0.58);

          float alpha = circle * stripeAlpha + glow;
          vec3 finalColor = mix(glowColor, color, circle * stripeAlpha / max(alpha, 0.001));

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
    });

    const sunGeo = new THREE.PlaneGeometry(350, 350);
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunMesh.position.set(0, 40, -500);
    scene.add(sunMesh);

    // ═══ HORIZON GLOW LINE — bright line where grid meets sky ═══
    const horizonGeo = new THREE.PlaneGeometry(1600, 8);
    const horizonMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        void main() {
          float fadeX = 1.0 - pow(abs(vUv.x - 0.5) * 2.0, 2.0);
          float fadeY = 1.0 - abs(vUv.y - 0.5) * 2.0;
          vec3 color = mix(vec3(0.0, 0.94, 1.0), vec3(1.0, 0.18, 0.58), abs(vUv.x - 0.5) * 1.5);
          gl_FragColor = vec4(color, fadeX * fadeY * 0.7);
        }
      `,
    });
    const horizonMesh = new THREE.Mesh(horizonGeo, horizonMat);
    horizonMesh.position.set(0, -25, -500);
    scene.add(horizonMesh);

    // ═══ FLOATING STARS (subtle) ═══
    const STAR_COUNT = 400;
    const starPositions = new Float32Array(STAR_COUNT * 3);
    const starSizes = new Float32Array(STAR_COUNT);
    for (let i = 0; i < STAR_COUNT; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 1200;
      starPositions[i * 3 + 1] = 30 + Math.random() * 300;
      starPositions[i * 3 + 2] = -100 - Math.random() * 800;
      starSizes[i] = 0.5 + Math.random() * 2.0;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

    const starMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        attribute float size;
        varying float vAlpha;
        uniform float uTime;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (200.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
          float phase = position.x * 0.01 + position.z * 0.007;
          vAlpha = 0.3 + 0.5 * sin(uTime * 0.6 + phase);
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float a = vAlpha * (1.0 - smoothstep(0.1, 0.5, d));
          gl_FragColor = vec4(0.9, 0.9, 1.0, a);
        }
      `,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ── Mouse tracking ──
    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      targetRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      gridMat.uniforms.uTime.value = t;
      sunMat.uniforms.uTime.value = t;
      starMat.uniforms.uTime.value = t;

      // Gentle mouse parallax
      mouseRef.current.x += (targetRef.current.x - mouseRef.current.x) * 0.015;
      mouseRef.current.y += (targetRef.current.y - mouseRef.current.y) * 0.015;
      camera.position.x = mouseRef.current.x * 10;
      camera.position.y = 55 + mouseRef.current.y * -5;
      camera.lookAt(0, 25, -400);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      gridGeo.dispose(); gridMat.dispose();
      sunGeo.dispose(); sunMat.dispose();
      horizonGeo.dispose(); horizonMat.dispose();
      starGeo.dispose(); starMat.dispose();
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
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
