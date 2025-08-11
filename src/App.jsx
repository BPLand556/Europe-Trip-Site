import React from "react";
import MapView from "./MapView";
import "./styles.css";

export default function App() {
  const goToMap = () => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    // scroll to the exact bottom of the hero, regardless of vh / svh quirks
    const targetY = hero.offsetTop + hero.offsetHeight;
    window.scrollTo({ top: targetY, behavior: "smooth" });
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