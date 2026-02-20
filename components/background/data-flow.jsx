"use client";

// npm i p5
import { useEffect, useRef } from 'react';
import p5 from 'p5';

export default function DataFlowBackground() {
  const sketchRef = useRef();

  useEffect(() => {
    const sketch = (p) => {
      let particles = [];
      const numParticles = 30;

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        for (let i = 0; i < numParticles; i++) {
          particles.push({
            pos: p.createVector(p.random(p.width), p.random(p.height)),
            vel: p.createVector(p.random(-0.5, 0.5), p.random(-0.5, 0.5)),
            acc: p.createVector(0, 0),
            size: p.random(3, 6),
            dataStream: [] // Untuk menyimpan partikel data yang mengalir
          });
        }
      };

      p.draw = () => {
        p.background(10, 10, 20, 25); // Efek trail dengan transparansi
        
        p.stroke(100, 255, 255, 100);
        p.strokeWeight(0.5);
        
        // Hubungkan partikel dan alirkan data
        particles.forEach((p1, i) => {
          particles.slice(i + 1).forEach((p2) => {
            let d = p5.Vector.dist(p1.pos, p2.pos);
            if (d < 200) {
              p.line(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y);
              
              // Gambar "data blok" yang bergerak di sepanjang garis koneksi
              if (p.frameCount % 30 === 0 && p.random() < 0.1) { // Sesekali munculkan
                p1.dataStream.push({ target: p2, progress: 0 });
              }
            }
          });

          // Update dan gambar data blocks
          p1.dataStream = p1.dataStream.filter(block => {
            block.progress += 0.02;
            if (block.progress >= 1) return false;
            
            let x = p.lerp(p1.pos.x, block.target.pos.x, block.progress);
            let y = p.lerp(p1.pos.y, block.target.pos.y, block.progress);
            
            p.fill(0, 255, 200, 200);
            p.noStroke();
            p.rect(x - 2, y - 2, 4, 4);
            return true;
          });

          // Gerakan partikel utama sedikit
          p1.vel.add(p1.acc);
          p1.pos.add(p1.vel);
          p1.acc.mult(0);
          
          // Pantulkan dari tepi
          if (p1.pos.x < 0 || p1.pos.x > p.width) p1.vel.x *= -1;
          if (p1.pos.y < 0 || p1.pos.y > p.height) p1.vel.y *= -1;
        });
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };

    const p5Instance = new p5(sketch, sketchRef.current);
    return () => p5Instance.remove();
  }, []);

  return <div ref={sketchRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
}