import React, { useEffect, useRef, useState } from "react";
import MapView from "./MapView";
import "./styles.css";

export default function App() {
  const heroRef = useRef(null);
  const [veilOn, setVeilOn] = useState(true);

  useEffect(() => {
    const onScrollOrResize = () => {
      const hero = heroRef.current;
      if (!hero) return;
      // If any part of the hero is still visible, keep the veil ON
      const bottom = hero.getBoundingClientRect().bottom;
      setVeilOn(bottom > 0);
    };
    onScrollOrResize();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);

  const goToMap = () =>
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });

  return (
    <main className="page">
      {/* 100vh hero in normal flow */}
      <section id="hero" ref={heroRef} className="hero">
        <h1>The Adventures of Billy and Bobby</h1>
        <p>A European Journey</p>
        <button className="scroll-btn" onClick={goToMap}>SCROLL ↓</button>
      </section>

      {/* Map section. The veil is a fixed overlay toggled by hero visibility */}
      <section id="mapSection" className="map-section">
        {veilOn && <div className="map-veil" aria-hidden="true" />}
        <MapView />
      </section>
    </main>
  );
} 