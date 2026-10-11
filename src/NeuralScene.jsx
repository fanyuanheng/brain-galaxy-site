import React, { useEffect, useRef } from "react";

// A procedural sculpture, not an anatomical model or measured simulation.
const ROWS = 31,
  COLS = 58;
const neurons = [];
for (let side = -1; side <= 1; side += 2) {
  for (let i = 0; i <= ROWS; i++) {
    const v = (i / ROWS) * Math.PI;
    for (let j = 0; j < COLS; j++) {
      const u = (j / COLS) * Math.PI * 2;
      const fold =
        1 +
        0.095 * Math.sin(u * 7 + Math.sin(v * 7) * 1.8) * Math.sin(v * 11) +
        0.035 * Math.cos(u * 12 - v * 8);
      const lateral = Math.sin(u / 2) * Math.sin(v);
      const cleft = 1 - 0.18 * Math.exp((-lateral * lateral) / 0.018);
      const x = side * (0.022 + 0.88 * lateral * fold);
      const y = 0.73 * Math.cos(v) * fold * cleft;
      const z = 0.68 * Math.cos(u / 2) * Math.sin(v) * fold * cleft;
      neurons.push({
        x,
        y,
        z,
        phase: j * 0.22 + i * 0.17,
        side,
        row: i,
        col: j,
      });
    }
  }
}

export default function NeuralScene({ paused, label }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0,
      width = 0,
      height = 0,
      visible = true,
      time = 0,
      last = 0;
    const pointer = { x: 0, y: 0 };
    const draw = (now = 0) => {
      const animate = !paused && !motion.matches && visible && !document.hidden;
      if (animate && last) time += Math.min(now - last, 40) * 0.001;
      last = now;
      ctx.clearRect(0, 0, width, height);
      const scale = Math.min(width * 0.43, height * 0.405);
      const angle = -0.34 + Math.sin(time * 0.19) * 0.15 + pointer.x * 0.08;
      const tilt = -0.19 + pointer.y * 0.025;
      const cx = width * 0.515,
        cy = height * 0.46;
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 1.6);
      glow.addColorStop(0, "rgba(124,108,185,.1)");
      glow.addColorStop(0.6, "rgba(89,74,141,.035)");
      glow.addColorStop(1, "rgba(34,24,70,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);
      // A quiet orbital reference plane grounds the free-floating network.
      ctx.save();
      ctx.translate(cx, cy + scale * 0.87);
      ctx.rotate(-0.12);
      for (let k = 0; k < 3; k++) {
        ctx.beginPath();
        ctx.ellipse(
          0,
          0,
          scale * (1.2 + k * 0.17),
          scale * (0.28 + k * 0.04),
          0,
          0,
          Math.PI * 2,
        );
        ctx.strokeStyle = `rgba(168,167,202,${0.13 - k * 0.03})`;
        ctx.lineWidth = 0.65;
        ctx.stroke();
      }
      ctx.restore();
      const projected = neurons.map((p) => {
        const rx = p.x * Math.cos(angle) + p.z * Math.sin(angle);
        const rz = -p.x * Math.sin(angle) + p.z * Math.cos(angle);
        const ry = p.y * 0.98 - rz * 0.2;
        const x = rx * Math.cos(tilt) - ry * Math.sin(tilt);
        const y = rx * Math.sin(tilt) + ry * Math.cos(tilt);
        const perspective = 3 / (3 - rz * 0.4);
        return {
          x: cx + x * scale * perspective,
          y: cy + y * scale * perspective,
          z: rz,
          p,
        };
      });
      for (let i = 0; i < projected.length; i++) {
        const a = projected[i];
        const alpha = (a.z + 0.9) / 1.8;
        const color = a.p.side > 0 ? "230,172,159" : "155,149,220";
        ctx.lineWidth = 0.45;
        const next = [
          i + (a.p.col < COLS - 1 ? 1 : 0),
          i + (a.p.row < ROWS ? COLS : 0),
        ];
        for (const index of next) {
          const b = projected[index];
          if (b && index !== i) {
            ctx.strokeStyle = `rgba(${color},${0.035 + alpha * 0.23})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        const wave = Math.pow(
          Math.max(0, Math.sin(a.p.phase - time * 1.25)),
          20,
        );
        const size = 0.45 + alpha * 0.65 + wave * 0.55;
        ctx.fillStyle = `rgba(${color},${0.15 + alpha * 0.5 + wave * 0.3})`;
        ctx.beginPath();
        ctx.arc(a.x, a.y, size, 0, Math.PI * 2);
        ctx.fill();
        if (wave > 0.8 && i % 19 === 0) {
          const g = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, 9);
          g.addColorStop(0, "rgba(255,216,185,.6)");
          g.addColorStop(1, "rgba(255,182,148,0)");
          ctx.fillStyle = g;
          ctx.fillRect(a.x - 9, a.y - 9, 18, 18);
        }
      }
      if (animate) frame = requestAnimationFrame(draw);
    };
    const restart = () => {
      cancelAnimationFrame(frame);
      last = 0;
      draw();
    };
    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      restart();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      restart();
    });
    intersection.observe(canvas);
    const move = (e) => {
      const b = canvas.getBoundingClientRect();
      pointer.x = (e.clientX - b.left) / b.width - 0.5;
      pointer.y = (e.clientY - b.top) / b.height - 0.5;
    };
    canvas.addEventListener("pointermove", move);
    motion.addEventListener("change", restart);
    document.addEventListener("visibilitychange", restart);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      canvas.removeEventListener("pointermove", move);
      motion.removeEventListener("change", restart);
      document.removeEventListener("visibilitychange", restart);
    };
  }, [paused]);
  return (
    <canvas ref={ref} className="neural-canvas" role="img" aria-label={label} />
  );
}
