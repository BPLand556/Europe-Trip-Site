import React, { useEffect } from "react";
import MapView from "./MapView";
import "./styles.css";

export default function App() {
  useEffect(() => {
    const root = document.documentElement;
    const hero = document.getElementById("hero");

    const onScroll = () => {
      if (!hero) return;
      const pastHero = window.scrollY >= hero.offsetHeight - 1;
      if (pastHero) root.classList.add("hero-hidden");
      else if (window.scrollY <= 1) root.classList.remove("hero-hidden");
    };

    onScroll(); // run once on load
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goToMap = () => {
    const root = document.documentElement;
    const map = document.getElementById("mapSection");
    if (!map) return;

    // Remove the hero from layout first so there is zero leftover height.
    root.classList.add("hero-hidden");

    // Next frame (after layout updates), scroll to the exact top of the map.
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