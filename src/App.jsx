import React, { useEffect } from "react";
import MapView from "./MapView";
import "./styles.css";

export default function App() {
  useEffect(() => {
    const root = document.documentElement;
    const hero = document.getElementById("hero");

    // Hide hero as soon as its bottom is within THRESHOLD px of the viewport top.
    // This prevents the map from "stealing" the last bit of scroll.
    const THRESHOLD = 120; // px – tweak if you like

    const onScrollOrResize = () => {
      if (!hero) return;
      const bottom = hero.getBoundingClientRect().bottom;

      // If we're basically at the very top, show hero again.
      if (window.scrollY <= 1) {
        root.classList.remove("hero-hidden");
        return;
      }

      // Hide hero a tad early so no purple sliver can remain.
      if (bottom <= THRESHOLD) root.classList.add("hero-hidden");
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

    // Remove hero first so there are zero leftover pixels
    root.classList.add("hero-hidden");

    // Then scroll to exact top of map
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