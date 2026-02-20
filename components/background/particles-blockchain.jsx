"use client";
// npm install react-tsparticles tsparticles-slim

import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export default function ParticlesBlockchain() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: { value: "transparent" },
        },
        fpsLimit: 60,
        particles: {
          color: { value: "#6b5eff" }, // Warna dasar ungu
          links: {
            color: "#6b5eff",
            distance: 150,
            enable: true,
            opacity: 0.3,
            width: 1,
            triangles: { enable: false } // Bentuk koneksi garis biasa
          },
          move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: true,
            straight: false,
          },
          number: {
            density: { enable: true, area: 800 },
            value: 60, // Jumlah partikel
          },
          opacity: {
            value: 0.6,
            animation: {
              enable: true,
              speed: 0.5,
              minimumValue: 0.2,
            }
          },
          shape: {
            type: "square", // BENTUK KOTAK! Ini yang bikin kesan "block"
          },
          size: {
            value: { min: 1, max: 3 },
            animation: {
              enable: true,
              speed: 2,
              minimumValue: 0.5,
            }
          },
        },
        detectRetina: true,
      }}
      className="absolute inset-0 -z-10"
    />
  );
}