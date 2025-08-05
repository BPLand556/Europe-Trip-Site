import React from "react";

export default function Hero() {
  return (
    <section className="hero">
      <h1>The Adventures of Billy and Bobby</h1>
      <p>A European Journey</p>
      <button
        className="scroll-btn"
        onClick={() =>
          document
            .getElementById("mapSection")
            .scrollIntoView({ behavior: "smooth" })
        }
      >
        SCROLL ↓
      </button>
    </section>
  );
} 