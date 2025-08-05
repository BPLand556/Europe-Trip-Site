import React from "react";
import Hero from "./Hero";
import MapView from "./MapView";

export default function App() {
  return (
    <>
      <Hero />
      {/* this ID is what we scroll to */}
      <section id="mapSection">
        <MapView />
      </section>
    </>
  );
} 