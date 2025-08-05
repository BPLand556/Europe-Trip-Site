import React from 'react';
import MapView from './MapView.jsx';

export default function App() {
  return (
    <div className="app">
      <section className="hero">
        <h1>The Adventures of Billy and Bobby</h1>
        <p>A European Journey</p>
        <button className="scroll-btn" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
          SCROLL ↓
        </button>
      </section>
      <MapView />
    </div>
  );
} 