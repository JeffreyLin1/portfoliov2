"use client";

import { useEffect, useRef, useState } from "react";

type HalftoneVideoProps = {
  src: string;
  className?: string;
  gridSize?: number;
  dotRadius?: number;
  saturation?: number;
  contrast?: number;
  cropTop?: number;
  cropRight?: number;
  cropBottom?: number;
  cropLeft?: number;
};

const VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  v_uv.y = 1.0 - v_uv.y;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_video;
uniform vec2 u_resolution;
uniform float u_gridSize;
uniform float u_dotRadius;
uniform float u_saturation;
uniform float u_contrast;
uniform vec4 u_crop; // top, right, bottom, left

void main() {
  vec2 cellsPerAxis = u_resolution / u_gridSize;
  vec2 pixelPos = v_uv * u_resolution;
  vec2 ownCell = floor(v_uv * cellsPerAxis);

  // Scan a 3x3 neighborhood. Among covering diamonds, pick by z-order
  // (bottom-right cells render in front) so overlap is visible.
  float bestPriority = -1.0;
  vec2 bestCell = ownCell;
  bool hit = false;
  for (int oy = -1; oy <= 1; oy++) {
    for (int ox = -1; ox <= 1; ox++) {
      vec2 cell = ownCell + vec2(float(ox), float(oy));
      vec2 cellPixelCenter = (cell + 0.5) * u_gridSize;
      vec2 d = abs(pixelPos - cellPixelCenter);
      float manhattan = d.x + d.y;
      if (manhattan <= u_dotRadius) {
        float priority = cell.y * 10000.0 + cell.x;
        if (priority > bestPriority) {
          bestPriority = priority;
          bestCell = cell;
          hit = true;
        }
      }
    }
  }

  if (!hit) {
    discard;
  }

  vec2 sampleUv = (bestCell + 0.5) / cellsPerAxis;
  // remap sampleUv into the cropped region of the video.
  // u_crop is (top, right, bottom, left); sampleUv.y=0 is top of video.
  vec2 cropMin = vec2(u_crop.w, u_crop.x);
  vec2 cropMax = vec2(1.0 - u_crop.y, 1.0 - u_crop.z);
  sampleUv = cropMin + sampleUv * (cropMax - cropMin);
  vec3 color = texture2D(u_video, sampleUv).rgb;

  float luma = dot(color, vec3(0.299, 0.587, 0.114));
  color = mix(vec3(luma), color, u_saturation);
  color = clamp((color - 0.5) * u_contrast + 0.5, 0.0, 1.0);

  gl_FragColor = vec4(color, 1.0);
}
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile error: ${log}`);
  }
  return shader;
}

export default function HalftoneVideo({
  src,
  className = "",
  gridSize = 13,
  dotRadius = 11.5,
  saturation = 1.3,
  contrast = 1,
  cropTop = 0,
  cropRight = 0.02,
  cropBottom = 0.02,
  cropLeft = 0.02,
}: HalftoneVideoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const gl = canvas.getContext("webgl", { premultipliedAlpha: false, alpha: true });
    if (!gl) return;

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(`Program link error: ${gl.getProgramInfoLog(program)}`);
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const positionLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const u_video = gl.getUniformLocation(program, "u_video");
    const u_resolution = gl.getUniformLocation(program, "u_resolution");
    const u_gridSize = gl.getUniformLocation(program, "u_gridSize");
    const u_dotRadius = gl.getUniformLocation(program, "u_dotRadius");
    const u_saturation = gl.getUniformLocation(program, "u_saturation");
    const u_contrast = gl.getUniformLocation(program, "u_contrast");
    const u_crop = gl.getUniformLocation(program, "u_crop");
    gl.uniform1i(u_video, 0);

    let rafId = 0;
    let cancelled = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(u_resolution, canvas.width, canvas.height);
      gl.uniform1f(u_gridSize, gridSize);
      gl.uniform1f(u_dotRadius, dotRadius);
      gl.uniform1f(u_saturation, saturation);
      gl.uniform1f(u_contrast, contrast);
      gl.uniform4f(u_crop, cropTop, cropRight, cropBottom, cropLeft);
    };

    const render = () => {
      if (cancelled) return;
      resize();
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (video.readyState >= 2) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        if (!ready) setReady(true);
      }
      rafId = requestAnimationFrame(render);
    };

    const playPromise = video.play();
    if (playPromise) playPromise.catch(() => {});
    rafId = requestAnimationFrame(render);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteTexture(texture);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [gridSize, dotRadius, saturation, contrast, cropTop, cropRight, cropBottom, cropLeft]);

  return (
    <div className={`relative aspect-video w-full ${className}`}>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        crossOrigin="anonymous"
        className="absolute inset-0 h-full w-full opacity-0 pointer-events-none"
      />
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full transition-opacity duration-700 ease-out ${ready ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
