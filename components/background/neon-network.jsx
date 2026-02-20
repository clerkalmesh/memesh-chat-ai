"use client";
import { useEffect, useRef } from "react";

export default function NeonNetworkBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = (count) => {
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.2, // Kecepatan gerak sangat lambat
          vy: (Math.random() - 0.5) * 0.2,
          radius: Math.random() * 2 + 1,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update dan gambar partikel
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        
        // Pantulkan dari tepi
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#6b5eff'; // Warna neon ungu/kebiruan
        ctx.shadowColor = '#00f3ff';
        ctx.shadowBlur = 10;
        ctx.fill();
      });

      // Gambar garis antar partikel yang berdekatan
      ctx.strokeStyle = 'rgba(100, 100, 255, 0.15)';
      ctx.lineWidth = 0.8;
      ctx.shadowBlur = 5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(draw);
    };

    const init = () => {
      resizeCanvas();
      particles = [];
      createParticles(50); // Jumlah node
      draw();
    };

    init();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ background: 'radial-gradient(circle at center, #0a0a2a 0%, #000 100%)' }}
    />
  );
}