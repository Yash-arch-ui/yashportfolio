import { useEffect, useRef } from 'react'
import { Renderer, Program, Mesh, Triangle } from 'ogl'

const FAN_MODE = { center: 0, left: 1, right: 2 }

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return [1, 1, 1]
  return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255]
}

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uThreadCount;
uniform float uFrequency;
uniform float uSpread;
uniform float uTaper;
uniform float uPosition;
uniform float uFanMode;
uniform float uGlow;
uniform float uFalloff;
uniform float uThickness;
uniform float uBrightness;
uniform float uOpacity;
uniform float uMirror;
uniform float uShimmer;
uniform float uGrain;
uniform float uGrainIntensity;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform float uEnableMouse;
uniform float uMouseActive;
out vec4 fragColor;

#define TAU 6.28318530718
#define MAX_THREADS 10

float glow(float x, float str, float dist) {
  return dist / pow(max(x, 1e-4), str);
}

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  float n = max(uThreadCount, 1.0);

  float pinchX = uFanMode < 0.5 ? 0.5 : (uFanMode < 1.5 ? 0.0 : 1.0);
  if (uEnableMouse > 0.5) {
    pinchX = mix(pinchX, uMouse.x, clamp(uMouseStrength, 0.0, 1.0) * uMouseActive);
  }

  float spreadDx = uSpread * abs(uv.x - pinchX);
  float baseT = iTime * uSpeed;
  float tauOverN = TAU / n;
  float mirror = uMirror > 0.5 ? sign(pinchX - uv.x) : 1.0;
  bool doShimmer = uShimmer > 0.5;
  float shimmerT = iTime * 1.7;
  float invThickness = 1.0 / max(uThickness, 0.01);
  float xFreq = uv.x * uFrequency;
  float yOff = uv.y - uPosition;
  float ciScale = n > 1.0 ? 1.0 / (n - 1.0) : 0.0;

  vec3 col = vec3(0.0);
  float gsum = 0.0;

  for (int idx = 0; idx < MAX_THREADS; idx++) {
    float i = float(idx);
    if (i >= n) break;

    float amplitude = spreadDx * (1.0 + i * uTaper);
    float shimmer = doShimmer ? sin(shimmerT + i * 1.3) * 0.35 : 0.0;
    float phase = (baseT + i * tauOverN) * mirror + shimmer;

    float sdf = abs(yOff + sin(xFreq + phase) * amplitude) * invThickness;

    float g = glow(sdf, uFalloff, uGlow);
    float ci = i * ciScale;
    vec3 threadCol = mix(uColor1, uColor2, ci);

    col += g * threadCol;
    gsum += g;
  }

  float coreAmt = smoothstep(0.5, 2.2, gsum);
  col = mix(col, uColor3 * gsum, coreAmt * 0.5);

  float bright = uBrightness;
  if (uEnableMouse > 0.5) {
    vec2 md = uv - uMouse;
    float d2 = dot(md, md);
    bright += clamp(uMouseStrength, 0.0, 1.0) * uMouseActive * exp(-d2 * 6.0) * 0.6;
  }
  col *= bright;

  float alpha = clamp(gsum, 0.0, 1.0) * uOpacity;

  vec3 outRgb = col * alpha;

  if (uGrain > 0.5) {
    float gv = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + iTime) * 43758.5453) - 0.5) * uGrainIntensity;
    outRgb = clamp(outRgb + gv, 0.0, 1.0);
    alpha = clamp(alpha + gv, 0.0, 1.0);
  }

  fragColor = vec4(outRgb, alpha);
}
`

const ctxMap = new WeakMap()

/**
 * WebThreads — animated glowing thread field (WebGL2 / ogl), ported from
 * @react-bits/WebThreads to plain JSX.
 *
 * Hardened for use as a site-wide background:
 * - bails out silently if WebGL2 is unavailable or the shader fails to compile
 * - renders the buffer capped at ~1.2MP, stretched to fill the container
 * - respects prefers-reduced-motion (single static frame, re-rendered on resize)
 */
const WebThreads = ({
  color1 = '#5227FF',
  color2 = '#FF9FFC',
  color3 = '#FFFFFF',
  speed = 0.2,
  threadCount = 6,
  frequency = 5.0,
  spread = 0.18,
  taper = 1.0,
  position = 0.5,
  fanMode = 'center',
  glow = 0.02,
  falloff = 0.6,
  thickness = 1.1,
  brightness = 0.6,
  opacity = 1.0,
  mirror = true,
  shimmer = false,
  grain = true,
  grainIntensity = 0.05,
  mouseInteraction = true,
  mouseStrength = 0.3,
  className = '',
}) => {
  const containerRef = useRef(null)
  const mouseRef = useRef({ enabled: true, strength: 0.3 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // WebGL2 + shader setup all inside the try/catch: a failure here must never
    // take the whole site down.
    let renderer, gl, canvas, geometry, program, mesh
    try {
      renderer = new Renderer({
        webgl: 2,
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
      })
      if (!renderer.isWebgl2) throw new Error('WebThreads requires WebGL2')
      gl = renderer.gl
      gl.clearColor(0, 0, 0, 0)
      canvas = gl.canvas
      canvas.style.width = '100%'
      canvas.style.height = '100%'
      canvas.style.display = 'block'
      container.appendChild(canvas)

      geometry = new Triangle(gl)
      program = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
          iTime: { value: 0 },
          iResolution: { value: new Float32Array([1, 1]) },
          uSpeed: { value: 0.2 },
          uThreadCount: { value: 6 },
          uFrequency: { value: 5.0 },
          uSpread: { value: 0.18 },
          uTaper: { value: 1.0 },
          uPosition: { value: 0.5 },
          uFanMode: { value: 0 },
          uGlow: { value: 0.02 },
          uFalloff: { value: 0.6 },
          uThickness: { value: 1.1 },
          uBrightness: { value: 0.6 },
          uOpacity: { value: 1.0 },
          uMirror: { value: 1.0 },
          uShimmer: { value: 0.0 },
          uGrain: { value: 1.0 },
          uGrainIntensity: { value: 0.05 },
          uColor1: { value: new Float32Array([1, 1, 1]) },
          uColor2: { value: new Float32Array([1, 1, 1]) },
          uColor3: { value: new Float32Array([1, 1, 1]) },
          uMouse: { value: new Float32Array([0.5, 0.5]) },
          uMouseStrength: { value: 0.3 },
          uEnableMouse: { value: 1.0 },
          uMouseActive: { value: 0 },
        },
      })
      mesh = new Mesh(gl, { geometry, program })
    } catch (error) {
      // WebGL2 missing or shader failed to compile — container stays empty.
      // Log it so a missing background is diagnosable instead of silently blank.
      console.warn('[WebThreads] background disabled:', error)
      return
    }

    ctxMap.set(container, { renderer, program, mesh })

    const render = () => {
      renderer.render({ scene: mesh })
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Cap the drawing buffer (~1.2MP) so 4K screens and phones stay smooth.
    const MAX_PIXELS = 1200000
    const setSize = () => {
      const rect = container.getBoundingClientRect()
      const w = Math.max(1, Math.floor(rect.width))
      const h = Math.max(1, Math.floor(rect.height))
      const scale = Math.min(1, Math.sqrt(MAX_PIXELS / Math.max(1, w * h * renderer.dpr * renderer.dpr)))
      const bw = Math.max(1, Math.round(w * scale))
      const bh = Math.max(1, Math.round(h * scale))
      renderer.setSize(bw, bh)
      // ogl also sets inline CSS px — override so the buffer stretches to fill
      canvas.style.width = '100%'
      canvas.style.height = '100%'
      const res = program.uniforms.iResolution.value
      res[0] = gl.drawingBufferWidth
      res[1] = gl.drawingBufferHeight
      render()
    }

    const ro = new ResizeObserver(setSize)
    ro.observe(container)
    setSize()

    const currentMouse = [0.5, 0.5]
    const targetMouse = [0.5, 0.5]
    let currentActive = 0
    let targetActive = 0

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      targetMouse[0] = (e.clientX - rect.left) / rect.width
      targetMouse[1] = 1.0 - (e.clientY - rect.top) / rect.height
      targetActive = 1
    }
    const onMouseEnter = () => {
      targetActive = 1
    }
    const onMouseLeave = () => {
      targetActive = 0
    }
    if (mouseInteraction) {
      canvas.addEventListener('mousemove', onMouseMove)
      canvas.addEventListener('mouseenter', onMouseEnter)
      canvas.addEventListener('mouseleave', onMouseLeave)
    }

    const t0 = performance.now()
    let raf = 0

    const loop = (t) => {
      program.uniforms.iTime.value = (t - t0) * 0.001
      currentMouse[0] += 0.05 * (targetMouse[0] - currentMouse[0])
      currentMouse[1] += 0.05 * (targetMouse[1] - currentMouse[1])
      currentActive += 0.05 * (targetActive - currentActive)
      const mouse = program.uniforms.uMouse.value
      mouse[0] = currentMouse[0]
      mouse[1] = currentMouse[1]
      program.uniforms.uMouseActive.value = currentActive
      program.uniforms.uEnableMouse.value = mouseRef.current.enabled ? 1.0 : 0.0
      program.uniforms.uMouseStrength.value = mouseRef.current.strength
      render()
      raf = requestAnimationFrame(loop)
    }

    let isVisible = true
    let isPageVisible = !document.hidden

    const tryStart = () => {
      if (reduced) return
      if (isVisible && isPageVisible && raf === 0) raf = requestAnimationFrame(loop)
    }
    const tryStop = () => {
      if (raf !== 0) {
        cancelAnimationFrame(raf)
        raf = 0
      }
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
        isVisible ? tryStart() : tryStop()
      },
      { threshold: 0 },
    )
    io.observe(container)

    const onVisibility = () => {
      isPageVisible = !document.hidden
      isPageVisible ? tryStart() : tryStop()
    }
    document.addEventListener('visibilitychange', onVisibility)

    const cleanup = () => {
      tryStop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      if (mouseInteraction) {
        canvas.removeEventListener('mousemove', onMouseMove)
        canvas.removeEventListener('mouseenter', onMouseEnter)
        canvas.removeEventListener('mouseleave', onMouseLeave)
      }
      ctxMap.delete(container)
      try {
        container.removeChild(canvas)
      } catch {
        // canvas may already be gone
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }

    if (reduced) {
      // static frame already drawn by setSize()
      return cleanup
    }

    tryStart()
    return cleanup
  }, [mouseInteraction])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const ctx = ctxMap.get(container)
    if (!ctx) return
    const { program } = ctx
    const u = program.uniforms

    u.uSpeed.value = speed
    u.uThreadCount.value = Math.round(threadCount)
    u.uFrequency.value = frequency
    u.uSpread.value = spread
    u.uTaper.value = taper
    u.uPosition.value = position
    u.uFanMode.value = FAN_MODE[fanMode] ?? 0
    u.uGlow.value = glow
    u.uFalloff.value = falloff
    u.uThickness.value = thickness
    u.uBrightness.value = brightness
    u.uOpacity.value = opacity
    u.uMirror.value = mirror ? 1.0 : 0.0
    u.uShimmer.value = shimmer ? 1.0 : 0.0
    u.uGrain.value = grain ? 1.0 : 0.0
    u.uGrainIntensity.value = grainIntensity
    const rgb1 = hexToRgb(color1)
    u.uColor1.value[0] = rgb1[0]
    u.uColor1.value[1] = rgb1[1]
    u.uColor1.value[2] = rgb1[2]
    const rgb2 = hexToRgb(color2)
    u.uColor2.value[0] = rgb2[0]
    u.uColor2.value[1] = rgb2[1]
    u.uColor2.value[2] = rgb2[2]
    const rgb3 = hexToRgb(color3)
    u.uColor3.value[0] = rgb3[0]
    u.uColor3.value[1] = rgb3[1]
    u.uColor3.value[2] = rgb3[2]
    u.uMouseStrength.value = mouseStrength
    u.uEnableMouse.value = mouseInteraction ? 1.0 : 0.0
    mouseRef.current.enabled = mouseInteraction
    mouseRef.current.strength = mouseStrength
  }, [
    color1,
    color2,
    color3,
    speed,
    threadCount,
    frequency,
    spread,
    taper,
    position,
    fanMode,
    glow,
    falloff,
    thickness,
    brightness,
    opacity,
    mirror,
    shimmer,
    grain,
    grainIntensity,
    mouseInteraction,
    mouseStrength,
  ])

  return <div ref={containerRef} className={`relative h-full w-full overflow-hidden ${className}`.trim()} />
}

export default WebThreads
