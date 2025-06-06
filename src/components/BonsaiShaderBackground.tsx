import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Fragment shader that will render our bonsai-inspired pattern
const fragmentShader = `
  uniform float time;
  uniform vec2 resolution;
  uniform vec3 color;

  // Noise function
  vec2 hash( vec2 p ) {
    p = vec2( dot(p,vec2(127.1,311.7)),
              dot(p,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(p)*43758.5453123);
  }

  // Gradient noise
  float noise( in vec2 p ) {
    const float K1 = 0.366025404;
    const float K2 = 0.211324865;
    
    vec2 i = floor( p + (p.x+p.y)*K1 );
    
    vec2 a = p - i + (i.x+i.y)*K2;
    vec2 o = step(a.yx,a.xy);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0*K2;
    
    vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
    
    vec3 n = h*h*h*h*vec3( dot(a,hash(i+0.0)),
                           dot(b,hash(i+o)),
                           dot(c,hash(i+1.0)));
                           
    return dot( n, vec3(70.0) );
  }

  // Function to draw a tree-like structure
  float tree(vec2 p, float scale) {
    // Trunk
    float trunk = smoothstep(0.05 * scale, 0.03 * scale, abs(p.x)) * smoothstep(1.0 * scale, 0.0, p.y);
    
    // Branches
    float branch1 = smoothstep(0.03 * scale, 0.01 * scale, abs(p.x - 0.1 * scale - 0.1 * sin(p.y * 10.0)))
                  * smoothstep(0.5 * scale, 0.0, p.y)
                  * smoothstep(-0.5 * scale, 0.0, -p.y);
                  
    float branch2 = smoothstep(0.03 * scale, 0.01 * scale, abs(p.x + 0.1 * scale + 0.1 * sin(p.y * 10.0)))
                  * smoothstep(0.5 * scale, 0.0, p.y)
                  * smoothstep(-0.5 * scale, 0.0, -p.y);
    
    // Leaves/foliage patterns
    vec2 q = p;
    q.x += 0.05 * sin(q.y * 10.0 + time * 0.5);
    float n = noise(q * 10.0) * 0.5 + 0.5;
    float leaves = smoothstep(0.7, 0.9, n) * smoothstep(0.8 * scale, 0.0, length(p - vec2(0.0, -0.2 * scale)));
    
    return max(max(trunk, max(branch1, branch2)), leaves);
  }

  void main() {
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= resolution.x / resolution.y;
    
    float treeVal = 0.0;
    
    // Draw multiple bonsai trees
    treeVal += tree(uv - vec2(-0.5, 0.2), 0.3);
    treeVal += tree(uv - vec2(0.4, -0.3), 0.2);
    treeVal += tree(uv - vec2(0.0, 0.0), 0.4);
    
    // Output color
    gl_FragColor = vec4(color * treeVal, treeVal * 0.5);
  }
`;

// Vertex shader (simple pass-through)
const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

interface BonsaiShaderBackgroundProps {
  className?: string;
}

const BonsaiShaderBackground = ({ className }: BonsaiShaderBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>();
  const scene = useRef<THREE.Scene>();
  const camera = useRef<THREE.Camera>();
  const renderer = useRef<THREE.WebGLRenderer>();
  const uniforms = useRef<{ [key: string]: THREE.IUniform }>();

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup scene
    scene.current = new THREE.Scene();
    camera.current = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Create renderer
    renderer.current = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.current.setSize(window.innerWidth, window.innerHeight);
    renderer.current.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.current.domElement);

    // Create shader uniforms
    uniforms.current = {
      time: { value: 0.0 },
      resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      color: {
        value: document.documentElement.classList.contains('dark')
          ? new THREE.Vector3(0.8, 0.8, 0.8) // light gray in dark mode
          : new THREE.Vector3(0.1, 0.1, 0.1), // dark gray in light mode
      },
    };

    // Create shader material
    const material = new THREE.ShaderMaterial({
      fragmentShader,
      vertexShader,
      uniforms: uniforms.current,
      transparent: true,
    });

    // Create a simple plane to display our shader
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.current.add(mesh);

    // Animation loop
    const animate = () => {
      if (uniforms.current) {
        uniforms.current.time.value += 0.005;
      }

      if (renderer.current && scene.current && camera.current) {
        renderer.current.render(scene.current, camera.current);
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (renderer.current && uniforms.current) {
        renderer.current.setSize(window.innerWidth, window.innerHeight);
        uniforms.current.resolution.value.set(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    // Handle theme change
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'class' && mutation.target === document.documentElement) {
          const isDark = document.documentElement.classList.contains('dark');
          if (uniforms.current) {
            uniforms.current.color.value = isDark
              ? new THREE.Vector3(0.8, 0.8, 0.8) // light gray in dark mode
              : new THREE.Vector3(0.1, 0.1, 0.1); // dark gray in light mode
          }
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (containerRef.current && renderer.current) {
        containerRef.current.removeChild(renderer.current.domElement);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 z-0 opacity-10 dark:opacity-5 overflow-hidden ${
        className || ''
      }`}
      aria-hidden="true"
    />
  );
};

export default BonsaiShaderBackground;
