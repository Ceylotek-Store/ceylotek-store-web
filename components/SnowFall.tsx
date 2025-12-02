"use client";

import { useEffect, useRef } from "react";

const SnowFall = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Configuration
    const flakeCount = 150; // Number of snowflakes
    const flakes: { x: number; y: number; radius: number; speed: number; opacity: number; sway: number }[] = [];

    // Set canvas to full screen
    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener("resize", setSize);

    // Initialize flakes
    for (let i = 0; i < flakeCount; i++) {
      flakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1, // Size between 1px and 4px
        speed: Math.random() * 1.5 + 0.5, // Speed
        opacity: Math.random() * 0.5 + 0.3, // Random transparency
        sway: Math.random() * 20 // Random sway offset
      });
    }

    // Animation Loop
    let animationFrameId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      flakes.forEach((flake) => {
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
        ctx.fill();

        // Move flake
        flake.y += flake.speed;
        // Gentle sway movement using Sine wave
        flake.x += Math.sin(flake.y / 50 + flake.sway) * 0.5;

        // Reset flake if it goes off screen
        if (flake.y > canvas.height) {
          flake.y = -5;
          flake.x = Math.random() * canvas.width;
        }
        if (flake.x > canvas.width) {
          flake.x = 0;
        } else if (flake.x < 0) {
          flake.x = canvas.width;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", setSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-50 pointer-events-none"
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default SnowFall;