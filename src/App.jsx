import React, { useEffect, useRef } from "react";
import MapView from "./MapView";
import "./styles.css";

export default function App() {
  const overlayRef = useRef(null);

  useEffect(() => {
    let vh = window.innerHeight;

    const update = () => {
      // progress from 0 → 1 as you scroll one viewport height
      const p = Math.max(0, Math.min(1, window.scrollY / vh));
      if (overlayRef.current) {
        overlayRef.current.style.setProperty("--p", String(p));
        // once fully past, remove from rendering so 0 pixels remain
        if (p >= 1) overlayRef.current.classList.add("hidden");
        else overlayRef.current.classList.remove("hidden");
      }
    };

    const onResize = () => { vh = window.innerHeight; update(); };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const goToMap = () => {
    // jump exactly one viewport down (same height as the spacer)
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <main className="page">
      {/* FIXED overlay (not in layout) */}
      <div ref={overlayRef} className="hero-overlay">
        <h1>The Adventures of Billy and Bobby</h1>
        <p>A European Journey</p>
        <button className="scroll-btn" onClick={goToMap}>SCROLL ↓</button>
      </div>

      {/* Spacer that provides the scroll distance of the hero */}
      <div className="hero-spacer" aria-hidden="true" />

      {/* Real content starts immediately with the map at the top */}
      <section id="mapSection" className="map-section">
        <MapView />
      </section>
    </main>
  );
} 