"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  color?: string;
}

export default function Particles({
  className,
  quantity = 30,
  staticity = 50,
  ease = 50,
  size = 0.1,
  color = "#ffffff"
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const particles = useRef<Array<{ x: number; y: number; vx: number; vy: number; originX: number; originY: number; size: number }>>([]);
  const mousePosition = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    context.current = canvasRef.current.getContext("2d");

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvasContainerRef.current!);
    
    initParticles();
    
    window.addEventListener("mousemove", handleMouseMove);

    let animationFrame: number;
    const animate = () => {
      if (!context.current) return;
      context.current.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
      updateParticles();
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, [quantity, staticity, ease, size, color]);

  function handleResize() {
    if (!canvasRef.current || !canvasContainerRef.current) return;
    canvasRef.current.width = canvasContainerRef.current.clientWidth;
    canvasRef.current.height = canvasContainerRef.current.clientHeight;
    initParticles();
  }

  function handleMouseMove(e: MouseEvent) {
    if (!canvasContainerRef.current) return;
    const rect = canvasContainerRef.current.getBoundingClientRect();
    mousePosition.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  function initParticles() {
    if (!canvasRef.current) return;
    particles.current = [];
    
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;
    
    for (let i = 0; i < quantity; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles.current.push({
        x,
        y,
        vx: 0,
        vy: 0,
        originX: x,
        originY: y,
        size: Math.random() * size + size / 2,
      });
    }
  }

  function updateParticles() {
    if (!context.current || !canvasRef.current) return;
    
    particles.current.forEach((p) => {
      if (mousePosition.current) {
        const { x: mouseX, y: mouseY } = mousePosition.current;
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 100;
        
        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          p.vx -= (dx / distance) * force / staticity;
          p.vy -= (dy / distance) * force / staticity;
        }
      }
      
      const dx = p.originX - p.x;
      const dy = p.originY - p.y;
      p.vx += dx / staticity;
      p.vy += dy / staticity;
      
      p.vx *= ease / 100;
      p.vy *= ease / 100;
      
      p.x += p.vx;
      p.y += p.vy;
      
      context.current.beginPath();
      context.current.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      context.current.fillStyle = color;
      context.current.fill();
    });
  }

  return (
    <div ref={canvasContainerRef} className={cn("absolute inset-0", className)}>
      <canvas ref={canvasRef} />
    </div>
  );
}
