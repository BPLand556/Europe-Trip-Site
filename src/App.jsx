import React, { useEffect } from "react";
import MapView from "./MapView";
import "./styles.css";

export default function App() {
  useEffect(() => {
    const root = document.documentElement;
    const hero = document.getElementById("hero");

    let ticking = false;
    const update = () => {
      ticking = false;
      if (!hero) return;
      // If the hero's bottom is at or above the top of the viewport, hide it.
      const bottom = hero.getBoundingClientRect().bottom;
      if (bottom <= 0) root.classList.add("hero-hidden");
      else root.classList.remove("hero-hidden");
    };

    const onScrollOrResize = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update(); // run once on load
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

    // Hide hero first so there are truly zero leftover pixels.
    root.classList.add("hero-hidden");

    // Then scroll to the exact top of the map.
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