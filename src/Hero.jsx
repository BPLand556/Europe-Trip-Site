import React from "react";

export default function Hero() {
  return (
    <section className="hero">
      <h1>The Adventures of Billy and Bobby</h1>
      <p>A European Journey</p>
      <button
        className="scroll-btn"
        onClick={() =>
          window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
        }
      >
        SCROLL ↓
      </button>
    </section>
  );
} 