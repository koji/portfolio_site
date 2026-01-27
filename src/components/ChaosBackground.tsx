import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ChaosBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    const mount = mountRef.current;

    const updateSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      // Optimize pixel ratio for performance (max 1.5 to save GPU on high-DPI screens)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      if (material.uniforms.iResolution) {
        material.uniforms.iResolution.value.set(width, height, 1);
      }
    };

    mount.appendChild(renderer.domElement);

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform vec3 iResolution;
      uniform float iTime;

      float sdOctahedron(vec3 p, float s) {
          p = abs(p);
          return (p.x + p.y + p.z - s) * 0.57735027;
      }

      float sdTorus(vec3 p, vec2 t) {
          vec2 q = vec2(length(p.xy) - t.x, p.z);
          return length(q)-t.y;
      }

      float sdBox(vec3 p, vec3 b) {
          vec3 q = abs(p) -b;
          return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
      }

      float sdTetrahedron( vec3 p, float g ) {
          float angle = 0.86 + iTime * 0.75;
          float c = cos(angle);
          float s = sin(angle);
          mat2 rot = mat2(c, -s, s, c);
          p.xz = rot * p.xz;

          const vec3 n1 = normalize(vec3( 1.0, 1.0, 1.0));
          const vec3 n2 = normalize(vec3( 1.0,-1.0,-1.0));
          const vec3 n3 = normalize(vec3(-1.0, 1.0,-1.0));
          const vec3 n4 = normalize(vec3(-1.0,-1.0, 1.0));
          return max(max(dot(p,n1), dot(p,n2)), max(dot(p,n3), dot(p,n4))) - g;
      }

      float opSmoothUnion(float d1, float d2, float k) {
          float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
          return mix(d2, d1, h) - k * h * (1.0 - h);
      }

      float map(vec3 p) {
          float res = 1e9;
          
          // Reduced iterations from 100 to 50 for performance optimization
          for (int i = 0; i < 50; i++) {
              float fi = float(i);
              float time = iTime * (0.5 + fi * 0.1);
              
              vec3 center = vec3(
                  sin(time + fi * 1.57),
                  cos(time * 0.8 + fi * 2.0),
                  tan(time * 0.2 - fi * 1.0)
              ) * 2.785;
              
              vec3 p_local = p - center;
              
              float rot_angle = iTime * (1.0 + fi * 0.3);
              p_local.xz *= mat2(cos(rot_angle), -sin(rot_angle), sin(rot_angle), cos(rot_angle));
              p_local.xy *= mat2(cos(rot_angle*0.7), -sin(rot_angle*0.7), sin(rot_angle*0.7), cos(rot_angle*0.7));
              
              float shape_dist;
              if(i<15) {
                  shape_dist = sdOctahedron(p_local, 0.7); 
              } else {
                  shape_dist = sdTetrahedron(p_local, 0.3);
              }

              res = opSmoothUnion(res, shape_dist, 0.75);
          }
          
          return res;
      }

      vec3 getNormal(vec3 p) {
          vec2 e = vec2(0.001, 0.0);
          return normalize(vec3(
              map(p + e.xyy) - map(p - e.xyy),
              map(p + e.yxy) - map(p - e.yxy),
              map(p + e.yyx) - map(p - e.yyx)
          ));
      }

      void mainImage(out vec4 fragColor, in vec2 fragCoord) {
          vec2 uv = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;

          float angle = iTime * 0.15;
          vec3 ro = vec3(sin(angle) * 12.0, 1.5, cos(angle) * 8.0);
          vec3 ta = vec3(0.0, 0.0, 0.0);
          vec3 ww = normalize(ta - ro);
          vec3 uu = normalize(cross(vec3(0.0, 1.0, 0.0), ww));
          vec3 vv = cross(ww, uu);
          vec3 rd = normalize(uv.x * uu + uv.y * vv + 2.0 * ww);

          float t = 0.0;
          // Reduced iterations from 100 to 60 for performance
          for (int i = 0; i < 60; i++) {
              vec3 p = ro + rd * t;
              float d = map(p);
              if (d < 0.001) break;
              t += d;
              if (t > 20.0) break;
          }

          vec3 col = vec3(0.0);
          if (t < 20.0) {
              vec3 p = ro + rd * t;
              vec3 n = getNormal(p);
              
              vec3 c1 = 0.5 + 0.5 * cos(iTime * 0.8 + vec3(0,1,2));
              vec3 c2 = 0.5 + 0.5 * cos(iTime * 0.5 + vec3(2,0,1));
              col = mix(c1, c2, smoothstep(-1.0, 1.0, n.y));
              
              float fresnel = pow(1.0 + dot(rd, n), 3.0);
              col += vec3(1.0) * fresnel * 0.5;
          }
          
          fragColor = vec4(col, 1.0);
      }

      void main() {
        mainImage(gl_FragColor, gl_FragCoord.xy);
      }
    `;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector3() },
      },
    });

    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    updateSize();
    window.addEventListener('resize', updateSize);

    let animationFrameId: number;
    const animate = (time: number) => {
      material.uniforms.iTime.value = time * 0.001;
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      window.removeEventListener('resize', updateSize);
      cancelAnimationFrame(animationFrameId);
      mount.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div ref={mountRef} className="absolute inset-0" />
      {/* Semi-transparent overlay to improve text readability */}
      <div className="absolute inset-0 bg-background/50" />
    </div>
  );
};

export default ChaosBackground;
