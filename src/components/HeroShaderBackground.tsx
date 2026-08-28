import { useEffect, useRef, useState } from 'react';

const vertexShaderSource = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

// N=1200 / M=600 に削減してコンパイル成功率を上げる（元 3000/900 はモバイルGPUでコンパイル失敗しやすい）
// 動的インデックス A[int(o)] を分岐に置換
const createFragmentSource = (N: number, M: number) => `
precision highp float;
uniform float iTime;
uniform vec2 iResolution;

void mainImage(out vec4 O, vec2 F)
{
    float t = iTime * 2.4;
    vec2 R = iResolution.xy;
    vec2 v;
    vec3 A = vec3(0.0);

    for(int i = 1; i <= ${N}; i++)
    {
        float fi = float(i);
        float y = fi / ${N.toFixed(1)} * 30.0;
        float k = (4.0 + cos(y)) * cos(fi);
        float e = y / 5.0 - 11.0;
        float d = sqrt(k*k + e*e) - 5.0;
        float o = mod(fi, 2.0);
        float c = d / 2.5 - t / 2.0 + o * 8.0;

        v = 200.0 * (F + F - R) / min(R.x, R.y)
          - vec2( (79.0 + k*k) * cos(c)
                ,  99.0 * sin(c/3.0)
                  + d*d * sin(t+t - d)
                  + 3.0 * sin(k+k)
                  + sin(y/9.0 + 6.0) * k * (e + sin((e-d)*4.0))
                 );
        float contrib = 3600.0 / (4.0 + dot(v,v));
        if(o < 0.5) A.x -= contrib; else A.y -= contrib;
    }

    for(int j = 0; j < ${M}; j++)
    {
        float fj = float(j);
        float fi = floor(fj / 60.0);
        float pj = mod(fj, 60.0);
        float h1 = fract(sin(fj*127.1)*43758.5);
        float h2 = fract(sin(fj*269.5)*12345.67);
        float speed = 0.7 + fract(sin(fi*12.34)*43758.5)*0.35;
        float cx = mod(fi*34.0 + t*70.0*speed - 100.0, 520.0) - 260.0;
        float cy = sin(fi*0.9 + t*0.45)*38.0 + cos(fi*1.31)*18.0 + sin(t*0.7+fi)*8.0;

        float lx;
        float ly;
        if(pj < 45.0)
        {
            float ang = h1*6.28318;
            float rad = sqrt(h2);
            lx = cos(ang)*15.0*rad + 3.0;
            ly = sin(ang)*7.0*rad;
            ly += sin(lx*0.35 + t*9.0 + fi)*1.2;
        }
        else
        {
            lx = -14.0 - h1*9.0;
            ly = (h2-0.5)*12.0 * (1.0-abs(lx+18.5)/9.5);
            ly += sin(t*12.0 + fi*2.0 + pj)*2.5;
        }

        v = 200.0 * (F+F - R) / min(R.x,R.y) - vec2(cx+lx, cy+ly);
        float w = pj < 45.0 ? 1.0 : 0.75;
        A.z -= w * 4200.0 / (6.0 + dot(v,v));
    }

    float Nf = ${N.toFixed(1)};
    float Mf = ${M.toFixed(1)};
    A = vec3(1.0-exp(A.x/Nf), 1.0-exp(A.y/Nf), 1.0-exp(A.z/Mf*1.6));
    O.rgb = vec3(0.035)
          +  A.x * vec3(1.0,  0.74, 0.24)
          +  A.y * vec3(0.78, 0.83, 0.9)
          +  A.z * vec3(0.12, 0.42, 0.95);
    O.a = 1.0;
}

void main() {
    vec4 O;
    mainImage(O, gl_FragCoord.xy);
    gl_FragColor = O;
}
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    console.warn('[HeroShader] compile error:', log);
    (window as unknown as Record<string, unknown>).__heroShaderError = log;
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string): WebGLProgram | null {
  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) {
    if (vs) gl.deleteShader(vs);
    if (fs) gl.deleteShader(fs);
    return null;
  }
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  // shaders can be deleted after link
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn('[HeroShader] link error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

export const HeroShaderBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const [fallback, setFallback] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Try WebGL2 first, then WebGL1
    const gl =
      (canvas.getContext('webgl2', { alpha: false, antialias: false }) as WebGLRenderingContext | null) ??
      (canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'high-performance' }) as WebGLRenderingContext | null) ??
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);

    if (!gl) {
      console.warn('[HeroShader] WebGL not supported - fallback');
      setFallback(true);
      setDebugInfo('WebGL not supported');
      return;
    }

    // Try high quality first, fallback to low if compile fails
    let program: WebGLProgram | null = null;
    let N = 1200;
    let M = 600;
    // Mobile: further reduce
    const isMobile = window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent);
    if (isMobile) {
      N = 800;
      M = 360;
    }

    const tryCreate = (n: number, m: number) => createProgram(gl, vertexShaderSource, createFragmentSource(n, m));

    program = tryCreate(N, M);
    if (!program && (N > 600 || M > 300)) {
      console.warn(`[HeroShader] retry with lower quality N=600 M=300`);
      N = 600;
      M = 300;
      program = tryCreate(N, M);
    }
    if (!program) {
      console.warn('[HeroShader] all shader variants failed, using fallback');
      setFallback(true);
      setDebugInfo('shader compile failed - see console');
      return;
    }

    console.log(`[HeroShader] shader compiled OK N=${N} M=${M}`);

    const positionLoc = gl.getAttribLocation(program, 'position');
    const timeLoc = gl.getUniformLocation(program, 'iTime');
    const resLoc = gl.getUniformLocation(program, 'iResolution');

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReducedMotion = mediaQuery.matches;
    console.log('[HeroShader] prefersReducedMotion:', prefersReducedMotion);
    // アニメーションは常に実行。reduce の場合は速度を落とすのみ（完全停止はしない）
    let isVisible = document.visibilityState === 'visible';
    const onVisibility = () => {
      isVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', onVisibility);

    const getDpr = () => Math.min(window.devicePixelRatio || 1, 1.8) * (isMobile ? 0.5 : 0.7);

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = getDpr();
      // parent may have 0 height initially (Hero content not laid out) -> fallback to 700px
      const cssW = Math.max(1, Math.round(rect.width || window.innerWidth));
      const cssH = Math.max(1, Math.round(rect.height || 700));
      const w = Math.max(1, Math.floor(cssW * dpr));
      const h = Math.max(1, Math.floor(cssH * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        // CSS size stays 100% via class, but ensure parent has size
        gl.viewport(0, 0, w, h);
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    window.addEventListener('resize', resize);
    // also observe section height changes (content)
    const section = document.getElementById('home');
    if (section) ro.observe(section);

    const startTime = performance.now();
    let stopped = false;

    const render = () => {
      if (stopped) return;
      rafRef.current = requestAnimationFrame(render);
      if (!isVisible) return;
      const now = (performance.now() - startTime) / 1000;
      const t = prefersReducedMotion ? now * 0.3 : now; // reduce motion は 30% 速度で継続
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(positionLoc);
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
      if (timeLoc) gl.uniform1f(timeLoc, t);
      if (resLoc) gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    render();

    return () => {
      stopped = true;
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', resize);
      ro.disconnect();
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
    };
  }, []);

  if (fallback) {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        style={{
          background:
            'radial-gradient(ellipse at 30% 20%, rgba(119,102,228,0.35), transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,66,149,0.4), transparent 60%), #0f1220',
        }}
        title={debugInfo}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full pointer-events-none"
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
};

export default HeroShaderBackground;
