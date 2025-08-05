import React from 'react';
import MapView from './MapView.jsx';

export default function App() {
  const scrollToMap = () => {
    document.getElementById('map-section').scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <div className="app">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">The Adventures of Billy and Bobby</h1>
          <p className="hero-subtitle">A European Journey</p>
        </div>
        <button className="scroll-button" onClick={scrollToMap}>
          <span>SCROLL</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 13l5 5 5-5"/>
            <path d="M7 6l5 5 5-5"/>
          </svg>
        </button>
      </section>

      {/* Map Section */}
      <section id="map-section" className="map-section">
        <MapView />
      </section>
    </div>
  );
} 