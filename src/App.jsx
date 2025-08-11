import React, { useEffect } from "react";
import MapView from "./MapView";
import "./styles.css";

export default function App() {
  useEffect(() => {
    const hero = document.getElementById("hero");
    const io = new IntersectionObserver(
      ([entry]) => {
        // when the hero is completely off-screen, collapse it to 0 height;
        // when it comes back into view, restore it.
        hero.classList.toggle("collapsed", entry.intersectionRatio === 0 && window.scrollY > 0);
      },
      { root: null, threshold: [0, 1] }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  const goToMap = () => {
    const map = document.getElementById("mapSection");
    if (!map) return;
    const top = map.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top, behavior: "smooth" });
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