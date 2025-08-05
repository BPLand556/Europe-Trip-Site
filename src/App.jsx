import React from "react";
import Hero from "./Hero";
import MapView from "./MapView";

export default function App() {
  return (
    <>
      <Hero />
      <section id="mapSection">
        <MapView />
      </section>
    </>
  );
} 