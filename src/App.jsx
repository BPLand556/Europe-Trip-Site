import React, { useEffect } from "react";
import MapView from "./MapView";
import "./styles.css";

export default function App() {
  // Hard-override anything that might be disabling scroll on the root
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    html.style.height = "auto";
    html.style.overflowY = "auto";
    body.style.height = "auto";
    body.style.overflowY = "auto";
  }, []);

  const scrollToMap = () => {
    const el = document.getElementById("mapSection");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <main className="page">
      <section id="hero" className="hero">
        <h1>The Adventures of Billy and Bobby</h1>
        <p>A European Journey</p>
        <button className="scroll-btn" onClick={scrollToMap}>SCROLL ↓</button>
      </section>

      <section id="mapSection" className="map-section">
        <MapView />
      </section>
    </main>
  );
} 