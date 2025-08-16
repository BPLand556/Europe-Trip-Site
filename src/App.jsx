import React, { useEffect } from "react";
import MapView from "./MapView";
import "./styles.css";

export default function App() {
  useEffect(() => {
    const root = document.documentElement;
    const hero = document.getElementById("hero");
    const map = document.getElementById("mapSection");

    // Hide hero a bit early so Leaflet can't trap the last scroll pixels.
    const THRESHOLD = 100; // px (adjust 60–140 if you want earlier/later)

    const onScrollOrResize = () => {
      if (!hero || !map) return;

      const mapTop = map.getBoundingClientRect().top;

      // If user is basically at the very top, show hero again.
      if (window.scrollY <= 1) {
        root.classList.remove("hero-hidden");
        return;
      }

      // Hide hero as soon as the map is within THRESHOLD px of the top.
      if (mapTop <= THRESHOLD) {
        root.classList.add("hero-hidden");
      } else {
        root.classList.remove("hero-hidden");
      }
    };

    onScrollOrResize(); // run once on load
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);

  const goToMap = () => {
    const root = document.documentElement;
    const map = document.getElementById("mapSection");
    if (!map) return;
    root.classList.add("hero-hidden"); // remove hero first → zero leftover pixels
    requestAnimationFrame(() => {
      const top = map.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  };

  return (
    <main className="page">
      <section id="hero" className="hero">
        <h1>The Adventures of Billy and Bobby</h1>
        <p>A European Journey</p>
        <button className="scroll-btn" onClick={goToMap}>SCROLL ↓</button>
      </section>

      <section id="mapSection" className="map-section">
        <MapView />
      </section>
    </main>
  );
} 