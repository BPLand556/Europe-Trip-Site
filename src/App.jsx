import React, { useEffect } from "react";
import MapView from "./MapView";
import "./styles.css";

export default function App() {
  useEffect(() => {
    const hero = document.getElementById("hero");

    const onScroll = () => {
      const pastHero = window.scrollY >= hero.offsetHeight - 1;
      hero.classList.toggle("collapsed", pastHero);
    };

    // run once (in case you load mid-page) and then on scroll
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goToMap = () => {
    const map = document.getElementById("mapSection");
    if (!map) return;
    const top = map.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top, behavior: "smooth" });

    // also collapse hero right after clicking (prevents any brief sliver)
    const hero = document.getElementById("hero");
    hero.classList.add("collapsed");
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