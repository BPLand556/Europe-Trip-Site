import React from "react";
import MapView from "./MapView";
import "./styles.css";

export default function App() {
  const goToMap = () =>
    document.getElementById("mapSection")?.scrollIntoView({ behavior: "smooth" });

  return (
    <main className="page">
      <section className="hero" id="hero">
        <h1>The Adventures of Billy and Bobby</h1>
        <p>A European Journey</p>
        <button className="scroll-btn" onClick={goToMap}>SCROLL ↓</button>
      </section>

      <section id="mapSection">
        <MapView />
      </section>
    </main>
  );
} 